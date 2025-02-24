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
    let octokit = new Octokit({
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
    
    console.log('Pobieram wszystkie commity z paginacją...');
    
    // Pobieramy wszystkie commity z paginacją
    let allCommits = [];
    let page = 1;
    let hasNextPage = true;
    
    // Pobieramy commity strona po stronie (paginacja)
    while (hasNextPage) {
      console.log(`Pobieranie strony ${page} commitów...`);
      const { data: commits, headers } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 100, // Maksymalna liczba commitów na stronę
        page: page
      });
      
      if (commits.length === 0) {
        hasNextPage = false;
      } else {
        allCommits = [...allCommits, ...commits];
        page++;
        
        // Sprawdź czy są jeszcze strony do pobrania (z nagłówków)
        if (headers.link) {
          hasNextPage = headers.link.includes('rel="next"');
        } else {
          hasNextPage = false;
        }
      }
    }
    
    console.log(`Znaleziono łącznie ${allCommits.length} commitów`);
    
    // Filtrujemy merge commity i commity bota
    const filteredCommits = allCommits.filter(commit => {
      // Ignoruj commity od dependabot
      if (commit.author && commit.author.login === 'dependabot[bot]') {
        return false;
      }
      
      // Ignoruj merge commity
      if (commit.commit.message.startsWith('Merge')) {
        return false;
      }
      
      return true;
    });
    
    console.log(`Po filtrowaniu pozostało ${filteredCommits.length} commitów`);
    
    // Pobieramy datę ostatniego commita (po filtrowaniu)
    const lastCommitDate = filteredCommits.length > 0 ? filteredCommits[0].commit.author.date : null;
    
    // Słownik mapowania nazw użytkowników na "Filip"
    const nameMapping = {
      'Filip Pocztarski': 'Filip',
      'philornot': 'Filip',
      'Phil': 'Filip',
      'Julian Z': 'Julian',
      'Julian': 'Julian',
      'Mateusz Olczyk': 'Mateusz',
      'matiyuyg': 'Mateusz',
      'Matiyuyg': 'Mateusz',
      'smyczynskidominik': 'Dominik',
      'eevee2212': 'Dominik',
      'Konrad K': 'Konrad',
      'Faworek9': 'Konrad',
      'Sheeper': 'Franek',
      'Sheeper _1': 'Franek',
      'Sheeper _': 'Franek',
      'Sh33per': 'Franek'
    };
    
    // Zliczamy commity według autorów
    const authorStats = {};
    filteredCommits.forEach(commit => {
      // Wyciągamy nazwę autora
      let authorName = commit.commit.author.name;
      
      // Mapowanie imion i nazwisk według słownika
      authorName = nameMapping[authorName] || authorName;
      
      if (!authorStats[authorName]) {
        authorStats[authorName] = 0;
      }
      authorStats[authorName]++;
    });
    
    // Formatujemy wyniki
    const formattedStats = Object.entries(authorStats).map(([author, count]) => ({
      author,
      count,
      percentage: Math.round((count / filteredCommits.length) * 100)
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
        totalCommits: filteredCommits.length,
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