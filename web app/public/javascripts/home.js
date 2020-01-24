let canvas = document.querySelector('canvas');
let selectedOption;
let color = "#000000";
let history = [];
//Stores every word
let recentWords = [];
let startingX = 0;
let selectedShape = undefined;
let currentHandle = undefined;
let fill = false;
let selectedItem = undefined;
let enterCoords = [];


let token = localStorage.getItem("ecaw-jwt");

//redirect if the user isn't logged in
if (!token) {
    window.location.href = "/";
}

/**
 *  Sets the initial canvas height and width
 */
canvas.width = window.innerWidth - 0.15 * window.innerWidth;
canvas.height = window.innerHeight;

//ghost canvas used for fill
let canvasBack = document.createElement("canvas");
canvasBack.width = canvas.width;
canvasBack.height = canvas.height;
ghostContext = canvasBack.getContext("2d");

let context = canvas.getContext('2d');
//a clean white canvas is needed for the flood fill tool
drawRectangle(context, 0, 0, canvas.width, canvas.height, "#ffffff", true);

/**
 * Clears the screen and draws all the shapes from history
 */
function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawRectangle(context, 0, 0, canvas.width, canvas.height, "#ffffff", true);
    context.drawImage(canvasBack, 0, 0);
    for (let i = 0; i < history.length; i++) {
        if (history[i] instanceof Rectangle) {
            drawRectangle(context, history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill);
        } else if (history[i] instanceof Line) {
            drawLine(context, history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill);
        } else if (history[i] instanceof Ellipse) {
            drawEllipse(context, history[i].x, history[i].y, history[i].toX, history[i].toY, history[i].color, history[i].fill);
        } else if (history[i] instanceof Circle) {
            drawCircle(context, history[i].centerX, history[i].centerY, history[i].radius, history[i].color, history[i].fill);
        } else if (history[i] instanceof TextInput) {
            history[i].words.forEach((key) => {
                drawText(key, x, y);
            });
            drawText(context, history[i].startingX, history[i].startY, history[i].words, history[i].enterCoords);
        }
    }
    // Draw the selection rect if there's one
    if (typeof selectedShape !== "undefined") {
        drawSelectedShape();
    }
}

