class Morpion {
    constructor() {
        this.lines = 3;
        this.columns = 3;
        this.content = generateHtml;
    }

    generateHtml() {
        for (let line = 0; line < this.lines; line++) {
            morpionContent += "<div class = line" + line + ">";

            for (let column = 0; column < this.columns; column++) {
                morpionContent +=
                    "<div class = column" + column + ">" +
                    line + column +
                    "</div>";
                
            }

            morpionContent += "</div >";
        }
    }
}