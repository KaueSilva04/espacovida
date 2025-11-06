export default {
  darkMode: 'class', // Habilita o modo escuro
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'green-hope': '#2E7D32',
        'blue-trust': '#1565C0',
        'gray-light': '#F5F5F5',

        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-header': '#334155',
        'dark-text-primary': '#f1f5f9',
        'dark-text-secondary': '#94a3b8',

      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
 plugins: [
    require('tailwind-scrollbar'), // <--- CONFIRME QUE ESTA LINHA ESTÁ AQUI
  ],
}