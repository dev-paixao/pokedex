const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('#copyright');
const appTitle = 'PokeGuide';

copyrightElement.innerHTML =
  `&copy; ${currentYear} ${appTitle}`;
