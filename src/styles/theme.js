// Uniwersalne definicje kolorów i stylów
export const theme = {
    colors: {
      background: '#191970',  // midnight blue
      primary: '#ffffff',     // biel
      secondary: {
        100: '#f7f7f7',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
      },
      accent: '#F5BD02',      // królewskie złoto
    },
    
    // Definicje dla Chart.js
    chartColors: {
      github: [
        '#F5BD02',  // Główny kolor - złoty
        '#E3B102',
        '#C79700',
        '#AF8400',
        '#8E6A01',
        '#6E5301',
        '#534000',
        '#382C00',
      ],
      jira: [
        '#F5BD02',  // Główny kolor - złoty
        '#FFCC33',
        '#FFDB70',
        '#FFE699',
        '#FFF0CC',
        '#E3B102',
        '#C79700',
        '#AF8400',
      ],
    },
    
    // Cienie
    shadows: {
      sm: '0 1px 2px rgba(255, 255, 255, 0.05)',
      md: '0 4px 6px rgba(255, 255, 255, 0.1)',
      lg: '0 10px 15px rgba(255, 255, 255, 0.1)',
    },
    
    // Zaokrąglenia
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '1.5rem',
    },
    
    // Odstępy
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
  };
  
  // Opcje dla wykresów kołowych Chart.js
  export const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: theme.colors.primary,
          font: {
            family: 'Inter',
            size: 12,
          },
          boxWidth: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.colors.background,
        bodyColor: theme.colors.background,
        borderColor: theme.colors.accent,
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${context.raw}%`;
          }
        }
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };