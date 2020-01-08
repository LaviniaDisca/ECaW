let canvas = document.querySelector('canvas');
let currentShape;
let color = "#000";
let history = [];
canvas.width = window.innerWidth - document.getElementById('options').offsetWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext('2d');

document.getElementById('color').addEventListener('change', (e) => {
    color = document.getElementById('color').value;
    console.log(color);
});

canvas.addEventListener('mousedown', (e) => {
    handleMouseDown(e);
});
canvas.addEventListener('mouseup', (e) => {
    handleMouseUp(e);
});
canvas.addEventListener('mousemove', (e) => {
    handleMouseMove(e);
});

canvas.addEventListener("click", (event) => {
    switch (currentShape) {
        case "rectangle":
            drawRectangle(event.offsetX, event.offsetY);
            break;
        case "line":
            drawLine(event.offsetX, event.offsetY);
            break;
        case "circle":
            drawCircle(event.offsetX, event.offsetY);
            break;
        default:
            break;
    }
});

function redraw() {
    for (let i in history) {
        if (history[i] instanceof Rectangle) {
            drawRectangle(history[i].x, history[i].y, history[i].width, history[i].height, history[i].color);
        } else if (history[i] instanceof Line) {
            drawLine(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color)
        } else if (history[i] instanceof Ellipse) {
            drawEllipse(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color)
        }
    }
}

function changeCurrentShape(text) {
    document.getElementById('current').innerHTML = `Shape : ${text}`;
}

let isDown = false;
let startX;
let startY;
let endX;
let endY;

function handleMouseDown(e) {
    if (currentShape === "selector") {
        e.preventDefault();
        e.stopPropagation();
        let found = false;
        history.slice().reverse().forEach((item) => {
            if (!found && (item.x < e.offsetX && e.offsetX < item.toX) && (item.y < e.offsetY && e.offsetY < item.toY)) {
                drawRectangle(item.x, item.y, item.toX - item.x, item.toY - item.y, "red");
                let selectR = new SelectRect(item.x, item.y, item.toX, item.toY);
                for (let i in selectR.selectionHandles) {
                    drawRectangle(selectR.selectionHandles[i].x, selectR.selectionHandles[i].y, selectR.handleSize, selectR.handleSize)
                }
                found = true;
            } else if (!found && (item.x > e.offsetX && e.offsetX > item.toX) && (item.y > e.offsetY && e.offsetY > item.toY)) {
                console.log("found");
                drawRectangle(item.x, item.y, Math.abs(item.toX - item.x), Math.abs(item.toY - item.y), "red");
                let selectR = new SelectRect(item.x, item.y, item.toX, item.toY);
                for (let i in selectR.selectionHandles) {
                    drawRectangle(selectR.selectionHandles[i].x, selectR.selectionHandles[i].y, selectR.handleSize, selectR.handleSize)
                }
                found = true;
            }
        })
    }
    if (currentShape === "rectangle" || currentShape === "line" || currentShape === "ellipse") {
        e.preventDefault();
        e.stopPropagation();

        // save the starting x/y of the rectangle
        startX = e.offsetX;
        startY = e.offsetY;
        // set a flag indicating the drag has begun
        isDown = true;
    }
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isDown = false;
    if (currentShape === "rectangle" && endX !== undefined) {
        history.push(new Rectangle(startX, startY, endX, endY, color));
    } else if (currentShape === "line" && endX !== undefined) {
        history.push(new Line(startX, startY, endX, endY, color));
    } else if (currentShape === "ellipse" && endX !== undefined) {
        history.push(new Ellipse(startX, startY, endX, endY, color));
    }
    endX = undefined;
    endY = undefined;
    //redraw();
    console.log(history);
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    // if we're not dragging, just return
    if (!isDown) {
        return;
    }

    // get the current mouse position
    endX = e.offsetX;
    endY = e.offsetY;

    // Put your mousemove stuff here

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw a new rect from the start position
    // to the current mouse position

    redraw();
    if (currentShape === "rectangle") {
        drawRectangle(startX, startY, endX - startX, endY - startY, color);
    } else if (currentShape === "line") {
        drawLine(startX, startY, endX, endY, color);
    } else if (currentShape === "ellipse") {
        drawEllipse(startX, startY, endX, endY, color);
    }

}


function drawRectangle(x, y, width, height, color) {
    context.strokeStyle = color;
    context.strokeRect(x, y, width, height);
}

document.getElementById('rectangle').addEventListener('click', () => {
    currentShape = "rectangle";
    changeCurrentShape(currentShape);
});

function drawLine(x, y, toX, toY, color) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.strokeStyle = color;
    context.stroke();
}

document.getElementById("line").addEventListener("click", () => {
    currentShape = "line";
    changeCurrentShape(currentShape);
});

function drawCircle(x, y, color) {
    context.beginPath();
    context.arc(x, y, 50, 0, Math.PI * 2, false);
    context.strokeStyle = color;
    context.stroke();
    history.push(new Circle(x, y, 50));
    console.log(history);
}

document.getElementById("circle").addEventListener("click", () => {
    currentShape = "circle";
    changeCurrentShape(currentShape);
});

function drawEllipse(x, y, toX, toY, color) {
    context.beginPath();
    context.ellipse(x + (toX - x) / 2, y + (toY - y) / 2, Math.abs((toX - x) / 2), Math.abs((toY - y) / 2), 0, 0, Math.PI * 2, false);
    context.strokeStyle = color;
    context.stroke();
}


document.getElementById('ellipse').addEventListener('click', () => {
    currentShape = "ellipse";
    changeCurrentShape(currentShape);
});


document.getElementById("selector").addEventListener('click', () => {
    currentShape = "selector";
    changeCurrentShape(currentShape);
    // drawRectangle(10,10,90,90);
    // let r = new SelectRect(10, 10, 100, 100);
    // for (let i in r.selectionHandles){
    //     drawRectangle(r.selectionHandles[i].x,r.selectionHandles[i].y,r.handleSize,r.handleSize)
    // }
});