class PRandom {
    constructor() {
        this._type = "random";
    }

    chooseColumn(connect4){
        console.log("begin random turn")
        let chosen_column = this.randomColumn(connect4);
        return chosen_column;
    }

    randomColumn(connect4) {
        let possible_column_indexes = [];
        for (let index = 0; index < connect4.columns.length; index++) {
            if (connect4.columns[index].length < connect4.lines) {
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