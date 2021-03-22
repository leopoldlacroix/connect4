import { Connect4 } from './Connect4.js';


var connect4 = new Connect4();

document.getElementById("addLine").onclick = addLine;
document.getElementById("addColumn").onclick = addColumn;
document.getElementById("restart").onclick = restart;
document.getElementById("p0").onchange = setPlayer;
document.getElementById("p1").onchange = setPlayer;

function addLine() {
    connect4.addLine();
}

function addColumn() {
    connect4.addColumn();
}

function restart() {
    connect4 = new Connect4();
    
}

function setPlayer(event){
    let selection_tag = event.originalTarget;

    let value = +selection_tag.value;
    let turn = +selection_tag.id.slice(1);
    connect4.setPlayer(value,turn);
    
    console.log(`${Connect4.representations[0]}: ${connect4.players[0]._type} | ${Connect4.representations[1]}: ${connect4.players[1]._type}`);
    console.log('-');
}
