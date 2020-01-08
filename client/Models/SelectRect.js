class SelectRect {
    selectionHandles = [];
    handleSize = 6;


    constructor(x, y, toX, toY) {
        this.x = x;
        this.y = y;
        this.toX = toX;
        this.toY = toY;

        for (let i = 0; i < 8; i++) {
            this.selectionHandles.push({
                x: -1, y: -1
            });
        }
        this.updateHandles()

    }

    updateHandles() {
        this.width = this.toX - this.x;
        this.height = this.toY - this.y;
        // 0  1  2
        // 3     4
        // 5  6  7

        // top left, middle, right
        this.selectionHandles[0].x = this.x - this.handleSize / 2;
        this.selectionHandles[0].y = this.y - this.handleSize / 2;

        this.selectionHandles[1].x = this.x + this.width / 2 - this.handleSize / 2;
        this.selectionHandles[1].y = this.y - this.handleSize / 2;

        this.selectionHandles[2].x = this.x + this.width - this.handleSize / 2;
        this.selectionHandles[2].y = this.y - this.handleSize / 2;

        //middle left
        this.selectionHandles[3].x = this.x - this.handleSize / 2;
        this.selectionHandles[3].y = this.y + this.height / 2 - this.handleSize / 2;

        //middle right
        this.selectionHandles[4].x = this.x + this.width - this.handleSize / 2;
        this.selectionHandles[4].y = this.y + this.height / 2 - this.handleSize / 2;

        //bottom left, middle, right
        this.selectionHandles[6].x = this.x + this.width / 2 - this.handleSize / 2;
        this.selectionHandles[6].y = this.y + this.height - this.handleSize / 2;

        this.selectionHandles[5].x = this.x - this.handleSize / 2;
        this.selectionHandles[5].y = this.y + this.height - this.handleSize / 2;

        this.selectionHandles[7].x = this.x + this.width - this.handleSize / 2;
        this.selectionHandles[7].y = this.y + this.height - this.handleSize / 2;
    }
}