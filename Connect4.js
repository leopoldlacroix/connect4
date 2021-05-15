import { Player } from './Player.js';
import { PRandom } from './PRandom.js';
import { PSmart } from './PSmart.js';
import { Minimax } from './Minimax.js';

class Connect4 {
    static player_representations = ['X','0'];
    static empty_representation = '_';
    constructor(main) {
        this.players = [];
        this.lines = 5;
        this.turn = 0;
        this.columns = [];
        this.main = main;
        for (let i = 0; i < 7; i++) {
            this.columns.push([]);
        }

        if(this.main){
            this.setFooter("fight!");
 
            this.generateHtml();
            let p2_selection = document.getElementById("p1").value;
            this.setPlayer(+p2_selection, 1);
            
            let p1_selection = document.getElementById("p0").value;
            this.setPlayer(+p1_selection, 0);
        }
        
        
        
    }

    /**
     * generates html and shows it
     */
    generateHtml() {
        if(!this.main){
            return;
        }

        let content = '';
        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            content += `<div class = column id = ${i}>`;

            let column_to_show = this.generateEntireCol(column);
            for (let field of column_to_show) {
                content += `<div class=field>${field}</div>`;
            }
            content += "</div >";
        }
        let connect4Div = document.getElementById('connect4');
        connect4Div.innerHTML = content;

        console.log(this.getReadableState());
    }

    /**
     * checks if win, if not next turn
     */
    nextTurn(){
        //to get next state without directly making other player play (needs to be done manually)
        if(!this.main){
            return
        }

        if(!this.winCheck()){
            this.turn = (this.turn + 1) % Connect4.player_representations.length;
            let player = this.players[this.turn];
            player.beginTurn();

        }
    }

    /**
     * makes action on selected column, generates html and next turn
     * @param column_number 
     */
    action(column_number) {
        let chosen_column = this.columns[column_number];
        if (!this.columnFilled(chosen_column)) {

            //add player representation on chosen column
            let representation = Connect4.player_representations[this.turn];
            chosen_column.splice(0, 0, representation); //at i = 0, delete 0 elts, insert val
            this.generateHtml();
            this.nextTurn();
        } else {
            throw 'chosen column is already filled!'
        }

    }
    
    
    /**
     * is win and who wins
     */
    winCheck() {
        let state = this.getStringState();
        let checks = this.allchecks();
        for (let expression of checks) {
            let regex = new RegExp(expression);
            let match = state.match(regex);

            //if win generate html to clear clicks
            if (match && match.length > 1) {
                this.generateHtml();
                this.setFooter(`${match[1]} won!`);
                console.log(match[1], 'won');
                return true;
            }
        }
        return false;
    }
    
    /**
     * all regexes to test
     * @returns regex list
     */
    allchecks(){
        let checks = [];
        for (let representation of Connect4.player_representations) {
            checks.push(`(${representation})` + representation.repeat(3)); //regex for column win
            checks.push(`(${representation})` + `.{${this.lines}}${representation}`.repeat(3)); //for line
            checks.push(`(${representation})` + `.{${this.lines - 1}}${representation}`.repeat(3)); //for sw diags
            checks.push(`(${representation})` + `.{${this.lines + 1}}${representation}`.repeat(3)); //for se diags
        }
        return checks;
    }

    /**
     * 
     * @param player_type 0 = player, 1 = random, 2 = minimax
     * @param turn player 0 or 1
     */
    setPlayer(player_type, player_turn){
        switch (player_type) {
            case 0:
                if(!this.main){
                    throw "trying to put real player in fake connect4"
                }
                this.players[player_turn] = new Player(this);
                break;

            case 1:
                this.players[player_turn] = new PRandom(this);
                break;
            
            case 2:
                this.players[player_turn] = new Minimax(this);
                break;
        
            default:
                this.players[player_turn] = new Minimax(this);
                break;
        }

        if(this.turn == player_turn){
            let player = this.players[player_turn];
            player.beginTurn();
        }
    }


    addLine() {
        this.lines += 1;
        this.generateHtml();
    }

    addColumn() {
        this.columns.push([]);
        this.generateHtml();
    }
    
    setFooter(text){
        if(!this.main){
            return;
        }
        document.querySelector("footer").innerHTML = text;
    }

    clone(){
        let clone = new Connect4();
        let connect4_keys = Object.keys(this).filter((key) => key != "players");

        for (const key of connect4_keys) {
            clone[key] = JSON.parse(JSON.stringify(this[key]));
        }
        clone.main = false;

        return clone;
    }

    columnFilled(column){
        return !(column.length < this.lines);
    }
    columnIndexFilled(column_index){
        return this.columnFilled(this.columns[column_index]);
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

    getStateByColumn(){
        return this.columns;
    }
    
    generateEntireCol(column){
        let entire_col = new Array(this.lines - column.length).fill(Connect4.empty_representation).concat(column);
        return entire_col
    }
}

export { Connect4 };