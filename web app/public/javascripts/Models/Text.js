class TextInput {
    width;
    fontSize = 16;
    active=true;

    getLongestLine() {
        let lines = this.words.join("").split("Enter");
        return lines.sort(function (a, b) {
            return b.length - a.length;
        })[0];
    }

    get toY() {
        let lines = this.words.join("").split("Enter");
        return this.y + (lines.length) * (this.fontSize + 4) + 10;
    }

    get y() {
        return this.startY - this.fontSize - 4;
    }

    get toX() {
        return this.startingX + this.width + 5;
    }

    get x() {
        return this.startingX - 5;
    }

    constructor(startingX, startY, words, color) {
        this.startingX = startingX;
        this.startY = startY;
        this.words = words;
        this.color = color;
    }
}