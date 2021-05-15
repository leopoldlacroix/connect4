class PRandom {
    constructor(connect4) {
        this._type = "random";
        this.connect4 = connect4;
    }

    action(column_number) {
        this.connect4.action(column_number);
    }

    beginTurn(){
        console.log("begin random turn")
        let chosen_column = this.randomColumn();
        this.action(chosen_column);
    }

    randomColumn() {
        let possible_column_indexes = [];
        for (let index = 0; index < this.connect4.columns.length; index++) {
            if (this.connect4.columns[index].length < this.connect4.lines) {
                possible_column_indexes.push(index);
            }
            
        }
        let max_index = possible_column_indexes.length;
        let chosen_index = Math.floor(Math.random() * Math.floor(max_index)); // random between 0 and max excluded
        let chosen_column_number = possible_column_indexes[chosen_index];
        console.log("chosen_column_number: " + chosen_column_number)
        return chosen_column_number;
    }
}

export { PRandom };