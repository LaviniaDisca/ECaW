class Rectangle {
    index = 0;

    constructor(x, y, toX, toY, color, fill) {
        this.x = x;
        this.y = y;
        this.toX = toX;
        this.toY = toY;
        this.width = toX - x;
        this.height = toY - y;
        this.color = color;
        this.fill = fill;
    }
}

//todo: keyboard shortcuts

//todo: scrollable history + back + save

//todo: another one hidden

//todo: celebrate when it's over