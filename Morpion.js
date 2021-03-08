class Morpion {
    constructor() {
        this.lines = 3;
        this.columns = 3;
    }

    generateHtml() {
        content = '';
        for (let line = 0; line < this.lines; line++) {
            content += "<div class = line id = line" + line + ">";

            for (let column = 0; column < this.columns; column++) {
                content +=
                    "<div class = column id = column" + column + ">" +
                    line + column +
                    "</div>";
                
            }

            content += "</div >";
        }
        document.getElementById('morpion').innerHTML = content;
    }
}

export { Morpion };