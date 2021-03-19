class Morpion {
    static players = ['X','0'];
    constructor() {
        this.lines = 5;
        this.turn = 0;
        this.columns = [];
        for (let i = 0; i < 7; i++) {
            this.columns.push([]);
            
        }
    }

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
        let morpionDiv = document.getElementById('morpion');
        morpionDiv.innerHTML = content
    }

    action(column_number) {
        let chosen_column = this.columns[column_number];
        if (chosen_column.length < this.lines) {
            chosen_column.splice(0, 0, Morpion.players[this.turn]); //at i = 0, delete 0 elts, insert val
            this.turn = (this.turn + 1) % Morpion.players.length;
            this.generateHtml();
        }
    }
    
    check() {
        let state = '';
        for (let column of this.columns) {
            let column_showed = new Array(this.lines - column.length).fill('_').concat(column);
            for (let field of column_showed) {
                state += field;
            }
        }
        
        let checks = this.allchecks();
        for (let expression of checks) {
            let regex = new RegExp(expression);
            let match = state.match(regex);
            if (match && match.length > 1) {
                return match[1];
            }
        }
    }

    allchecks(){
        let checks = [];
        for (let representation of Morpion.players) {
            checks.push(`(${representation})` + representation.repeat(3)); //regex for line win
            checks.push(`(${representation}).{${this.lines-1}}`.repeat(3)+representation); //for columns
            // checks.push(`(${representation}).{${this.lines-2}}`.repeat(3)+representation); //for sw diags
            // checks.push(`(${representation}).{${this.lines}}`.repeat(3)+representation); //for se diags
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

}

export { Morpion };