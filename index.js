import Morpion from './Morpion.js';

morpion = new Morpion();

let morpionComponent = document.getElementById('morpion');
morpion.innerHTML = morpion.generateHtml();
