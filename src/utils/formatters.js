import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Formatuje datę do czytelnego formatu
 * @param {string} dateString - Data w formacie ISO
 * @returns {string} Sformatowana data
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Brak danych';
  
  const date = parseISO(dateString);
  return format(date, 'd MMMM yyyy, HH:mm', { locale: pl });
};

/**
 * Formatuje różnicę czasu względem teraz
 * @param {string} dateString - Data w formacie ISO
 * @returns {string} Tekst reprezentujący upłynięty czas
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Brak danych';
  
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: pl });
};

/**
 * Formatuje procent do dwóch miejsc po przecinku
 * @param {number} value - Wartość procentowa
 * @returns {string} Sformatowany procent
 */
export const formatPercentage = (value) => {
  return `${value?.toFixed(1) || 0}%`;
};

/**
 * Generuje losowe kolory dla wykresów
 * @param {number} count - Liczba kolorów do wygenerowania
 * @returns {string[]} Tablica kolorów w formacie hex
 */
export const generateRandomColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 137) % 360; // Złoty kąt dla dobrego rozłożenia kolorów
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

/**
 * Przygotowuje dane do wykresów kołowych Chart.js
 * @param {Array} data - Dane do przekształcenia
 * @param {string} labelKey - Klucz dla etykiety
 * @param {string} valueKey - Klucz dla wartości
 * @param {Array} colors - Tablica kolorów dla wykresu
 * @returns {Object} Dane przygotowane dla Chart.js
 */
export const prepareChartData = (data, labelKey, valueKey, colors) => {
  if (!data || !data.length) {
    return {
      labels: ['Brak danych'],
      datasets: [{
        data: [100],
        backgroundColor: ['#3C3C3C'],
        borderWidth: 0
      }]
    };
  }

  return {
    labels: data.map(item => item[labelKey]),
    datasets: [{
      data: data.map(item => item[valueKey]),
      backgroundColor: colors.slice(0, data.length),
      borderWidth: 2,
      borderColor: '#191970'
    }]
  };
};