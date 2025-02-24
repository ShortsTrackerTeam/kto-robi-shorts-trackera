const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const host = process.env.JIRA_HOST;
    const username = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    
    // Tworzymy nagłówek Basic Auth dla API Jira
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    
    // Pobieramy wszystkie zadania z projektu
    const jqlQuery = `project = ${projectKey} ORDER BY updated DESC`;
    const response = await axios.get(`https://${host}/rest/api/3/search`, {
      params: {
        jql: jqlQuery,
        maxResults: 100, // Maksymalna liczba zadań (można dodać paginację dla większych projektów)
        fields: 'assignee,status,updated'
      },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    const issues = response.data.issues;
    
    // Zliczamy zadania według przypisanych osób
    const assigneeStats = {};
    let totalTasks = 0;
    
    issues.forEach(issue => {
      totalTasks++;
      
      const assignee = issue.fields.assignee 
        ? issue.fields.assignee.displayName 
        : 'Nieprzypisane';
      
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
    
    // Formatowanie wyników
    const formattedStats = Object.entries(assigneeStats).map(([assignee, data]) => ({
      assignee,
      count: data.count,
      percentage: Math.round((data.count / totalTasks) * 100),
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
      body: JSON.stringify({ error: 'Wystąpił błąd podczas pobierania danych z Jira' })
    };
  }
};