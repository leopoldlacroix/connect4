import { Player } from './Player.js';
import { PRandom } from './PRandom.js';
import { Minimax } from './Minimax.js';
import { Connect4 } from './Connect4.js';

class GameMaster {
    static INSTANCE = null;
    constructor() {
        GameMaster.INSTANCE = this

        this.players = [];
        this.connect4 = new Connect4();
        
        let p2_selection = document.getElementById("p1").value;
        let p1_selection = document.getElementById("p0").value;
        
        this.setPlayer(+p1_selection, 0);
        this.setPlayer(+p2_selection, 1);

        
        this.generateHtml();
        this.setFooter("fight!");

        this.beginTurn();
    }

    beginTurn(){
        let players_turn = this.getPlayersTurn();
        let chosen_column = players_turn.chooseColumn(this.connect4);

        if(players_turn._type == Player.UNIQUE_ID){
            return;
        }

        if([null, undefined].includes(chosen_column)){
            throw "GameMaseter: pas de colomne choisie"
        }
        this.endTurn(chosen_column);
    }

    endTurn(chosen_column){
        this.connect4.action(chosen_column);
        this.generateHtml();

        if(this.winCheck() || this.GameOver()){
            return;
        }

        this.beginTurn();
    }

    /**
     * generates html and shows it
     */
    generateHtml() {

        let content = '';
        for (let i = 0; i < this.connect4.columns.length; i++) {
            let column = this.connect4.columns[i];
            content += `<div class = column id = ${i}>`;

            let column_to_show = this.connect4.generateEntireCol(column);
            for (let field of column_to_show) {
                content += `<div class=field>${field}</div>`;
            }
            content += "</div >";
        }
        let connect4Div = document.getElementById('connect4');
        connect4Div.innerHTML = content;
    }

    getPlayersTurn(){
        return this.players[this.connect4.turn % Connect4.player_representations.length];
    }

    /**
     * makes action on selected column, generates html and next turn
     * @param column_number 
     */
    action(column_number) {
        if (this.columnFilled(chosen_column)) {
            throw 'chosen column is already filled!'
        } 

        //add player representation on chosen column
        let representation = Connect4.player_representations[this.turn];
        this.connect4.action(column_number, representation);
    }
    
    
    /**
     * is win and who wins
     */
    winCheck() {
        let string_state = this.connect4.getStringState();
        let checks = this.allchecks();
        for (let expression of checks) {
            let regex = new RegExp(expression);
            let match = string_state.match(regex);

            //if win generate html to clear clicks
            if (match && match.length > 1) {
                this.setFooter(`${match[1]} won!`);
                console.log(match[1], 'won'); 

                return true;
            }
        }
        return false;
    }


    GameOver(){
        let column_lengths = this.connect4.columns.map((col) => col.length);
        if(Math.min(...column_lengths) == this.connect4.lines){
            return true;
        }

    }
    
    
    /**
     * all regexes to test
     * @returns regex list
     */
    allchecks(){
        let n_lines = this.connect4.lines;
        let checks = [];
        for (let representation of Connect4.player_representations) {
            checks.push(`(${representation})` + representation.repeat(3)); //regex for column win
            checks.push(`(${representation})` + `.{${n_lines}}${representation}`.repeat(3)); //for line
            checks.push(`(${representation})` + `.{${n_lines - 1}}${representation}`.repeat(3)); //for sw diags
            checks.push(`(${representation})` + `.{${n_lines + 1}}${representation}`.repeat(3)); //for se diags
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
                this.players[player_turn] = new Player();
                break;

            case 1:
                this.players[player_turn] = new PRandom();
                break;
            
            case 2:
                this.players[player_turn] = new Minimax(Connect4.player_representations[player_turn]);
                break;
        
            default:
                this.players[player_turn] = new Minimax(Connect4.player_representations[player_turn]);
                break;
        }

        if((this.turn % Connect4.player_representations) == player_turn){
            let player = this.players[player_turn];
            player.chooseColumn();
        }
    }

    addLine() {
        this.connect4.addLine();
        this.generateHtml();
        this.beginTurn();
    }

    addColumn() {
        this.connect4.addColumn();
        this.generateHtml();
        this.beginTurn();
    }
    
    setFooter(text){
        document.querySelector("footer").innerHTML = text;
    }
}

export { GameMaster };