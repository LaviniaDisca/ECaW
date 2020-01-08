let canvas = document.querySelector('canvas');
let selectedOption;
let color = "#000";
let history = [];
let selectedShape = undefined;
let currentHandle = undefined;
let fill = false;
let selectedItem = undefined;

/**
 *  Sets the initial canvas height and width
 */
canvas.width = window.innerWidth - document.getElementById('options').offsetWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext('2d');

/**
 * Clears the screen and draws all the shapes from history
 */
function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i in history) {
        if (history[i] instanceof Rectangle) {
            drawRectangle(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill);
        } else if (history[i] instanceof Line) {
            drawLine(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill)
        } else if (history[i] instanceof Ellipse) {
            drawEllipse(history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill)
        } else if (history[i] instanceof Circle) {
            console.log(history[i].color);
            drawCircle(history[i].x, history[i].y, history[i].radius, history[i].color, history[i].fill)
        }
    }
    // Draw the selection rect if there's one
    if (typeof selectedShape !== "undefined") {
        drawSelectedShape();
    }
}

//mouseDown flag
let isDown = false;
//position of mouse when first clicked
let startX;
let startY;
//position of mouse on click release
let endX;
let endY;

/**
 * Draws the selection rect and 8 handles used for resizing
 */
function drawSelectedShape() {
    drawRectangle(selectedShape.x, selectedShape.y, selectedShape.toX, selectedShape.toY, "red");
    for (let i in selectedShape.selectionHandles) {
        drawRectangle(selectedShape.selectionHandles[i].x,
            selectedShape.selectionHandles[i].y,
            selectedShape.selectionHandles[i].x + selectedShape.handleSize,
            selectedShape.selectionHandles[i].y + selectedShape.handleSize, "red", true)
    }
}

/**
 * Mouse Handlers
 */

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    startX = e.offsetX;
    startY = e.offsetY;
    isDown = true;
    if (selectedOption === "selector") {
        // if the mouse ifs over a handle don't try to search for another shape
        if (typeof currentHandle !== "undefined") {
            return;
        }
        //finds the last item from history that the user is trying to select
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
        //if nothing is found undefine variables in case the user clicked outside any shape
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
    isDown = false;
    //the drawing "animation" is over so we push the resulting shape into the history
    if (selectedOption === "rectangle" && endX !== undefined) {
        history.push(new Rectangle(startX, startY, endX, endY, color, fill));
    } else if (selectedOption === "line" && endX !== undefined) {
        history.push(new Line(startX, startY, endX, endY, color));
    } else if (selectedOption === "ellipse" && endX !== undefined) {
        history.push(new Ellipse(startX, startY, endX, endY, color, fill));
    } else if (selectedOption === "circle" && endX !== undefined) {
        history.push(new Circle(startX, startY, 50, color, fill));
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

    //change the selected item size based on the handle that is being moved
    if (typeof currentHandle !== "undefined" && isDown && selectedOption === "selector") {
        switch (currentHandle) {
            case 0:
                selectedShape.x = endX;
                selectedShape.y = endY;
                selectedItem.x = endX;
                selectedItem.y = endY;
                break;
            case 1:
                selectedShape.y = endY;
                selectedItem.y = endY;
                break;
            case 2:
                selectedShape.toX = endX;
                selectedShape.y = endY;
                selectedItem.toX = endX;
                selectedItem.y = endY;
                break;
            case 3:
                selectedShape.x = endX;
                selectedItem.x = endX;
                break;
            case 4:
                selectedShape.toX = endX;
                selectedItem.toX = endX;
                break;
            case 5:
                selectedShape.x = endX;
                selectedShape.toY = endY;
                selectedItem.x = endX;
                selectedItem.toY = endY;
                break;
            case 6:
                selectedShape.toY = endY;
                selectedItem.toY = endY;
                break;
            case 7:
                selectedShape.toX = endX;
                selectedShape.toY = endY;
                selectedItem.toX = endX;
                selectedItem.toY = endY;
        }
        selectedShape.updateHandles();

    }
    //Get the handle over which the mouse is over and the cursor style
    else if (typeof selectedShape !== "undefined") {
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

    if (!isDown) {
        return;
    }

    redraw();
    //"animate" the shape that is being drawn
    if (selectedOption === "rectangle") {
        drawRectangle(startX, startY, endX, endY, color, fill);
    } else if (selectedOption === "line") {
        drawLine(startX, startY, endX, endY, color);
    } else if (selectedOption === "ellipse") {
        drawEllipse(startX, startY, endX, endY, color, fill);
    }

}


/**
 * Draw functions
 *
 **/
function drawRectangle(x, y, toX, toY, color, fill = false) {
    if (!fill) {
        context.strokeStyle = color;
        context.strokeRect(x, y, toX - x, toY - y);
    } else {
        context.fillStyle = color;
        context.fillRect(x, y, toX - x, toY - y);
    }

}

function drawLine(x, y, toX, toY, color) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.strokeStyle = color;
    context.stroke();
}

//TODO: Change with something that can actually be filled
function drawCircle(x, y, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, 50, 0, Math.PI * 2, false);
    context.fill();
}

function drawEllipse(x, y, toX, toY, color, fill = false) {
    context.beginPath();
    context.ellipse(x + (toX - x) / 2, y + (toY - y) / 2, Math.abs((toX - x) / 2), Math.abs((toY - y) / 2), 0, 0, Math.PI * 2, false);
    if (!fill) {
        context.strokeStyle = color;
        context.stroke();
    } else {
        context.fillStyle = color;
        context.fill();
    }
}

/**
 * Options triggers
 */
function changeCurrentShape(text) {
    if (selectedOption !== "selector") {
        selectedShape = undefined;
        currentHandle = undefined;
        redraw();
    }
    document.getElementById('current').innerHTML = `Shape : ${text}`;
}

document.getElementById('ellipse').addEventListener('click', () => {
    selectedOption = "ellipse";
    changeCurrentShape(selectedOption);
});

document.getElementById("selector").addEventListener('click', () => {
    selectedOption = "selector";
    changeCurrentShape(selectedOption);
});

document.getElementById("circle").addEventListener("click", () => {
    selectedOption = "circle";
    changeCurrentShape(selectedOption);
});

document.getElementById("line").addEventListener("click", () => {
    selectedOption = "line";
    changeCurrentShape(selectedOption);
});
document.getElementById('rectangle').addEventListener('click', () => {
    selectedOption = "rectangle";
    changeCurrentShape(selectedOption);
});

document.getElementById('color').addEventListener('change', (e) => {
    color = document.getElementById('color').value;
});

document.getElementById('fill').addEventListener('change', (e) => {
    fill = document.getElementById('fill').checked;
    console.log(fill);
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
