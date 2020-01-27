class Circle {
    active=true;
    constructor(centerX, centerY, radius, color, fill) {
        this.radius = radius;
        this.centerX = centerX;
        this.centerY = centerY;
        this.color = color;
        this.fill = fill;
        this.setRadius(radius);
    }

    resizeX(x, toX) {
        if (Math.abs(toX - x < 10)) {
            return false;
        }
        this.y = this.y - (this.x - x);
        this.x = x;
        this.toY = this.toY - (this.toX - toX);
        this.toX = toX;
        this.recenter();
        return true;
    }

    move(offsetX, offsetY) {
        this.x += offsetX;
        this.y += offsetY;
        this.toX += offsetX;
        this.toY += offsetY;
        this.recenter();
    }

    setRadius(radius){
        this.x = this.centerX - radius;
        this.y = this.centerY - radius;
        this.toX = this.centerX + radius;
        this.toY = this.centerY + radius;
    }

    recenter(){
        this.radius = Math.floor(Math.abs(this.x - this.toX) / 2);
        this.centerX = this.x + Math.floor(Math.abs(this.x - this.toX) / 2);
        this.centerY = this.y + Math.floor(Math.abs(this.y - this.toY) / 2);
    }
}
