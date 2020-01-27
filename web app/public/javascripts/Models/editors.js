let getRectangleEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}"/></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}"/></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}"/></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number" placeholder="${history[index].toY}"/></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="${history[index].color}" placeholder="${history[index].color}"/></label><br/>
                        <label for="active">Active : <input id="active" type="checkbox"/></label><br/>
                        </form>`;
};
let getLineEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}" /></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}" /></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number"   placeholder="${history[index].toY}" /></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="${history[index].color}" placeholder="${history[index].color}" /></label><br/>
                        <label for="active">Active : <input id="active" type="checkbox"/></label><br/>
                        </form>`;
};

let getEllipseEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}" /></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}" /></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number"  placeholder="${history[index].toY}" /></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="${history[index].color}" placeholder="${history[index].color}" /></label><br/>
                        <label for="active">Active : <input id="active" type="checkbox"/></label><br/>
                        </form>`;
};

let getCircleEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number" placeholder="${history[index].x}" /></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="radius">radius<input id="radius" type="number"  placeholder="${history[index].radius}" /></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="${history[index].color}" placeholder="${history[index].color}" /></label><br/>
                        <label for="active">Active : <input id="active" type="checkbox"/></label><br/>
                        </form>`;
};

let getTextEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].startingX}"/></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].startY}"/></label><br/>
                        <label for="fontSize">font size<input id="fontSize" type="number" placeholder="${history[index].fontSize}"/></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="${history[index].color}" placeholder="${history[index].color}" /></label><br/>
                        <label for="active">Active : <input id="active" type="checkbox"/></label><br/>
                        </form>`;
};