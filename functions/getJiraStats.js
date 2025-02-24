const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const host = process.env.JIRA_HOST;
    const username = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    
    // Tworzymy nagłówek Basic Auth dla API Jira
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    
    console.log(`Pobieranie wszystkich zadań z projektu ${projectKey}...`);
    
    // Data początkowa projektu - 14 kwietnia 2024 lub wcześniej
    const startDate = '2024-04-14'; // Format YYYY-MM-DD
    
    // Zapytanie JQL pobierające wszystkie zadania z projektu od daty początkowej
    const jqlQuery = `project = ${projectKey} AND created >= "${startDate}" ORDER BY updated DESC`;
    
    console.log(`Stosowane zapytanie JQL: ${jqlQuery}`);
    
    // Funkcja do pobierania zadań z paginacją
    async function getAllIssues() {
      let allIssues = [];
      let startAt = 0;
      const maxResults = 100;
      let hasMoreIssues = true;
      
      while (hasMoreIssues) {
        console.log(`Pobieranie zadań, startAt=${startAt}, maxResults=${maxResults}`);
        
        const response = await axios.get(`https://${host}/rest/api/3/search`, {
          params: {
            jql: jqlQuery,
            startAt: startAt,
            maxResults: maxResults,
            fields: 'assignee,status,updated,created'
          },
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
        
        const { issues, total } = response.data;
        console.log(`Pobrano ${issues.length} zadań, łącznie: ${total}`);
        
        allIssues = [...allIssues, ...issues];
        
        if (issues.length < maxResults || allIssues.length >= total) {
          hasMoreIssues = false;
        } else {
          startAt += maxResults;
        }
      }
      
      return allIssues;
    }
    
    // Pobierz wszystkie zadania
    const issues = await getAllIssues();
    console.log(`Łącznie pobrano ${issues.length} zadań`);
    
    // Słownik mapowania nazw użytkowników
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
    
    // Zliczamy zadania według przypisanych osób
    const assigneeStats = {};
    let totalTasks = 0;
    
    issues.forEach(issue => {
      totalTasks++;
      
      // Pobierz przypisaną osobę lub "Nieprzypisane"
      let assignee = issue.fields.assignee 
        ? issue.fields.assignee.displayName 
        : 'Nieprzypisane';
      
      // Mapowanie imion i nazwisk na odpowiednie imiona
      assignee = nameMapping[assignee] || assignee;
      
      if (!assigneeStats[assignee]) {
        assigneeStats[assignee] = {
          count: 0,
          statuses: {}
        };
      }
      
      assigneeStats[assignee].count++;
      
      const status = issue.fields.status.name;
      if (!assigneeStats[assignee].statuses[status]) {
        assigneeStats[assignee].statuses[status] = 0;
      }
      assigneeStats[assignee].statuses[status]++;
    });
    
    // Formatowanie wyników z dokładnością do dwóch miejsc po przecinku
    const formattedStats = Object.entries(assigneeStats).map(([assignee, data]) => ({
      assignee,
      count: data.count,
      percentage: ((data.count / totalTasks) * 100).toFixed(2),
      roundedPercentage: Math.round((data.count / totalTasks) * 100),
      statuses: data.statuses
    }));
    
    // Sortowanie według liczby zadań (malejąco)
    formattedStats.sort((a, b) => b.count - a.count);
    
    // Pobieramy ostatnio zaktualizowane zadanie
    const lastUpdatedTask = issues.length > 0 ? {
      key: issues[0].key,
      updated: issues[0].fields.updated,
      assignee: issues[0].fields.assignee ? issues[0].fields.assignee.displayName : 'Nieprzypisane'
    } : null;
    
    // Jeśli jest ostatnio zaktualizowane zadanie, mapujemy imię i nazwisko na odpowiednie imię
    if (lastUpdatedTask) {
      lastUpdatedTask.assignee = nameMapping[lastUpdatedTask.assignee] || lastUpdatedTask.assignee;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        totalTasks,
        lastUpdatedTask,
        assigneeStats: formattedStats
      })
    };
  } catch (error) {
    console.error('Jira API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas pobierania danych z Jira',
        details: error.message,
        stack: error.stack 
      })
    };
  }
};