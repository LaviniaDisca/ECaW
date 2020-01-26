let canvas = document.querySelector('canvas');
let selectedOption;
let color = "#000000";
let history = [];
//Stores every word
let selectedShape = undefined;
let currentHandle = undefined;
let fill = false;
let selectedItem = undefined;
let currentText = undefined;
let nbR = 0,
    nbC = 0,
    nbE = 0,
    nbT = 0,
    nbL = 0;
let token = localStorage.getItem("ecaw-jwt");

console.log(projectId);
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
restore();

document.getElementById('image').addEventListener('change', function (e) {
    let image = e.target.files[0];
    let img = new Image;
    img.onload = function () {
        context.drawImage(img, 20, 20, 500, 500);
        alert('the image is drawn');
    };
    img.src = URL.createObjectURL(e.target.files[0]);
    /*let req = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("canvas", image, "test.png");
    req.open("POST", `http://localhost:4747/projects/photo/${projectId}`, true);
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                console.log(req.responseText);
            } else {
                console.log(req.responseText);
            }
        }
    };
    req.send(formData)*/
});

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
            let x = history[i].startingX;
            let y = history[i].startY;
            history[i].words.forEach((key) => {
                let increase = drawKey(key, x, y, history[i].startingX);
                x += increase.x;
                y += increase.y;
            });
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
 * Handlers
 */
