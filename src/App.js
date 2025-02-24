import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GitHubStats from './components/GitHubStats';
import JiraStats from './components/JiraStats';
import { fetchGithubStats, fetchJiraStats } from './utils/api';

function App() {
  const [githubData, setGithubData] = useState(null);
  const [jiraData, setJiraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Funkcja pobierająca dane
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Równoległe zapytania do API
      const [githubResponse, jiraResponse] = await Promise.all([
        fetchGithubStats(),
        fetchJiraStats()
      ]);

      setGithubData(githubResponse);
      setJiraData(jiraResponse);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Wystąpił błąd podczas pobierania danych. Spróbuj odświeżyć stronę.');
    } finally {
      setLoading(false);
    }
  };

  // Pobierz dane przy pierwszym ładowaniu
  useEffect(() => {
    fetchData();

    // Odświeżaj dane co 5 minut
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Wyczyść interwał przy odmontowaniu komponentu
    return () => clearInterval(intervalId);
  }, []);

  // Efekt gradientu w tle
  const gradientStyle = {
    background: `radial-gradient(circle at 10% 20%, ${loading ? '#0000CD' : '#1E1E7E'} 0%, #191970 60%)`,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient w tle */}
      <div style={gradientStyle}></div>
      
      {/* Efekt świetlny w prawym górnym rogu */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl"></div>
      
      <Header onRefresh={fetchData} lastUpdated={lastUpdated} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && !githubData && !jiraData ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary rounded-full border-t-accent animate-spin mb-4"></div>
              <p className="text-primary">Ładowanie danych...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-effect p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-4 py-2 rounded bg-accent text-background font-medium hover:bg-opacity-90 transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {githubData && <GitHubStats data={githubData} />}
            {jiraData && <JiraStats data={jiraData} />}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;