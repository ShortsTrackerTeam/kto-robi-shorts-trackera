# Kto robi Shorts Trackera?
## Struktura projektu
```
kto-robi-shorts-trackera/
├── .env                         # Zmienne środowiskowe (lokalne)
├── .gitignore                   # Pliki ignorowane przez git
├── netlify.toml                 # Konfiguracja Netlify
├── package.json                 # Zależności projektu
├── public/                      # Publiczne statyczne pliki
│   ├── favicon.ico              # Ikona strony
│   └── index.html               # Główny plik HTML
├── functions/                   # Netlify Functions
│   ├── getGithubStats.js        # Funkcja pobierająca dane z GitHub
│   └── getJiraStats.js          # Funkcja pobierająca dane z Jira
└── src/                         # Kod źródłowy React
    ├── App.js                   # Główny komponent aplikacji
    ├── index.js                 # Punkt wejścia aplikacji
    ├── styles/                  # Style
    │   ├── theme.js             # Definicje kolorów i stylów
    │   └── global.css           # Globalne style CSS
    ├── components/              # Komponenty React
    │   ├── Header.js            # Nagłówek strony
    │   ├── Footer.js            # Stopka strony
    │   ├── GitHubStats.js       # Komponent statystyk GitHub
    │   ├── JiraStats.js         # Komponent statystyk Jira
    │   ├── CommitChart.js       # Wykres kołowy dla commitów
    │   ├── TaskChart.js         # Wykres kołowy dla zadań Jira
    │   ├── StatCard.js          # Komponent karty statystyk
    │   └── StatsTable.js        # Tabela ze statystykami
    └── utils/                   # Funkcje pomocnicze
        ├── api.js               # Funkcje do komunikacji z API
        └── formatters.js        # Funkcje formatujące dane
```