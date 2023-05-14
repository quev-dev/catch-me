const body = document.body;
const lightThemeClass = 'light';
const savedTheme = localStorage.getItem('catchme-theme');

const setTheme = (isLightTheme) => {
  body.classList.toggle(lightThemeClass, isLightTheme);
  body.classList.toggle('catchme-theme', !isLightTheme);
  body.classList.toggle('dark', !isLightTheme);
  localStorage.setItem(
    'catchme-theme',
    isLightTheme ? lightThemeClass : 'dark'
  );
};

const toggleTheme = () => {
  const isLightTheme = body.classList.toggle(lightThemeClass);
  setTheme(isLightTheme);
};

document
  .getElementById('theme-toggle-button')
  .addEventListener('click', toggleTheme);

if (savedTheme) {
  setTheme(savedTheme === lightThemeClass);
}
