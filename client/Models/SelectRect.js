class SelectRect {
    selectionHandles = [];
    handleSize = 6;

    constructor(x, y, toX, toY) {
        this.x = x;
        this.y = y;
        this.toX = toX;
        this.toY = toY;
        let half = this.handleSize / 2;
        this.width = toX - x;
        this.height = toY - y;

        for (let i = 0; i < 8; i++) {
            this.selectionHandles.push({
                x: -1, y: -1
            });
            console.log(this.selectionHandles);
        }

        // 0  1  2
        // 3     4
        // 5  6  7

        // top left, middle, right
        this.selectionHandles[0].x = this.x - half;
        this.selectionHandles[0].y = this.y - half;

        this.selectionHandles[1].x = this.x + this.width / 2 - half;
        this.selectionHandles[1].y = this.y - half;

        this.selectionHandles[2].x = this.x + this.width - half;
        this.selectionHandles[2].y = this.y - half;

        //middle left
        this.selectionHandles[3].x = this.x - half;
        this.selectionHandles[3].y = this.y + this.height / 2 - half;

        //middle right
        this.selectionHandles[4].x = this.x + this.width - half;
        this.selectionHandles[4].y = this.y + this.height / 2 - half;

        //bottom left, middle, right
        this.selectionHandles[6].x = this.x + this.width / 2 - half;
        this.selectionHandles[6].y = this.y + this.height - half;

        this.selectionHandles[5].x = this.x - half;
        this.selectionHandles[5].y = this.y + this.height - half;

        this.selectionHandles[7].x = this.x + this.width - half;
        this.selectionHandles[7].y = this.y + this.height - half;

        for (let i = 0; i < 8; i++) {
            console.log(this.selectionHandles[i].x);
            console.log(this.selectionHandles[i].y);
        }

    }
}