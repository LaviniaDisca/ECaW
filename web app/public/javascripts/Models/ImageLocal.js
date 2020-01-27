class ImageLocal {
    source=undefined;
    active=true;
    constructor(x, y, toX, toY, image) {
        this.x = x;
        this.y = y;
        this.toX = toX;
        this.toY = toY;
        this.image = image;
    }
}