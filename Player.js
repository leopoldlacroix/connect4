import { GameMaster } from './GameMaster.js';
class Player {
    static UNIQUE_ID = "abruti";
    constructor() {
        this._type = Player.UNIQUE_ID;
    }

    clicked(event) {
        let column_number = event.currentTarget.id;
        GameMaster.INSTANCE.endTurn(column_number);
    }

    chooseColumn(connect4){
        console.log("begin turn")
        let columns = document.getElementsByClassName("column");
        for (let column of columns) {
            column.onclick = this.clicked.bind(this);   
        }
    }

}

export { Player };