function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    startX = e.offsetX;
    startY = e.offsetY;
    isDown = true;
    if (selectedOption === "extract") {
        let pixel = context.getImageData(startX, startY, 1, 1).data;
        color = "#" + ("000000" + hexOf(pixel[0], pixel[1], pixel[2])).slice(-6);
        document.getElementById('color').value = color;
    }
    if (selectedOption === 'text') {
        currentText = new TextInput(e.offsetX, startY, []);
        history.push(currentText);
        nbT++;
        createHistoryButton('text', nbT, history.length - 1);
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
                changeSelection(item, new SelectRect(item.x, item.y, item.toX, item.toY));
                found = true;
            }
        });
        //if nothing is found undefine variables in case the user clicked outside any shape
        if (!found) {
            changeSelection(undefined, undefined);
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

function createHistoryButton(type, shapeIndex, historyIndex) {
    let newOb = document.createElement('button');
    let capitalizedName = type.charAt(0).toUpperCase() + type.slice(1);
    newOb.innerHTML = `${capitalizedName} ${shapeIndex}`;
    newOb.value = `${historyIndex}`;
    newOb.addEventListener('click', (e) => {
        let item = history[parseInt(newOb.value)];
        changeSelection(item, new SelectRect(item.x, item.y, item.toX, item.toY));
        changeInfo(type, parseInt(newOb.value));
        changeCurrentShape("selector");
    });
    document.getElementById('history').appendChild(newOb);
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
    if (isValidShape(startX, startY, endX, endY) || selectedOption === "circle") {
        //the drawing "animation" is over so we push the resulting shape into the history
        if (selectedOption === "rectangle" && endX !== undefined) {
            history.push(new Rectangle(startX, startY, endX, endY, color, fill));
            nbR++;
            createHistoryButton('rectangle', nbR,history.length-1);
        } else if (selectedOption === "line" && endX !== undefined) {
            history.push(new Line(startX, startY, endX, endY, color));
            nbL++;
            createHistoryButton('line', nbL,history.length-1);
        } else if (selectedOption === "ellipse" && endX !== undefined) {
            history.push(new Ellipse(startX, startY, endX, endY, color, fill));
            nbE++;
            createHistoryButton('ellipse', nbE,history.length-1);
        } else if (selectedOption === "circle" && endX !== undefined) {
            history.push(new Circle(startX, startY, 50, color, fill));
            nbC++;
            createHistoryButton('circle', nbC,history.length-1);
            redraw();
        }
    }
    endX = undefined;
    endY = undefined;
    console.log(history);
}

function changeInfo(shape, index) {
    /**
     * Remove the old editor if it exists
     * @type {HTMLElement}
     */
    function insertEditor(editor) {
        let buttons = document.getElementById('history').getElementsByTagName("button");
        let currentBtn;
        for (let i = 0; i < buttons.length; i++) {
            if (`${buttons[i].value}` === `${index}`) {
                currentBtn = buttons[i];
            }
        }
        document.getElementById('history').insertBefore(editor, currentBtn.nextSibling);
    }

    function addRectListeners() {
        let X = document.getElementById("x");
        X.addEventListener('change', () => {
            if (X.value !== undefined) {
                selectedItem.x = parseInt(X.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let Y = document.getElementById("y");
        Y.addEventListener('change', (e) => {
            if (Y.value !== undefined) {
                selectedItem.y = parseInt(Y.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toX = document.getElementById("toX");
        toX.addEventListener('change', (e) => {
            if (toX.value !== undefined) {
                selectedItem.toX = parseInt(toX.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toY = document.getElementById("toY");
        toY.addEventListener('change', (e) => {
            if (toY.value !== undefined) {
                selectedItem.toY = parseInt(toY.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localColor = document.getElementById("colorR");
        localColor.addEventListener('change', (e) => {
            selectedItem.color = localColor.value;
            changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
        });
    }

    let historyTab = document.getElementById('history');
    let editor = document.getElementById('editor');
    if (editor)
        historyTab.removeChild(editor);
    if (shape === 'rectangle') {
        let editor = document.createElement('div');
        editor.id = "editor";
        editor.innerHTML = getRectangleEditor(index);
        insertEditor(editor);
        addRectListeners();
    } else if (shape === 'line') {
        let editor = document.createElement('div');
        editor.id = "editor";
        editor.innerHTML = getLineEditor(index);
        insertEditor(editor);
        let X = document.getElementById("x");
        X.addEventListener('change', (e) => {
            if (X.value !== undefined) {
                selectedItem.x = parseInt(X.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let Y = document.getElementById("y");
        Y.addEventListener('change', (e) => {
            if (Y.value !== undefined) {
                selectedItem.y = parseInt(Y.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toX = document.getElementById("toX");
        toX.addEventListener('change', (e) => {
            if (toX.value !== undefined) {
                selectedItem.toX = parseInt(toX.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toY = document.getElementById("toY");
        toY.addEventListener('change', (e) => {
            if (toY.value !== undefined) {
                selectedItem.toY = parseInt(toY.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localColor = document.getElementById("colorL");
        localColor.addEventListener('change', (e) => {
            selectedItem.color = localColor.value;
            changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
        });
    } else if (shape === 'ellipse') {
        let editor = document.createElement('div');
        editor.id = "editor";
        editor.innerHTML = getEllipseEditor(index);
        insertEditor(editor);
        let localX = document.getElementById("x");
        localX.addEventListener('change', (e) => {
            if (localX.value !== undefined) {
                selectedItem.x = parseInt(localX.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localY = document.getElementById("y");
        localY.addEventListener('change', (e) => {
            if (localY.value !== undefined) {
                selectedItem.y = parseInt(localY.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toX = document.getElementById("toX");
        toX.addEventListener('change', (e) => {
            if (toX.value !== undefined) {
                selectedItem.toX = parseInt(toX.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let toY = document.getElementById("toY");
        toY.addEventListener('change', (e) => {
            if (toY.value !== undefined) {
                selectedItem.toY = parseInt(toY.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localColor = document.getElementById("colorE");
        localColor.addEventListener('change', (e) => {
            selectedItem.color = localColor.value;
            changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
        });
    } else if (shape === 'circle') {
        let editor = document.createElement('div');
        editor.id = "editor";
        editor.innerHTML = getCircleEditor(index);
        insertEditor(editor);
        let localX = document.getElementById("centerX");
        localX.addEventListener('change', (e) => {
            if (localX.value !== undefined) {
                selectedItem.centerX = parseInt(localX.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localY = document.getElementById("centerY");
        localY.addEventListener('change', (e) => {
            if (localY.value !== undefined) {
                selectedItem.centerY = parseInt(localY.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localRadius = document.getElementById("radius");
        localRadius.addEventListener('change', (e) => {
            if (localRadius.value !== undefined) {
                selectedItem.radius = parseInt(localRadius.value);
                changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
            }
        });
        let localColor = document.getElementById("colorC");
        localColor.addEventListener('change', (e) => {
            selectedItem.color = localColor.value;
            changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
        });
    }
}

function changeSelection(item, selectR) {
    selectedShape = selectR;
    selectedItem = item;
    if (item) {
        let shape;
        if (item instanceof Rectangle) {
            shape = "rectangle";
        } else if (item instanceof Line) {
            shape = "line";
        } else if (item instanceof Ellipse) {
            shape = "ellipse";
        } else if (item instanceof Circle) {
            shape = "circle";
        }
        changeInfo(shape, history.indexOf(item));
    }
    /*let form = document.getElementById('info');
    if (item === undefined && form) {
        //todo: remove the form from the document
        form.parentNode.removeChild(form);
    }*/
    redraw();
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
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 1:
                    selectedShape.y = endY;
                    selectedItem.y = endY;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 2:
                    selectedShape.toX = endX;
                    selectedShape.y = endY;
                    selectedItem.toX = endX;
                    selectedItem.y = endY;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 3:
                    selectedShape.x = endX;
                    selectedItem.x = endX;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 4:
                    selectedShape.toX = endX;
                    selectedItem.toX = endX;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 5:
                    selectedShape.x = endX;
                    selectedShape.toY = endY;
                    selectedItem.x = endX;
                    selectedItem.toY = endY;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 6:
                    selectedShape.toY = endY;
                    selectedItem.toY = endY;
                    changeSelection(selectedItem, selectedShape);
                    break;
                case 7:
                    selectedShape.toX = endX;
                    selectedShape.toY = endY;
                    selectedItem.toX = endX;
                    selectedItem.toY = endY;
                    changeSelection(selectedItem, selectedShape);
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
                    changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
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
                            changeSelection(selectedItem, selectedShape);
                        }
                    }
                    break;
                case 4:
                    if (selectedItem.resizeX(selectedItem.x, endX)) {
                        selectedShape.x = selectedItem.x;
                        selectedShape.toX = selectedItem.toX;
                        selectedShape.y = selectedItem.y;
                        selectedShape.toY = selectedItem.toY;
                        changeSelection(selectedItem, selectedShape);
                    }
                    break;
                case 8:
                    let offsetX = (endX - startX);
                    let offsetY = (endY - startY);
                    selectedItem.move(offsetX, offsetY);
                    startX = endX;
                    startY = endY;
                    changeSelection(selectedItem, new SelectRect(selectedItem.x, selectedItem.y, selectedItem.toX, selectedItem.toY));
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

function handleTextKeyPress(key) {
    if (key === 'Backspace') {
        if (currentText.words.length < 1) {
            return;
        }
        //sterge ultima litera si redeseneaza
        let recentChar = currentText.words.pop();
        if (recentChar === "Enter") {
            let lastWord = currentText.words.join("").split("Enter").reverse()[0];
            let length = context.measureText(lastWord).width;
            startX = currentText.startingX + length;
            //todo:replace with fontsize+4
            startY -= 20;
        } else {
            startX -= context.measureText(recentChar).width;
        }
        redraw();
    } else {
        let increase = drawKey(key, startX, startY, currentText.startingX);
        startX += increase.x;
        startY += increase.y;
        currentText.words.push(key);
    }
}

/**
 * Draw functions
 *
 **/


/**
 *  Draws a letter and modifies returns the adjustments to be done to x,y
 */
function drawKey(key, x, y, startingX) {
    //todo: add font-size and type to parameters and to the model
    context.font = '16px Arial';
    let result = {
        x: 0,
        y: 0
    };
    //handle the ENTER key
    if (key === "Enter") {
        result.x = startingX - x;
        result.y += 20; //The size of the font + 4
    } else {
        context.fillStyle = color;
        context.fillText(key, x, y);

        //Move cursor after every character
        result.x = context.measureText(key).width;
    }
    return result;
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
        if (!(item instanceof Line) && !found && cursorInShape(startX, startY, item)) {
            item.color = color;
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

function hexOf(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

/**
 * Options triggers
 */
function changeCurrentShape(option) {
    //reset the selected text just in case i guess
    if (currentText) {
        currentText = undefined;
    }
    selectedOption = option;
    startX = undefined;
    startY = undefined;
    if (selectedOption !== "selector") {
        changeSelection(undefined, undefined);
        currentHandle = undefined;
        redraw();
    }
    document.getElementById('current').innerHTML = `Shape : ${option}`;
}

document.addEventListener('keydown', (e) => {
    if (selectedOption === "text") {
        e.preventDefault();
        handleTextKeyPress(e.key);
    } else {
        //todo: probably add shortcuts here?
    }
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

/**
 * Downloads the ghost canvas locally
 * Used for debugging
 */
function downloadCanvas() {
    console.log("downloading");
    document.getElementById("downloader").download = "image.png";
    document.getElementById("downloader").href = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

function save() {
    changeSelection(undefined, undefined);
    let req = new XMLHttpRequest();
    req.open("POST", `http://localhost:4747/projects/${projectId}`, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let response = JSON.parse(req.responseText);
                if (response.success) {
                    //this will be the thumbnail for the project
                    updateServerCanvas("front");
                    //this will save the flood fills
                    updateServerCanvas("back");
                }
            } else if (req.status === 401) {
                console.log("error");
            }
        }
    };
    let title = document.getElementById('projectTitle').value;
    if (title.length < 1) {
        title = `Project ${projectId}`;
    }
    if (title.length > 15) {
        title = title.substring(15);
    }
    req.send(JSON.stringify(new ServerData(history, localStorage.getItem('ecaw-username'), parseInt(projectId), title)));
}

function updateServerCanvas(canvasType) {
    let canvasToSave;
    let fileName;
    if (canvasType === "front") {
        canvasToSave = canvas;
        fileName = "canvas.png";
    } else if (canvasType === "back") {
        canvasToSave = canvasBack;
        fileName = "canvas-back.png";
    }
    canvasToSave.toBlob(function (blob) {
        let req = new XMLHttpRequest();
        let formData = new FormData();
        formData.append("canvas", blob, fileName);
        req.open("POST", `http://localhost:4747/projects/photo/${projectId}`, true);
        req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
        req.onreadystatechange = function () {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    console.log(req.responseText);
                } else {
                    console.log(req.responseText);
                }
            }
        };
        req.send(formData)
    });
}

function restore() {
    let img = new Image();
    img.onload = function () {
        ghostContext.drawImage(img, 0, 0);
        redraw();
    };
    //without cross-origin the next save will always fail
    img.crossOrigin = "Anonymous";
    img.src = `http://localhost:4747/projects/photo/${localStorage.getItem('ecaw-username')}/${projectId}/canvas-back`;

    let req = new XMLHttpRequest();
    req.open("GET", `http://localhost:4747/projects/${projectId}`, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let components = JSON.parse(req.responseText);
                let serverData = new ServerData();
                serverData.restore(components);
                document.getElementById('projectTitle').value = serverData.title;
                history = serverData.toHistoryArray();
                history.forEach((item) => {
                    if (item instanceof Rectangle) {
                        nbR++;
                        createHistoryButton('rectangle', nbR,history.indexOf(item));
                    } else if (item instanceof Line) {
                        nbL++;
                        createHistoryButton('line', nbL,history.indexOf(item));
                    } else if (item instanceof Ellipse) {
                        nbE++;
                        createHistoryButton('ellipse', nbE,history.indexOf(item));
                    } else if (item instanceof Circle) {
                        nbC++;
                        createHistoryButton('circle', nbC,history.indexOf(item));
                    }
                });
                console.log(history);
                redraw();
            } else if (req.status === 401) {
                console.log("error");
            }
        }
    };
    req.send(null);
}

document.getElementById('backpage').addEventListener('click', (ev) => {
    window.location.href = '/home';
});