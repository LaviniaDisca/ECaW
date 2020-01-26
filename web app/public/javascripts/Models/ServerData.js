class ServerData {
    circles = [];
    rectangles = [];
    lines = [];
    ellipses = [];
    title = "Untitled";

    constructor(history = [], username, projectId, title) {
        this.username = username;
        this._id = projectId;
        this.title = title;
        for (let i = 0; i < history.length; i++) {
            if (history[i] instanceof Rectangle) {
                this.rectangles.push(history[i]);
                this.rectangles[this.rectangles.length - 1].index = i;
            } else if (history[i] instanceof Line) {
                this.lines.push(history[i]);
                this.lines[this.lines.length - 1].index = i;
            } else if (history[i] instanceof Ellipse) {
                this.ellipses.push(history[i]);
                this.ellipses[this.ellipses.length - 1].index = i;
            } else if (history[i] instanceof Circle) {
                this.circles.push(history[i]);
                this.circles[this.circles.length - 1].index = i;
            }
        }
    }

    toHistoryArray() {
        let history = [];
        this.circles.forEach((item) => {
            history[item.index] = new Circle(item.centerX, item.centerY, item.radius, item.color, item.fill);
        });
        this.ellipses.forEach((item) => {
            history[item.index] = new Ellipse(item.x, item.y, item.toX, item.toY, item.color, item.fill);
        });
        this.lines.forEach((item) => {
            history[item.index] = new Line(item.x, item.y, item.toX, item.toY, item.color);
        });
        this.rectangles.forEach((item) => {
            history[item.index] = new Rectangle(item.x, item.y, item.toX, item.toY, item.color, item.fill);
        });
        return history;
    }

    restore(data) {
        Object.assign(this, data)
    }
}