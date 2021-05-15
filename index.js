import { GameMaster } from './GameMaster.js';


var gameMaster = new GameMaster();

document.getElementById("addLine").onclick = addLine;
document.getElementById("addColumn").onclick = addColumn;
document.getElementById("restart").onclick = restart;
document.getElementById("p0").onchange = setPlayer;
document.getElementById("p1").onchange = setPlayer;

function addLine() {
    gameMaster.addLine();
}

function addColumn() {
    gameMaster.addColumn();
}

function restart() {
    gameMaster = new GameMaster();
    
}

function setPlayer(event){
    let selection_tag = event.srcElement;

    let value = +selection_tag.value;
    let turn = +selection_tag.id.slice(1);
    gameMaster.setPlayer(value,turn);
}
