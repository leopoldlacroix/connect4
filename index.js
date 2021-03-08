import { Morpion } from './Morpion.js';

document.getElementById("addLine").onclick = addLine;
document.getElementById("addColumn").onclick = addColumn;

var morpion = new Morpion();

let morpionComponent = document.getElementById('morpion');
morpion.innerHTML = morpion.generateHtml();

function addLine() {
    morpion.lines += 1;
    morpion.generateHtml();
}

function addColumn() {
    morpion.columns += 1;
    morpion.generateHtml();
}