function drawGhost() {
    ghostContext.clearRect(0, 0, context.canvas.width, context.canvas.height);
    ghostContext.drawImage(canvas, 0, 0);
    for (let i = 0; i < history.length; i++) {
        if (history[i] instanceof Rectangle) {
            drawRectangle(ghostContext, history[i].x, history[i].y, history[i].toX, history[i].toY, "#ffffff", history[i].fill);
        } else if (history[i] instanceof Line) {
            drawLine(ghostContext, history[i].x, history[i].y, history[i].toX, history[i].toY, "#ffffff", history[i].fill);
        } else if (history[i] instanceof Ellipse) {
            drawEllipse(ghostContext, history[i].x, history[i].y, history[i].toX, history[i].toY, "#ffffff", history[i].fill);
        } else if (history[i] instanceof Circle) {
            drawCircle(ghostContext, history[i].centerX, history[i].centerY, history[i].radius, "#ffffff", history[i].fill);
        } else if (history[i] instanceof TextInput) {
            drawText(ghostContext, history[i].startingX, history[i].startY, history[i].words, history[i].enterCoords);
        }
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
 * Draws the selection rect and the necessary handles for resizing
 */
function drawSelectedShape() {
    drawRectangle(context, selectedShape.x, selectedShape.y, selectedShape.toX, selectedShape.toY, "red");
    for (let i = 0; i < selectedShape.selectionHandles.length; i++) {
        //if the selected shape is a circle we only draw 2 handles
        if (selectedItem instanceof Circle) {
            if (i === 3 || i === 4) {
                drawRectangle(context, selectedShape.selectionHandles[i].x,
                    selectedShape.selectionHandles[i].y,
                    selectedShape.selectionHandles[i].x + selectedShape.handleSize,
                    selectedShape.selectionHandles[i].y + selectedShape.handleSize, "red", true)
            }
        }
        //we draw all handles if it's any other shape
        else {
            drawRectangle(context, selectedShape.selectionHandles[i].x,
                selectedShape.selectionHandles[i].y,
                selectedShape.selectionHandles[i].x + selectedShape.handleSize,
                selectedShape.selectionHandles[i].y + selectedShape.handleSize, "red", true)
        }
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
    if (selectedOption === 'text') {
        recentWords = [];
        startingX = e.offsetX;
    }
    if (selectedOption === "selector") {
        // if the mouse is over a handle don't try to search for another shape
        if (typeof currentHandle !== "undefined") {
            return;
        }
        //finds the last item from history that the user is trying to select
        let found = false;
        history.slice().reverse().forEach((item) => {
            if (!found && cursorInShape(e.offsetX, e.offsetY, item)) {
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
    if (selectedOption === "fill") {
        let colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
        let currentPixelLocation = (startY * canvas.width + startX) * 4;
        let r = colorLayerData.data[currentPixelLocation];
        let g = colorLayerData.data[currentPixelLocation + 1];
        let b = colorLayerData.data[currentPixelLocation + 2];
        floodFill(startX, startY, r, g, b, color);
    }
    redraw();
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
    if (isValidShape(startX, startY, endX, endY) || selectedOption === "circle") {
        //the drawing "animation" is over so we push the resulting shape into the history
        if (selectedOption === "rectangle" && endX !== undefined) {
            history.push(new Rectangle(startX, startY, endX, endY, color, fill));
        } else if (selectedOption === "line" && endX !== undefined) {
            history.push(new Line(startX, startY, endX, endY, color));
        } else if (selectedOption === "ellipse" && endX !== undefined) {
            history.push(new Ellipse(startX, startY, endX, endY, color, fill));
        } else if (selectedOption === 'text') {
            history.push(new TextInput(startingX, startY, recentWords, enterCoords));
        } else if (selectedOption === "circle" && endX !== undefined) {
            history.push(new Circle(startX, startY, 50, color, fill));
            redraw();
        }
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
        //if it is not a circle we use all 9 handles
        if (!(selectedItem instanceof Circle)) {
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
                    break;
                case 8:
                    let offsetX = (endX - startX);
                    let offsetY = (endY - startY);
                    selectedItem.x += offsetX;
                    selectedItem.y += offsetY;
                    selectedItem.toX += offsetX;
                    selectedItem.toY += offsetY;
                    startX = endX;
                    startY = endY;
                    selectedShape = new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY);
                    break;
            }
        }
        //if we deal with a circle we only have 2 handles to show
        else {
            switch (currentHandle) {
                case 3:
                    if (selectedItem instanceof Circle) {
                        if (selectedItem.resizeX(endX, selectedItem.toX)) {
                            selectedShape.x = selectedItem.x;
                            selectedShape.toX = selectedItem.toX;
                            selectedShape.y = selectedItem.y;
                            selectedShape.toY = selectedItem.toY;
                        }
                    }
                    break;
                case 4:
                    if (selectedItem.resizeX(selectedItem.x, endX)) {
                        selectedShape.x = selectedItem.x;
                        selectedShape.toX = selectedItem.toX;
                        selectedShape.y = selectedItem.y;
                        selectedShape.toY = selectedItem.toY;
                    }
                    break;
                case 8:
                    let offsetX = (endX - startX);
                    let offsetY = (endY - startY);
                    selectedItem.move(offsetX, offsetY);
                    startX = endX;
                    startY = endY;
                    selectedShape = new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY);
                    break;
            }
        }
        selectedShape.updateHandles();
    }

    //Get the handle over which the mouse is over and the cursor style
    else if (typeof selectedShape !== "undefined") {
        currentHandle = undefined;
        for (let i = 0; i < 8; i++) {
            let handle = selectedShape.selectionHandles[i];
            if (handle.x <= e.offsetX && e.offsetX <= handle.x + selectedShape.handleSize &&
                handle.y <= e.offsetY && e.offsetY <= handle.y + selectedShape.handleSize) {
                currentHandle = i;
            }
        }
        if (currentHandle === undefined) {
            if (cursorInShape(e.offsetX, e.offsetY, selectedShape)) {
                currentHandle = 8;
            }
        }
        if (!(selectedItem instanceof Circle)) {
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
                case 8:
                    canvas.style.cursor = 'move';
                    break;
                default:
                    canvas.style.cursor = 'crosshair';
                    break;
            }
        } else {
            switch (currentHandle) {
                case 3:
                    canvas.style.cursor = 'w-resize';
                    break;
                case 4:
                    canvas.style.cursor = 'e-resize';
                    break;
                case 8:
                    canvas.style.cursor = 'move';
                    break;
                default:
                    canvas.style.cursor = 'crosshair';
                    break;
            }
        }
    }

    if (!isDown) {
        return;
    }

    redraw();
    //"animate" the shape that is being drawn
    if (selectedOption === "rectangle") {
        drawRectangle(context, startX, startY, endX, endY, color, fill);
    } else if (selectedOption === "line") {
        drawLine(context, startX, startY, endX, endY, color);
    } else if (selectedOption === "ellipse") {
        drawEllipse(context, startX, startY, endX, endY, color, fill);
    }

}


/**
 * Draw functions
 *
 **/

//Array for backspace
let undoList = [];

function undo() {
    undoList.pop();

    let imgData = undoList[undoList.length - 1];
    let image = new Image();

    //Display old saved state
    image.src = imgData;
    image.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    }
}

function saveState() {
    undoList.push(canvas.toDataURL());
}

document.addEventListener('keydown', (ev) => {
    if (selectedOption !== "text") {
        return;
    }
    ev.preventDefault();
    context.font = '16px Arial';

    drawText(ev.key);
    recentWords.push(ev.key);
});

function drawText(key) {
    if (key === 'Backspace') {
        undo();

        //Remove recent word
        let recentWord = recentWords[recentWords.length - 1];

        startX -= context.measureText(recentWord).width;

        recentWords.pop();
    } else if (key === 'Enter') {
        // Press Enter
        enterCoords.push(startX);
        startX = startingX;
        startY += 20; //The size of the font + 4
    } else {
        context.fillStyle = color;
        context.fillText(key, startX, startY);
        context.fill();

        //Move cursor after every character
        startX += context.measureText(key).width;
        saveState();
    }
}

function drawRectangle(context, x, y, toX, toY, color, fill = false) {
    if (!fill) {
        context.strokeStyle = color;
        context.strokeRect(x, y, toX - x, toY - y);
    } else {
        context.fillStyle = color;
        context.fillRect(x, y, toX - x, toY - y);
    }

}

function drawLine(context, x, y, toX, toY, color) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.strokeStyle = color;
    context.stroke();
}

function drawCircle(context, x, y, radius, color, fill = false) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (!fill) {
        context.strokeStyle = color;
        context.stroke();
    } else {
        context.fillStyle = color;
        context.fill();
    }
}

