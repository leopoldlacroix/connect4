import { Connect4 } from './Connect4.js';

class Minimax {
    constructor(player_representation) {
        this._type = "minimax";
        this.steps_ahead = 1;
        this.player_representation = player_representation;
    }

    chooseColumn(connect4){
        console.log("begin minimax turn");

        let score_by_possible_move = {};

        let best_score = -Infinity;
        let best_index = 0;
        for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

            if (!connect4.isColumnIndexFilled(column_index)) {
                
                let cloned_connect4 = connect4.clone().action(column_index);
                let action_score = this.score(cloned_connect4);

                score_by_possible_move[column_index] = action_score;

                if(action_score > best_score){
                    best_score = action_score;
                    best_index = column_index;
                }
            }
        }
        console.log("scores:", score_by_possible_move);
        console.log(`choice: ${best_index}`);
        console.log(connect4.getReadableState());
        console.log("_")
        return best_index
    }

    Minimax(connect4, depth) {

        let max_score = Math.max(...Object.values(score_by_possible_move));

        let column_indexes_for_max_score = Object.entries(score_by_possible_move).filter(([k, v]) => v >= max_score).map(([k,v])=>k);

        let random_index = Math.floor(Math.random() * column_indexes_for_max_score.length);
        let chosen_column_number = column_indexes_for_max_score[random_index];

        return chosen_column_number;
    }

    Minimax(){

    }

    score(connect4){
        let string_state = connect4.getStringState();
        let player_rep = this.player_representation;
        let opponent_rep = Connect4.player_representations.filter((e) => e != player_rep);

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

                player_4s += +(this.count(player_rep, reg_res) == 4);
                opponent_4s += +(this.count(opponent_rep, reg_res) == 4);

                player_3s += +((this.count(player_rep, reg_res) == 3) && 
                        (this.count(Connect4.empty_representation, reg_res) == 1))
                opponent_3s += +((this.count(opponent_rep, reg_res) == 3) && 
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