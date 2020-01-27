class ServerData {
    circles = [];
    rectangles = [];
    lines = [];
    ellipses = [];
    texts = [];
    images = [];
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
            } else if (history[i] instanceof TextInput) {
                this.texts.push(history[i]);
                this.texts[this.texts.length - 1].index = i;
            } else if (history[i] instanceof ImageLocal) {
                this.images.push(history[i]);
                this.images[this.images.length - 1].source = undefined;
                this.images[this.images.length - 1].image =
                    `http://localhost:4747/projects/photo/${localStorage.getItem('ecaw-username')}/${projectId}/image${i}`;
                this.images[this.images.length - 1].index = i;
            }
        }
    }

    toHistoryArray() {
        let history = [];
        this.circles.forEach((item) => {
            history[item.index] = new Circle(item.centerX, item.centerY, item.radius, item.color, item.fill);
            history[item.index].active = item.active;
        });
        this.ellipses.forEach((item) => {
            history[item.index] = new Ellipse(item.x, item.y, item.toX, item.toY, item.color, item.fill);
            history[item.index].active = item.active;
        });
        this.lines.forEach((item) => {
            history[item.index] = new Line(item.x, item.y, item.toX, item.toY, item.color);
            history[item.index].active = item.active;
        });
        this.rectangles.forEach((item) => {
            history[item.index] = new Rectangle(item.x, item.y, item.toX, item.toY, item.color, item.fill);
            history[item.index].active = item.active;
        });
        this.images.forEach((item) => {
            history[item.index] = new ImageLocal(item.x, item.y, item.toX, item.toY, item.image);
            history[item.index].source = undefined;
            history[item.index].active = item.active;
        });
        this.texts.forEach((item) => {
            history[item.index] = new TextInput(item.startingX, item.startY, item.words);
            history[item.index].width = item.width;
            history[item.index].active = item.active;
        });
        return history;
    }

    restore(data) {
        Object.assign(this, data)
    }
}