function drawEllipse(context, x, y, toX, toY, color, fill = false) {
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

function floodFill(startX, startY, startR, startG, startB, color) {
    let found = false;
    history.slice().reverse().forEach((item) => {
        if (!found && cursorInShape(startX, startY, item)) {
            item.fill = true;
            found = true;
        }
    });
    if (found) {
        return;
    }
    //don't fill if it is the same color
    if (rgbOf(color).r === startR && rgbOf(color).g === startG && rgbOf(color).b === startB) {
        return;
    }
    //contains all the colo data of the pixels
    let colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
    let pixelStack = [
        [startX, startY]
    ];

    //draw a pixel at pixel position
    function drawPixel(pixelPos, r, g, b) {
        colorLayerData.data[pixelPos] = r;
        colorLayerData.data[pixelPos + 1] = g;
        colorLayerData.data[pixelPos + 2] = b;
    }

    //check if the pixel has the starting color
    function pixelMatchesColor(pixelPos, startR, startG, startB) {
        let r = colorLayerData.data[pixelPos];
        let g = colorLayerData.data[pixelPos + 1];
        let b = colorLayerData.data[pixelPos + 2];
        return (r === startR && g === startG && b === startB);
    }

    while (pixelStack.length) {
        let newPos = pixelStack.pop();
        let x = newPos[0];
        let y = newPos[1];

        // Get current pixel position
        let pixelPos = (y * canvas.width + x) * 4;

        // Go up as long as the color matches and we are inside the canvas
        while (y >= 0 && pixelMatchesColor(pixelPos, startR, startG, startB)) {
            y -= 1;
            pixelPos -= canvas.width * 4;
        }
        y += 1;
        pixelPos += canvas.width * 4;

        let reachLeft = false;
        let reachRight = false;

        // Go down as long as the color matches and we are inside the canvas
        while (y <= canvas.height && pixelMatchesColor(pixelPos, startR, startG, startB)) {
            y += 1;

            drawPixel(pixelPos, rgbOf(color).r, rgbOf(color).g, rgbOf(color).b);

            if (x > 0) {
                if (pixelMatchesColor(pixelPos - 4, startR, startG, startB)) {
                    if (!reachLeft) {
                        // Add pixel to stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < canvas.width) {
                if (pixelMatchesColor(pixelPos + 4, startR, startG, startB)) {
                    if (!reachRight) {
                        // Add pixel to stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }
            pixelPos += canvas.width * 4;
        }
    }
    //update the canvas
    context.putImageData(colorLayerData, 0, 0);
    //change the ghost canvas so we are able to redo the filling
    drawGhost();
}

/**
 * Helper functions
 */

//returns true if x,y inbounds of item,false otherwise
function cursorInShape(x, y, item) {
    return ((item.x < x && x < item.toX) && ((item.y < y && y < item.toY) || (item.y > y && y > item.toY))) ||
        ((item.x > x && x > item.toX) && ((item.y < y && y < item.toY) || (item.y > y && y > item.toY)));

}

//if the shape has no width and height it is invalid
function isValidShape(x, y, toX, toY) {
    return Math.abs(toX - x) > 0 && Math.abs(toY - y) > 0;

}

//return the r,g,b values of a hex color
function rgbOf(color) {
    let r = parseInt(color.slice(1, 3), 16),
        g = parseInt(color.slice(3, 5), 16),
        b = parseInt(color.slice(5, 7), 16);
    return {r: r, g: g, b: b};
}

/**
 * Options triggers
 */
function changeCurrentShape(option) {
    console.log(option);
    if (recentWords.length > 0) {
        history.push(T)
    }
    selectedOption = option;
    startX = undefined;
    startY = undefined;
    if (selectedOption !== "selector") {
        selectedShape = undefined;
        currentHandle = undefined;
        redraw();
    }
    document.getElementById('current').innerHTML = `Shape : ${option}`;
}

canvas.addEventListener('mousedown', (e) => {
    handleMouseDown(e);
});
canvas.addEventListener('mouseup', (e) => {
    handleMouseUp(e);
});
canvas.addEventListener('mousemove', (e) => {
    handleMouseMove(e);
});

/**
 * Downloads the ghost canvas locally
 * Used for debugging
 */
function asd() {
    document.getElementById("downloader").download = "image.png";
    document.getElementById("downloader").href = canvasBack.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

function save() {
    canvas.toBlob(function (blob) {
        var newImg = document.createElement('img'),
            url = URL.createObjectURL(blob);

        newImg.onload = function () {
            // no longer need to read the blob so it's revoked
            URL.revokeObjectURL(url);
        };

        let req = new XMLHttpRequest();
        let formData = new FormData();
        formData.append("canvas", blob, "canvas.png");
        formData.append("serverDatais",JSON.stringify(new ServerData(history, "asd", 6)))
        //todo: change endpoint
        req.open("POST", "http://localhost:4747/projects/home", true);
        req.onreadystatechange = function () {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    let result = JSON.parse(req.responseText);
                    if (result.success) {
                        token = result.token;
                    } else {
                        //todo:show error message
                        console.log("Login failed");
                    }
                } else if (req.status === 401) {
                    console.log("error");
                }
            }
        };
        req.send(formData)
    });
}

function restore() {
    /*let img=new Image();
    img.onload=function () {
        context.drawImage(img,0,0);
    };
    img.src="http://localhost:4747/projects/home";*/

    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:4747/projects", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let components = JSON.parse(req.responseText);
                console.log(components);
            } else if (req.status === 401) {
                console.log("error");
            }
        }
    };
    req.send(null);
}
