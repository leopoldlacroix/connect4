class Player {
    constructor(connect4) {
        this._type = "imbecile";
        this.connect4 = connect4;
    }

    action(event) {
        let column_number = event.currentTarget.id;
        this.connect4.action(column_number);
    }

    beginTurn(){
        console.log("begin turn")
        let columns = document.getElementsByClassName("column");
        for (let column of columns) {
            column.onclick = this.action.bind(this);   
        }
    }

}

export { Player };