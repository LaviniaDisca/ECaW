let getRectangleEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}"/></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}"/></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}"/></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number" placeholder="${history[index].toY}"/></label><br/>
                        <label for="colorR">Color<input id="colorR" type="color"  placeholder="${history[index].color}"/></label><br/>
                        </form>`;
};
let getLineEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}" /></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}" /></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number"   placeholder="${history[index].toY}" /></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color"  placeholder="${history[index].color}" /></label><br/>
                        </form>`;
};

let getEllipseEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number"  placeholder="${history[index].x}" /></label><br/>
                        <label for="y">y coord<input id="y" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" placeholder="${history[index].toX}" /></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number"  placeholder="${history[index].toY}" /></label><br/>
                        <label for="colorE">Color<input id="colorE" type="color" placeholder="${history[index].color}" /></label><br/>
                        </form>`;
};

let getCircleEditor = function (index) {
    return `<form id="info">
                        <label for="centerX">centerX coord<input id="centerX" type="number" placeholder="${history[index].x}" /></label><br/>
                        <label for="centerY">centerY coord<input id="centerY" type="number"  placeholder="${history[index].y}" /></label><br/>
                        <label for="radius">radius coord<input id="radius" type="number"  placeholder="${history[index].toX}" /></label><br/>
                        <label for="colorC">Color<input id="colorC" type="color"  placeholder="${history[index].color}" /></label><br/>
<!--                        <label for="fill">fill<input id="fill" type="checkbox" value="fill" placeholder="${history[index].width}" onchange="fill=value"/></label><br/>-->
                        </form>`;
};