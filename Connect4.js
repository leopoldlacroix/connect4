class Connect4 {
    static player_representations = ['X','0'];
    static empty_representation = '_';
    constructor() {
        this.lines = 5;
        this.columns = [];
        this.turn = 0;
        this.winner = null;
        for (let i = 0; i < 7; i++) {
            this.columns.push([]);
        }     
    }

    /**
     * makes action on selected column
     * @param column_number 
     * @returns {Connect4} modified
     */
    action(column_number) {
        let chosen_column = this.columns[column_number];
        let representation = Connect4.player_representations[this.turn % Connect4.player_representations.length]

        chosen_column.splice(0, 0, representation); //at i = 0, delete 0 elts, insert representation
        this.turn +=1;
        
        if(chosen_column.length > this.lines) {
            throw 'chosen column is already filled!'
        }

        this.game_over_message = this.GameOver();
        return this;
    }

    addLine() {
        this.lines += 1;
    }

    addColumn() {
        this.columns.push([]);
    }
    
    clone(){
        let object_clone = JSON.parse(JSON.stringify(this));
        let clone = new Connect4();

        for( let key in object_clone) {
            clone[key] = object_clone[key];
        }

        return clone;
    }

    iscollumnFilled(column){
        return !(column.length < this.lines);
    }
    isColumnIndexFilled(column_index){
        return this.iscollumnFilled(this.columns[column_index]);
    }


    /**
     * 
     * @returns message if game over or win else null
     */
    GameOver(){
        let column_lengths = this.columns.map((col) => col.length);
        if(Math.min(...column_lengths) == this.lines){
            return "Game Over";
        }

        return this.winCheck();
    }

    /**
     * directly get attribute game_over_message
     * if win returns message else returns null
     */
    winCheck() {
        let string_state = this.getStringState();
        let checks = this.allchecks();
        for (let expression of checks) {
            let regex = new RegExp(expression);
            let match = string_state.match(regex);

            //if win generate html to clear clicks
            if (match && match.length > 1) {
                return match[1] + " won";
            }
        }
        return null;
    }

    /**
     * all regexes to test
     * @returns regex list
     */
     allchecks(){
        let n_lines = this.lines;
        let checks = [];
        for (let representation of Connect4.player_representations) {
            checks.push(`(${representation})` + representation.repeat(3)); //regex for column win
            checks.push(`(${representation})` + `.{${n_lines}}${representation}`.repeat(3)); //for line
            checks.push(`(${representation})` + `.{${n_lines - 1}}${representation}`.repeat(3)); //for sw diags
            checks.push(`(${representation})` + `.{${n_lines + 1}}${representation}`.repeat(3)); //for se diags
        }
        return checks;
    }
    

    getPlayerRepresentation(){
        return Connect4.player_representations[this.turn % Connect4.player_representations.length];
    }
    getOpponentRepresentation(){
        let player_rep = this.getPlayerRepresentation();
        return Connect4.player_representations.filter((rep) => rep != player_rep)[0];
    }

    getStringState(){
        let state = '';
        for (let column of this.columns) {
            let theorical_column = this.generateEntireCol(column);
            theorical_column.unshift('|');
            state += theorical_column.join('');
        }

        return state;
    }

    getReadableState(){
        let readable = [];
        let theorical_cols = this.columns.map(
            (col) => this.generateEntireCol(col)
        );
        
        for (let line_i = 0; line_i < this.lines; line_i++) {
            readable[line_i] = [];
            for (let column_i = 0; column_i < this.columns.length; column_i++) {
                readable[line_i][column_i] = theorical_cols[column_i][line_i];
            }
            readable[line_i] = readable[line_i].join('');
        }
        
        return readable;
    }

    getColumns(){
        return this.columns;
    }
    
    generateEntireCol(column){
        let entire_col = new Array(this.lines - column.length).fill(Connect4.empty_representation).concat(column);
        return entire_col
    }
}

export { Connect4 };