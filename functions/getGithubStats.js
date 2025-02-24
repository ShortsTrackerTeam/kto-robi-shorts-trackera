const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

exports.handler = async function(event, context) {
  try {
    // Zmienne środowiskowe
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    
    console.log(`Rozpoczynam pobieranie danych z GitHub dla ${owner}/${repo}`);
    
    // Tworzymy instancję Octokit z uwierzytelnianiem aplikacji
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: appId,
        privateKey: privateKey,
        // Automatyczne wykrywanie instalacji
        installationId: process.env.GITHUB_INSTALLATION_ID,
      }
    });

    // Jeśli nie mamy installation_id, znajdźmy go
    if (!process.env.GITHUB_INSTALLATION_ID) {
      console.log('Próbuję znaleźć ID instalacji...');
      
      // Najpierw znajdź instalacje dla tej aplikacji
      const { data: installations } = await octokit.rest.apps.listInstallations();
      console.log(`Znaleziono ${installations.length} instalacji aplikacji`);
      
      // Znajdź instalację dla konkretnego repozytorium lub właściciela
      const installation = installations.find(inst => 
        inst.account.login.toLowerCase() === owner.toLowerCase()
      );
      
      if (!installation) {
        throw new Error(`Nie znaleziono instalacji dla ${owner}`);
      }
      
      console.log(`Znaleziono instalację ID: ${installation.id}`);
      
      // Wykorzystaj znalezione ID instalacji
      const { data: token } = await octokit.rest.apps.createInstallationAccessToken({
        installation_id: installation.id
      });
      
      // Utwórz nową instancję Octokit z tokenem instalacji
      octokit = new Octokit({ auth: token.token });
    }
    
    console.log('Pobieram listę commitów...');
    
    // Pobranie danych o commitach
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 100 // Maksymalna liczba commitów
    });
    
    console.log(`Znaleziono ${commits.length} commitów`);
    
    // Pobieramy datę ostatniego commita
    const lastCommitDate = commits.length > 0 ? commits[0].commit.author.date : null;
    
    // Zliczamy commity według autorów
    const authorStats = {};
    commits.forEach(commit => {
      const authorName = commit.commit.author.name;
      if (!authorStats[authorName]) {
        authorStats[authorName] = 0;
      }
      authorStats[authorName]++;
    });
    
    // Formatujemy wyniki
    const formattedStats = Object.entries(authorStats).map(([author, count]) => ({
      author,
      count,
      percentage: Math.round((count / commits.length) * 100)
    }));
    
    // Sortujemy według liczby commitów (malejąco)
    formattedStats.sort((a, b) => b.count - a.count);
    
    console.log('Przygotowano dane statystyk');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        totalCommits: commits.length,
        lastCommitDate,
        authorStats: formattedStats
      })
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas pobierania danych z GitHub',
        details: error.message,
        stack: error.stack
      })
    };
  }
};