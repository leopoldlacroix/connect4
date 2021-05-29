import { Connect4 } from './Connect4.js';

class MinimaxLs {
    /**
     * 
     * @param {number} depth 
     */
    constructor(depth) {
        this._type = "minimaxLs";
        this.steps_ahead = 1;
        this.infos;
        this.depth = depth? depth : 0;
    }

    /**
     * 
     * @param {Connect4} connect4 
     * @returns chosen column according to minimaxScore
     */
    chooseColumn(connect4){
        console.log(`begin minimaxLs ${this.depth} turn`);
        let player_representation = connect4.getPlayerRepresentation();
        let opponent_representation = connect4.getOpponentRepresentation();

        let ls = {};
        let best_score_by_rep = {};
        best_score_by_rep[player_representation] = -Infinity;
        best_score_by_rep[opponent_representation] = Infinity;

        //player tries all moves selects best score
        for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

            if (!connect4.isColumnIndexFilled(column_index)) {
                
                let cloned_connect4 = connect4.clone().action(column_index);
                let minimax_res = this.minimaxScore(cloned_connect4, this.depth - 1, best_score_by_rep);
                let pov_action_score = minimax_res["action_score_by_rep"][opponent_representation]*= -1;

                ls[column_index] = {...minimax_res};

                best_score_by_rep[player_representation] = Math.max(best_score_by_rep[player_representation], pov_action_score);
            }
        }

        let ls_entries = Object.entries(ls).map(([index, minimax_res]) => [index, minimax_res["action_score_by_rep"][opponent_representation]]);
        let best_keys = ls_entries.filter(([key, score]) => score == best_score_by_rep[player_representation]).map(([key, val]) => key);
        let chosen_column = best_keys[Math.floor(Math.random() * best_keys.length)];

        let infos = {
            "a_player_rep": player_representation,
            "a_player_score": best_score_by_rep[player_representation],
            "action_score_by_rep": best_score_by_rep,
            "chosen_column": chosen_column,
            "connect4_cur": connect4.getReadableState(),
            "connect4_end": ls[chosen_column]["connect4_end"],
            "ls": ls,
        }

        console.log(`infos: `, infos);
        console.log("_")

        this.infos = infos;

        return chosen_column;
    }

    /**
     * clone connect4 each time the child score is calculated so it doesn't modify it
     * @param {Connect4} connect4 
     * @param {number} depth 0 == score(connect4)
     * @param {{String: number}} best_score_by_rep
     *  so if the score here is worst (for previous player) skip
     * @returns
     */
    minimaxScore(connect4, depth, best_score_by_rep) {
        if(depth < 1 || connect4.game_over_message){
            let score = this.scorePOV(connect4);
            let player_rep = connect4.getPlayerRepresentation();

            let new_best_score_by_rep = {};
            new_best_score_by_rep[connect4.getOpponentRepresentation()] = -score;
            new_best_score_by_rep[player_rep] = score;

            let res = {
                "a_player_rep": player_rep,
                "a_player_score": new_best_score_by_rep[player_rep],
                "action_score_by_rep": new_best_score_by_rep,
                "connect4_cur": connect4.getReadableState(),
                "connect4_end": connect4.getReadableState(),
                "is_over": connect4.game_over_message,
                "ls": null,
            };
            return res;
        }

        /**
         * an even depth represents the opponent who will minimize the players score
         * an odd deph will be the actual player who will maximize his score
         */
        let player_rep = connect4.getPlayerRepresentation();
        let opponent_rep = connect4.getOpponentRepresentation();

        let new_best_score_by_rep = {};
        Object.entries(best_score_by_rep).forEach(([key, val]) => new_best_score_by_rep[key] = -1 * val);
        
        let ls = {};
        
        let best_column_index = 0;
        for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

            if (!connect4.isColumnIndexFilled(column_index)) {
                
                let cloned_connect4 = connect4.clone().action(column_index);
                let minimaxRes = this.minimaxScore(cloned_connect4, depth - 1, new_best_score_by_rep);
                let negative_value_of_opponent_score_on_next_turn = -minimaxRes["action_score_by_rep"][opponent_rep];
                
                ls[column_index] = { ...minimaxRes };
                
                if (new_best_score_by_rep[player_rep] < negative_value_of_opponent_score_on_next_turn) {
                    new_best_score_by_rep[player_rep] = negative_value_of_opponent_score_on_next_turn;
                    best_column_index = column_index;
                }
                
                // if one can obtain a better score than the opponent when he choses other course of action
                if(negative_value_of_opponent_score_on_next_turn > new_best_score_by_rep[opponent_rep]){
                    break;
                }
            }
        }

        let res = {
            "a_player_rep": player_rep,
            "a_player_score": new_best_score_by_rep[player_rep],
            "action_score_by_rep": new_best_score_by_rep,
            "connect4_cur": connect4.getReadableState(),
            "connect4_end": ls[best_column_index]["connect4_end"],
            "ls": ls,
        };
        return res;
    }

    /**
     * score dependent of player to play
     * @param {Connect} connect4 
     * @returns score for the player who has to play
     */
    scorePOV(connect4){
        let string_state = connect4.getStringState();

        let player_rep = connect4.getPlayerRepresentation();
        let opponent_rep = connect4.getOpponentRepresentation();

        let player_4s = 0;
        let opponent_4s = 0;
        let player_3s = 0;
        let opponent_3s = 0;
        let player_2s = 0;
        let opponent_2s = 0;

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

                player_2s += +((this.count(player_rep, reg_res) == 2) && 
                        (this.count(Connect4.empty_representation, reg_res) == 2))
                opponent_2s += +((this.count(opponent_rep, reg_res) == 2) && 
                        (this.count(Connect4.empty_representation, reg_res) == 2))

            }
        }

        let score = 1e3 * player_4s - 1e4 * opponent_4s +
            1e1 * player_3s - 1e2 * opponent_3s +
            1 * player_2s - 3 * opponent_2s;

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

export { MinimaxLs };