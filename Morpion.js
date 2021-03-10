class Morpion {
    static players = ['X','0'];
    constructor() {
        this.lines = 5;
        this.columns = 5;
        this.turn = 0;
    }

    generateHtml() {
        content = '';
        for (let line = 0; line < this.lines; line++) {
            content += `<div class = line id = line${line}">`;

            for (let column = 0; column < this.columns; column++) {
                content +=
                    `<div class=field id=${"field"+line+column}>_</div>`;
            }
            content += "</div >";
        }
        document.getElementById('morpion').innerHTML = content;
        
    }

    action(){
        this.turn = (this.turn+1) % Morpion.players.length;
        return Morpion.players[this.turn];
    }
    
    check(){
        let state = '';
        for (let i = 0; i < this.lines; i++) {
            for (let j = 0; j < this.columns; j++) {
                let fieldChangingColumn = document.getElementById("field"+i+j).innerHTML;
                state += fieldChangingColumn;
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
            checks.push(representation.repeat(4)); //regex for line win
            checks.push(`(${representation}).{${this.columns-2}}`.repeat(3)+representation); //for sw diags
            checks.push(`(${representation}).{${this.columns-1}}`.repeat(3)+representation); //for columns
            checks.push(`(${representation}).{${this.columns}}`.repeat(3)+representation); //for se diags
        }
        return checks;
    }

    addLine() {
        this.lines += 1;
        this.generateHtml();
    }

    addColumn() {
        this.columns += 1;
        this.generateHtml();
    }

}

export { Morpion };