let getRectangleEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number" value="x" placeholder="${history[index].x}" onchange="x=value"/></label><br/>
                        <label for="y">y coord<input id="y" type="number" value="y" placeholder="${history[index].y}" onchange="y=value"/></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" value="toX" placeholder="${history[index].toX}" onchange="toX=value"/></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number" value="toY" placeholder="${history[index].toY}" onchange="toY=value"/></label><br/>
                        <label for="width">width<input id="width" type="number" value="width" placeholder="${history[index].width}" onchange="width=value"/></label><br/>
                        <label for="height">height<input id="height" type="number" value="height" placeholder="${history[index].height}" onchange="height=value"/></label><br/>
                        <label for="colorR">Color<input id="colorR" type="color" value="color" placeholder="${history[index].color}" onchange="colorR=value"/></label><br/>
                        </form>`;
};
let getLineEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number" value="x" placeholder="${history[index].x}" onchange="x=value"/></label><br/>
                        <label for="y">y coord<input id="y" type="number" value="y" placeholder="${history[index].y}" onchange="y=value"/></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" value="toX" placeholder="${history[index].toX}" onchange="toX=value"/></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number" value="toY" placeholder="${history[index].toY}" onchange="toY=value"/></label><br/>
                        <label for="colorL">Color<input id="colorL" type="color" value="color" placeholder="${history[index].color}" onchange="colorL=value"/></label><br/>
                        </form>`;
};

let getEllipseEditor = function (index) {
    return `<form id="info">
                        <label for="x">x coord<input id="x" type="number" value="x" placeholder="${history[index].x}" onchange="x=value"/></label><br/>
                        <label for="y">y coord<input id="y" type="number" value="y" placeholder="${history[index].y}" onchange="y=value"/></label><br/>
                        <label for="toX">toX coord<input id="toX" type="number" value="toX" placeholder="${history[index].toX}" onchange="toX=value"/></label><br/>
                        <label for="toY">toY coord<input id="toY" type="number" value="toY" placeholder="${history[index].toY}" onchange="toY=value"/></label><br/>
                        <label for="colorE">Color<input id="colorE" type="color" value="color" placeholder="${history[index].color}" onchange="colorE=value"/></label><br/>
                        <label for="fill">fill<input id="fill" type="checkbox" value="fill" placeholder="${history[index].width}" onchange="fill=value"/></label><br/>
                        </form>`;
};

let getCircleEditor = function (index) {
    return `<form id="info">
                        <label for="centerX">centerX coord<input id="centerX" type="number" value="centerX" placeholder="${history[index].x}" onchange="centerX=value"/></label><br/>
                        <label for="centerY">centerY coord<input id="centerY" type="number" value="centerY" placeholder="${history[index].y}" onchange="centerY=value"/></label><br/>
                        <label for="radius">radius coord<input id="radius" type="number" value="radius" placeholder="${history[index].toX}" onchange="radius=value"/></label><br/>
                        <label for="colorC">Color<input id="colorC" type="color" value="color" placeholder="${history[index].color}" onchange="colorC=value"/></label><br/>
                        <label for="fill">fill<input id="fill" type="checkbox" value="fill" placeholder="${history[index].width}" onchange="fill=value"/></label><br/>
                        </form>`;
};