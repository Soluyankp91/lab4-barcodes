const { PNG } = require('pngjs/browser');
const { allowedSymbols } = require('./allowedSymbols');

let dataArr;


function decodeImage(imageBuffer) {
    return new Promise((resolve, reject) => {
        new PNG().parse(imageBuffer.buffer, (err, { data: uint8Arr, width }) => {
            dataArr = Array.from(uint8Arr);
        
            dataArr.splice(width * 4);
            //[]
      
        
            dataArr = dataArr.reduce((acc, cur, index, self) => {
              if ((index + 1) % 4 === 0) {
                acc.push({
                  r: self[index - 3],
                  g: self[index - 2],
                  b: self[index - 1],
                  a: self[index],
                });
              }
        
              return acc;
            }, []);
      
            
            resolve(decode());
          });  
    })
}

function decode() {
  let xWidth = countXWidth();
  let res = "";
  let barCodeRevertMap = Array.from(allowedSymbols, ([key, val]) => ({
    [val.barCode]: key,
  })).reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});

  for (
    let i = 0, barsCounter = 0, xWidthCounter = 0, currentSymbolCode = "";
    i < dataArr.length;
    i++
  ) {
    let initialCounter = i;
    while (dataArr[i].a !== 0) {
      i++;
    }

    while (dataArr[i].a !== 255) {
      i++;
    }
    currentSymbolCode += (
      (i - initialCounter - xWidth) / xWidth === 1 ? 0 : 1
    ).toString();
    // (32 - 16 - 8)/ 8 = 1    1 * 8
    barsCounter++;
    i--;
    if (barsCounter === 5) {
      i++;
      res += barCodeRevertMap[currentSymbolCode];
      if (i + xWidth === dataArr.length) {
        break;
      }
      barsCounter = 0;

      while (dataArr[i].a !== 0) {
        i++;
      }

      while (dataArr[i + 1].a !== 255) {
        i++;
      }
      currentSymbolCode = "";
      xWidthCounter++;
    }
  }
  return res.replace('start', '').replace('stop', '').slice(0, -1);
}
function countXWidth() {
  for (let i = 0; i < dataArr.length; i++) {
    while (dataArr[i + 1].a !== 0) {
      i++;
    }
    return i + 1;
  }
}

module.exports = {
    decodeImage
}