// Funkcje do komunikacji z API (Netlify Functions)

/**
 * Pobiera statystyki z GitHub via Netlify Function
 */
export const fetchGithubStats = async () => {
    try {
      const response = await fetch('/api/getGithubStats');
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      throw error;
    }
  };
  
  /**
   * Pobiera statystyki z Jira via Netlify Function
   */
  export const fetchJiraStats = async () => {
    try {
      const response = await fetch('/api/getJiraStats');
      
      if (!response.ok) {
        throw new Error(`Jira API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Jira stats:', error);
      throw error;
    }
  };