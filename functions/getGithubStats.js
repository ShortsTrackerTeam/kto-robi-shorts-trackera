const { App } = require('@octokit/app');
const { Octokit } = require('@octokit/rest');

// Obsługa znaków nowej linii w kluczu prywatnym
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
const appId = process.env.GITHUB_APP_ID;
const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;

exports.handler = async function(event, context) {
  try {
    // Konfiguracja GitHub App
    const app = new App({
      appId: appId,
      privateKey: privateKey
    });

    // Generowanie instalacyjnego tokenu dostępu
    const installation = await app.octokit.rest.apps.getRepoInstallation({
      owner,
      repo
    });

    const installationId = installation.data.id;
    const installationAccessToken = await app.getInstallationOctokit(installationId);
    
    // Pobranie danych o commitach
    const commitsResponse = await installationAccessToken.rest.repos.listCommits({
      owner,
      repo,
      per_page: 100 // Maksymalna liczba commitów (można dodać paginację dla większych repozytoriów)
    });

    // Analiza commitów
    const commits = commitsResponse.data;
    const lastCommitDate = commits.length > 0 ? commits[0].commit.author.date : null;
    
    // Zliczanie commitów według autorów
    const authorStats = {};
    commits.forEach(commit => {
      const authorName = commit.commit.author.name;
      if (!authorStats[authorName]) {
        authorStats[authorName] = 0;
      }
      authorStats[authorName]++;
    });
    
    // Formatowanie wyników
    const formattedStats = Object.entries(authorStats).map(([author, count]) => ({
      author,
      count,
      percentage: Math.round((count / commits.length) * 100)
    }));
    
    // Sortowanie według liczby commitów (malejąco)
    formattedStats.sort((a, b) => b.count - a.count);

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
      body: JSON.stringify({ error: 'Wystąpił błąd podczas pobierania danych z GitHub' })
    };
  }
};