import { Player } from './Player.js';
import { PRandom } from './PRandom.js';
import { Minimax } from './Minimax.js';
import { MinimaxPerf } from './MinimaxPerf.js';
import { MinimaxLs } from './MinimaxLs.js';
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
            throw "GameMaster: pas de colomne choisie"
        }
        this.endTurn(chosen_column);
    }

    endTurn(chosen_column){
        this.connect4.action(chosen_column);
        this.generateHtml();

        if(this.connect4.game_over_message){
            this.setFooter(this.connect4.game_over_message);
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
                this.players[player_turn] = new MinimaxLs(2);
                break;

            case 3:
                this.players[player_turn] = new MinimaxPerf(Connect4.player_representations[player_turn], 1);
                break;

            case 4:
                this.players[player_turn] = new Minimax(Connect4.player_representations[player_turn], 1);
                break;
        
            default:
                this.players[player_turn] = new Minimax(Connect4.player_representations[player_turn], 0);
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