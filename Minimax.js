import { Connect4 } from './Connect4.js';

class Minimax {
    /**
     * 
     * @param {String} player_representation 
     * @param {number} depth 
     */
    constructor(player_representation, depth) {
        this._type = "minimax";
        this.steps_ahead = 1;
        this.player_representation = player_representation;
        this.depth = depth? depth : 0;
    }

    /**
     * 
     * @param {Connect4} connect4 
     * @returns chosen column according to minimaxScore
     */
    chooseColumn(connect4){
        console.log(`begin minimax ${this.depth} turn`);

        let score_by_possible_move = {};

        //player tries all moves selects best score
        let best_score = -Infinity;
        let opponent_best_score = Infinity;
        for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

            if (!connect4.isColumnIndexFilled(column_index)) {
                
                let cloned_connect4 = connect4.clone().action(column_index);
                let action_score = this.minimaxScore(cloned_connect4, this.depth, best_score, opponent_best_score);

                score_by_possible_move[column_index] = action_score;
                best_score = Math.max(best_score, action_score);
            }
        }

        let best_keys = Object.entries(score_by_possible_move).filter(([key, val]) => val == best_score).map(([key, val]) => key);
        let best_index = best_keys[Math.floor(Math.random() * best_keys.length)];

        console.log(`player: `, this.player_representation);
        console.log(`choice: ${best_index} - scores:`, score_by_possible_move);
        console.log("before:", connect4.getReadableState());
        console.log("after:", connect4.clone().action(best_index).getReadableState());
        console.log("_")
        return best_index;
    }

    /**
     * clone connect4 each time the child score is calculated so it doesn't modify it
     * @param {Connect4} connect4 
     * @param {number} depth 0 == score(connect4)
     * @param {number} player_best_score best score of previous calculated moves for player
     * @param {number} opponent_best_score best score of previous calculated moves for opponent
     *  so if the score here is worst (for previous player) skip
     * @returns best score amongs all possible childs (minimax look it up bro)
     */
    minimaxScore(connect4, depth, player_best_score, opponent_best_score) {
        if(depth < 1){
            return this.score(connect4);
        }

        /**
         * an even depth represents the opponent who will minimize the players score
         * an odd deph will be the actual player who will maximize his score
         * -1 = opponent, 1 = player
         */
        if(depth % 2) {

            let score_by_possible_move = {};
            for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

                if (!connect4.isColumnIndexFilled(column_index)) {
                    
                    let cloned_connect4 = connect4.clone().action(column_index);
                    let action_score = this.minimaxScore(cloned_connect4, this.depth - 1, player_best_score, opponent_best_score);

                    score_by_possible_move[column_index] = action_score;
                    opponent_best_score = Math.min(opponent_best_score, action_score);

                    if(opponent_best_score <= player_best_score){
                        break;
                    }
                }
            }

        } else {

            let score_by_possible_move = {};
            for (let column_index = 0; column_index < connect4.columns.length; column_index++) {

                if (!connect4.isColumnIndexFilled(column_index)) {
                    
                    let cloned_connect4 = connect4.clone().action(column_index);
                    let action_score = this.minimaxScore(cloned_connect4, this.depth - 1, player_best_score, opponent_best_score);

                    score_by_possible_move[column_index] = action_score;
                    player_best_score = Math.max(player_best_score, action_score);

                    if(player_best_score <= opponent_best_score){
                        break;
                    }
                }
            }
        }

        return opponent_best_score;
    }

    /**
     * doesn't modify connect4
     * @param {Connect} connect4 
     * @returns calculated score for this.player on connect4
     */
    score(connect4){
        let string_state = connect4.getStringState();
        let player_rep = this.player_representation;
        let opponent_rep = Connect4.player_representations.filter((e) => e != player_rep);

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

export { Minimax };