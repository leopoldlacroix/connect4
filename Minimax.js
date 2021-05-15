import { Connect4 } from './Connect4.js';

class Minimax {
    constructor(connect4) {
        this._type = "minimax";
        this.connect4 = connect4;
        this.steps_ahead = 1;
    }

    action(column_number) {
        this.connect4.action(column_number);
    }

    beginTurn(){
        console.log("begin minimax turn")
        let chosen_column = this.chooseColumn();
        this.action(chosen_column);
    }

    chooseColumn() {
        let score_by_possible_move = {};
        for (let column_index = 0; column_index < this.connect4.columns.length; column_index++) {
            if (!this.connect4.columnIndexFilled(column_index)) {
                score_by_possible_move[column_index] = this.futureAtionScore(column_index);
            }
        }

        let max_score = Math.max(...Object.values(score_by_possible_move));

        let column_indexes_for_max_score = Object.entries(score_by_possible_move).filter(([k, v]) => v >= max_score).map(([k,v])=>k);

        let random_index = Math.floor(Math.random() * column_indexes_for_max_score.length);
        let chosen_column_number = column_indexes_for_max_score[random_index];

        return chosen_column_number;
    }

    futureAtionScore(column_index){
        const cloned_connect4 = this.connect4.clone();
        cloned_connect4.action(column_index)
        let score = this.score(cloned_connect4);
        return score;
    }

    score(connect4){
        let string_state = connect4.getStringState()
        let player_representation = connect4.getPlayerRepresentation();
        let opponent_representaion = connect4.getOpponentRepresentation();

        let player_4s = 0;
        let opponent_4s = 0;
        let player_3s = 0;
        let opponent_3s = 0;

        let paterns = this.getNspaterns(connect4, 4);
        for(const patern of paterns){

            const regexp = new RegExp(patern);
            let string_length_for_reg = string_state.match(regexp)[0].length;

            for (let index = 0; index < string_state.length - string_length_for_reg; index++) {

                const remaining_string_state = string_state.slice(index);
                const reg_res = remaining_string_state.match(regexp);

                player_4s += +(this.count(player_representation, reg_res) == 4);
                opponent_4s += +(this.count(opponent_representaion, reg_res) == 4);

                player_3s += +((this.count(player_representation, reg_res) == 3) && 
                        (this.count(Connect4.empty_representation, reg_res) == 1))
                opponent_3s += +((this.count(opponent_representaion, reg_res) == 3) && 
                        (this.count(Connect4.empty_representation, reg_res) == 1))

            }
        }

        let score = 1e3 * player_4s - 1e4 * opponent_4s + 1e1 * player_3s - 1e2 * opponent_3s;
        return score;
        
    }

    getNspaterns(connect4, n){
        if(n<2){
            return;
        }
        
        return [
            `(.)` + '(.)'.repeat(n-1), //vertical
            `(.)` + `.{${connect4.lines}}(.)`.repeat(n-1), // line
            `(.)` + `.{${connect4.lines - 1}}(.)`.repeat(n-1), // sw diags
            `(.)` + `.{${connect4.lines + 1}}(.)`.repeat(n-1) //for se diags
        ];
    }

    count(elt, array){
        return array.reduce((acc, val) => acc + +(val==elt),0);
    }
}

export { Minimax };