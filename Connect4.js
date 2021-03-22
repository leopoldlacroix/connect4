import { Player } from './Player.js';

class Connect4 {
    static representations = ['X','0'];
    constructor() {
        this.players = [];
        this.lines = 5;
        this.turn = 0;
        this.columns = [];
        for (let i = 0; i < 7; i++) {
            this.columns.push([]);
        }

        this.generateHtml();
        let p1_selection = document.getElementById("p0").value;
        let p2_selection = document.getElementById("p1").value;

        this.setPlayer(+p1_selection, 0);
        this.setPlayer(+p2_selection, 1);
        
    }

    /**
     * generates html and shows it
     */
    generateHtml() {
        let content = '';
        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            content += `<div class = column id = ${i}>`;
            let column_to_show = new Array(this.lines - column.length).fill('_').concat(column);
            for (let field of column_to_show) {
                content += `<div class=field>${field}</div>`;
            }
            content += "</div >";
        }
        let connect4Div = document.getElementById('connect4');
        connect4Div.innerHTML = content;
    }

    /**
     * makes action on selected column, generates html, checks if win and next turn
     * @param column_number 
     */
    action(column_number) {
        let chosen_column = this.columns[column_number];
        if (chosen_column.length < this.lines) {

            //add representation one chosen column
            let representation = Connect4.representations[this.turn];
            chosen_column.splice(0, 0, representation); //at i = 0, delete 0 elts, insert val
            this.generateHtml();

            this.nextTurn();
        }
    }
    
    
    /**
     * is win and who wins
     */
    check() {
        let state = '';
        for (let column of this.columns) {
            let theorical_column = new Array(this.lines  + 1 - column.length).fill('_').concat(column);
            theorical_column[0] = '|';
            for (let field of theorical_column) {
                state += field;
            }
        }
        let checks = this.allchecks();
        for (let expression of checks) {
            let regex = new RegExp(expression);
            let match = state.match(regex);

            //if win generate html to clear clicks
            if (match && match.length > 1) {
                connect4.generateHtml();
                this.setFooter(`${match[1]} won!`);
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
        for (let representation of Connect4.representations) {
            checks.push(`(${representation})` + representation.repeat(3)); //regex for line win
            checks.push(`(${representation}).{${this.lines}}`.repeat(3)+representation); //for columns
            checks.push(`(${representation}).{${this.lines - 1}}`.repeat(3)+representation); //for sw diags
            checks.push(`(${representation}).{${this.lines + 1}}`.repeat(3)+representation); //for se diags
        }
        return checks;
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
        document.querySelector("footer").innerHTML = text;
    }

    /**
     * 
     * @param player_type 0 = player, 1 = ...
     * @param turn player 0 or 1
     */
    setPlayer(player_type,player_turn){
        switch (player_type) {
            case 0:
                this.players[player_turn] = new Player(this);
                break;

            case 1:
                this.players[player_turn] = new Player(this);
                console.log('achanger');
                break;
        
            default:
                this.players[player_turn] = new Player(this);
                break;
        }

        if(this.turn == player_turn){
            let player = this.players[player_turn];
            player.beginTurn();
        }
    }

    nextTurn(){
        if(!this.check()){
            this.turn = (this.turn + 1) % Connect4.representations.length;
            let player = this.players[this.turn];
            player.beginTurn();
        }
    }
    
}

export { Connect4 };