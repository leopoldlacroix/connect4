import { Morpion } from './Morpion.js';


var morpion = new Morpion();

let morpionComponent = document.getElementById('morpion');
morpionComponent = morpion.generateHtml();

document.getElementById("addLine").onclick = addLine;
document.getElementById("addColumn").onclick = addColumn;
document.getElementById("restart").onclick = restart;


function addLine() {
    morpion.addLine();
    onclicks();
}

function addColumn() {
    morpion.addColumn();
    onclicks();
}

function restart() {
    morpion = new Morpion();
    morpion.generateHtml();
    onclicks();
}

onclicks();
function onclicks(){
    let columns = document.getElementsByClassName("column") 
    for (let column of columns) {
        column.onclick = action;   
    }
}

function action() {
    morpion.action(this.id);
    onclicks();
    let checkRes = morpion.check();
    if (checkRes) {
        console.log(checkRes);
        morpion.generateHtml();
        document.querySelector("footer").innerHTML = `${checkRes} won!`;
    }
}