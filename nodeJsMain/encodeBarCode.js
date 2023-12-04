const { DOMImplementation, XMLSerializer } = require('xmldom');
const { convert } = require('convert-svg-to-png');
const { allowedSymbols } = require('./allowedSymbols');

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);

const delimiterCounter = 3;
const proportion = 3;
const barsCountInSymbol = 6;
const containerWidth = 1000;
let validationRegEx = /^[0-9klmoKLMO]+$/;
async function generateBarCode(currentInputValue, width) {
    currentContainerWidth = width;
    if(!validationRegEx.test(currentInputValue)) {
        throw ({ message: 'Value is not valid', statusCode: 400});
    } 
    convertInputValueToBarCode(currentInputValue);
    calculateConUnits();
    calculateXWidth();
    return await convert(generateSvg());
}

function convertInputValueToBarCode(currentInputValue) {
    let barCodeValues = [];
    currentBarCode = [
    allowedSymbols.get("start").barCode,
    allowedSymbols.get("stop").barCode,
    ];
    let even = false;
    for (let char of currentInputValue) {
    let tryParse = parseInt(char);
    let str = !isNaN(tryParse) ? tryParse : char.toUpperCase();
    let symbol = allowedSymbols.get(str);

    currentBarCode.splice(currentBarCode.length - 1, 0, symbol.barCode);

    barCodeValues.push(even ? symbol.val * 2 : symbol.val);
    even = !even;
    }
    if (currentBarCode.length < 3) {
    return;
    }
    let C =
    10 -
    (barCodeValues
        .reduce((acc, curr) => {
        let strNumber = curr.toString();
        if (strNumber.length === 1) {
            acc.push(curr);
            return acc;
        }

        for (let key of strNumber) {
            acc.push(parseInt(key));
        }
        return acc;
        }, [])
        .reduce((acc, curr) => acc + curr, 0) %
        10);
    console.log("значение контрольного символа", C);

    currentBarCode.splice(
    currentBarCode.length - 1,
    0,
    Array.from(allowedSymbols, ([key, val]) => val).find((i) => i.val === C)
        .barCode
    );
}
function calculateConUnits() {
    currentGenConUnits = 0;
    let countTillNextSymbol = 4;
    let nextSymbolCounter = 0;

    let barCodesArr = Object.entries(currentBarCode.join(""));
    for (let [index, item] of barCodesArr) {
    currentGenConUnits += parseInt(item) ? proportion : 1;
    if (nextSymbolCounter === countTillNextSymbol) {
        currentGenConUnits += barsCountInSymbol; //bars

        if (index != barCodesArr.length - 1) {
        currentGenConUnits += delimiterCounter; //delimiter
        }
        nextSymbolCounter = 0;
        continue;
    }
    nextSymbolCounter++;
    }
}
function generateSvg() {
    let svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    svgElement.setAttribute("width", `${currentGenConUnits * xWidth}`);
    svgElement.setAttribute("height", "200px");

    let additionalX = 0;
    let barCounter = 0;

    for (let [index, cell] of Object.entries(currentBarCode.join(""))) {
    let intCell = parseInt(cell);
    let intIndex = parseInt(index);
    let rect = createRect();

    rect.setAttribute("x", intIndex + additionalX);
    svgElement.appendChild(rect);

    if (barCounter === 4) {
        let rect = createRect();
        additionalX += (intCell ? proportion + 1 : 2) * xWidth;

        rect.setAttribute("x", intIndex + additionalX);
        svgElement.appendChild(rect);

        additionalX += (delimiterCounter + 1) * xWidth - 1; // - 1 because first coor include bar
        barCounter = 0;
        continue;
    }
    if (intCell) {
        additionalX += (proportion + 1) * xWidth - 1; // - 1 because first coor include bar
    } else {
        additionalX += 2 * xWidth - 1; // - 1 because first coor include bar
    }

    barCounter++;
    }
    return xmlSerializer.serializeToString(svgElement);
}

function createRect() {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", `${xWidth}px`);
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "black");
    return rect;
}

function calculateXWidth() {
    xWidth = Math.floor(currentContainerWidth / currentGenConUnits);
    if (xWidth <= 0) {
    console.log(xWidth, "xWidth");
    currentContainerWidth *= 2;
    calculateXWidth();
    }
}


module.exports = {
    generateBarCode
}