let canvas = document.querySelector('canvas');
let selectedOption;
let color = "#000";
let history = [];
let selectedShape = undefined;
let currentHandle = undefined;
let expectResize = false;
let selectedItem = undefined;
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
    switch (selectedOption) {
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
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i in history) {
        if (history[i] instanceof Rectangle) {
            drawRectangle(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color);
        } else if (history[i] instanceof Line) {
            drawLine(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color)
        } else if (history[i] instanceof Ellipse) {
            drawEllipse(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color)
        }
    }
    if (typeof selectedShape !== "undefined") {
        drawSelectedShape();
    }
}

function changeCurrentShape(text) {
    if (selectedOption !== "selector") {
        selectedShape = undefined;
        currentHandle = undefined;
        redraw();
    }
    document.getElementById('current').innerHTML = `Shape : ${text}`;
}

let isDown = false;
let startX;
let startY;
let endX;
let endY;

function drawSelectedShape() {
    drawRectangle(selectedShape.x, selectedShape.y, selectedShape.toX, selectedShape.toY, "red");
    for (let i in selectedShape.selectionHandles) {
        drawRectangle(selectedShape.selectionHandles[i].x,
            selectedShape.selectionHandles[i].y,
            selectedShape.selectionHandles[i].x + selectedShape.handleSize,
            selectedShape.selectionHandles[i].y + selectedShape.handleSize, "red", true)
    }
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    startX = e.offsetX;
    startY = e.offsetY;
    isDown = true;
    if (selectedOption === "selector") {
        if (typeof currentHandle !== "undefined") {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        let found = false;
        history.slice().reverse().forEach((item) => {
            if (!found && (item.x < e.offsetX && e.offsetX < item.toX) && ((item.y < e.offsetY && e.offsetY < item.toY) || (item.y > e.offsetY && e.offsetY > item.toY))) {
                selectedShape = new SelectRect(item.x, item.y, item.toX, item.toY);
                selectedItem = item;
                found = true;
            }
            if (!found && (item.x > e.offsetX && e.offsetX > item.toX) && ((item.y < e.offsetY && e.offsetY < item.toY) || (item.y > e.offsetY && e.offsetY > item.toY))) {
                selectedShape = new SelectRect(item.x, item.y, item.toX, item.toY);
                selectedItem = item;
                found = true;
            }
        });
        if (!found) {
            selectedShape = undefined;
            selectedItem = undefined;
        }
    }
    redraw();
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isDown = false;
    if (selectedOption === "rectangle" && endX !== undefined) {
        history.push(new Rectangle(startX, startY, endX, endY, color));
    } else if (selectedOption === "line" && endX !== undefined) {
        history.push(new Line(startX, startY, endX, endY, color));
    } else if (selectedOption === "ellipse" && endX !== undefined) {
        history.push(new Ellipse(startX, startY, endX, endY, color));
    }
    endX = undefined;
    endY = undefined;
    console.log(history);
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    endX = e.offsetX;
    endY = e.offsetY;


    if (typeof currentHandle !== "undefined" && isDown) {
        if (selectedOption === "selector") {
            switch (currentHandle) {
                case 3:
                    selectedShape.x = endX;
                    selectedItem.x = endX;
                    break;
            }
            selectedShape.updateHandles();
        }
    } else if (typeof selectedShape !== "undefined") {
        currentHandle = undefined;
        for (let i = 0; i < 8; i++) {
            let handle = selectedShape.selectionHandles[i];
            if (handle.x <= e.offsetX && e.offsetX <= handle.x + selectedShape.handleSize
                && handle.y <= e.offsetY && e.offsetY <= handle.y + selectedShape.handleSize) {
                currentHandle = i;
            }
        }
        switch (currentHandle) {
            case 0:
                canvas.style.cursor = 'nw-resize';
                break;
            case 1:
                canvas.style.cursor = 'n-resize';
                break;
            case 2:
                canvas.style.cursor = 'ne-resize';
                break;
            case 3:
                canvas.style.cursor = 'w-resize';
                break;
            case 4:
                canvas.style.cursor = 'e-resize';
                break;
            case 5:
                canvas.style.cursor = 'sw-resize';
                break;
            case 6:
                canvas.style.cursor = 's-resize';
                break;
            case 7:
                canvas.style.cursor = 'se-resize';
                break;
            default:
                canvas.style.cursor = 'crosshair';
                break;
        }
    }

    // if we're not dragging, just return
    if (!isDown) {
        return;
    }

    // draw a new rect from the start position
    // to the current mouse position

    redraw();
    if (selectedOption === "rectangle") {
        drawRectangle(startX, startY, endX, endY, color);
    } else if (selectedOption === "line") {
        drawLine(startX, startY, endX, endY, color);
    } else if (selectedOption === "ellipse") {
        drawEllipse(startX, startY, endX, endY, color);
    }

}


function drawRectangle(x, y, toX, toY, color, fill = false) {
    if (!fill) {
        context.strokeStyle = color;
        context.strokeRect(x, y, toX - x, toY - y);
    } else {
        context.fillStyle = color;
        context.fillRect(x, y, toX - x, toY - y);
    }

}

document.getElementById('rectangle').addEventListener('click', () => {
    selectedOption = "rectangle";
    changeCurrentShape(selectedOption);
});

function drawLine(x, y, toX, toY, color) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.strokeStyle = color;
    context.stroke();
}

document.getElementById("line").addEventListener("click", () => {
    selectedOption = "line";
    changeCurrentShape(selectedOption);
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
    selectedOption = "circle";
    changeCurrentShape(selectedOption);
});

function drawEllipse(x, y, toX, toY, color) {
    context.beginPath();
    context.ellipse(x + (toX - x) / 2, y + (toY - y) / 2, Math.abs((toX - x) / 2), Math.abs((toY - y) / 2), 0, 0, Math.PI * 2, false);
    context.strokeStyle = color;
    context.stroke();
}


document.getElementById('ellipse').addEventListener('click', () => {
    selectedOption = "ellipse";
    changeCurrentShape(selectedOption);
});


document.getElementById("selector").addEventListener('click', () => {
    selectedOption = "selector";
    changeCurrentShape(selectedOption);
    // drawRectangle(10,10,90,90);
    // let r = new SelectRect(10, 10, 100, 100);
    // for (let i in r.selectionHandles){
    //     drawRectangle(r.selectionHandles[i].x,r.selectionHandles[i].y,r.handleSize,r.handleSize)
    // }
});