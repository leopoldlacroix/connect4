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
    morpion.generateHtml();
    onclicks();
}

onclicks();
function onclicks(){
    let fields = document.getElementsByClassName("field") 
    for (let field of fields) {
        field.onclick = action;   
    }
}

function action(){
    if(Morpion.players.includes(this.innerHTML)){
        return;
    }
    this.innerHTML = morpion.action()
    let checkRes = morpion.check();
    if(checkRes){
        document.querySelector("footer").innerHTML = `${checkRes} won!`;
    }
}