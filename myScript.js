// Create a card on the webpage
function cardFunction(color) {
    // TODO: Should change to multiple lines
    return '<div class="col-6 col-md-3 center"><div class="card border-0 shadow-sm" style="width:150px;margin: auto;"><div class="square card-img-top" style=background-color:' + color + '></div><div class="card-body"><h5 class="card-title fw-bold">' + color + '</h5><p class="card-text">' + hexToRgb2(color) + '</p></div></div><br></div>'
}

// Convert HEX to RGB, hexToRgb(hex).r to get red
// Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

// Concatenate R, G and B into 1 line
function hexToRgb2(hex) {
    // Reminder: R -> Red, G -> Green, B -> Blue
    return hexToRgb(hex).r + ', ' + hexToRgb(hex).g + ', ' + hexToRgb(hex).b
}

// Convert Hex to HSL, returns as array [h, s, l]
// Source: https://stackoverflow.com/questions/46432335/hex-to-hsl-convert-javascript
function hexToHSL(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
    h = Math.round(360*h);

    let HSL = [h, s, l]
    return HSL;
}

// Convert HSL to Hex, returns hex as #123456
// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Change Hue by huediff of given Hex, returns Hex
// Reminder: HSL -> Hue, Saturation, Lightness
function changeHue(hex, huediff) {

    let tempHSL = hexToHSL(hex)
    tempHSL[0] += huediff

    // shift the value to the range (0,360)
    while (tempHSL < 0) {
        tempHSL[0] += 360
    }
    while (tempHSL > 360) {
        tempHSL[0] -= 360
    }

    return hslToHex(tempHSL[0], tempHSL[1], tempHSL[2])
}

// Load default cards when HTML loads
function defaultCards() {
    let cards = document.getElementById('cards');
    let toadd = cardFunction('#939597') + cardFunction('#F5DF4D') + cardFunction('#0F4C81') + cardFunction('#ff6f61');
    cards.innerHTML = toadd;
}

// Replace cards on HTML with 4 given colors
function addCards(c1, c2, c3, c4) {
    let cards = document.getElementById('cards');
    let toadd = cardFunction(c1) + cardFunction(c2) + cardFunction(c3) + cardFunction(c4);
    cards.innerHTML = toadd;
}

// Get Random Color as #123456
// Source: https://css-tricks.com/snippets/javascript/random-hex-color/
function randomColor() {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
}

// Set Background Color
function setBgColor(color) {
    document.body.style.background = color;
}

// Get New Color: Change main color, Change suggested colors
// This function should be alerted when pressing the FAB
function getNewColor() {

    // get random color
    let newcolor = randomColor()

    // set random color as 
    setBgColor(newcolor)
    setMainColor(newcolor)

    // define the hue shift amount in range [0,360]
    let huediff = 40

    // make 4 hues -2x, -x, x, 2x, where x is huediff
    let hexhues = [changeHue(newcolor,-2*huediff),changeHue(newcolor,-huediff),changeHue(newcolor,huediff),changeHue(newcolor,2*huediff)]
    
    // make card visible on page
    addCards(hexhues[0],hexhues[1],hexhues[2],hexhues[3])

    // set font white/black
    setFontColor(newcolor)
}

// Set Main Color
function setMainColor(color) {
    let maincolor = document.getElementById('maincolor');
    let toadd = '<h1 class="fw-bold">' + color + '</h1><h3>' + hexToRgb2(color) + '</h3>'
    maincolor.innerHTML = toadd;
}

// Set Font Color: white or black font relative to main color
function setFontColor(color){

    let r = hexToRgb(color).r
    let g = hexToRgb(color).g
    let b = hexToRgb(color).b

    // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
    let luminance = (2*r/255+3*g/255+b/255)/6
    if (luminance > 0.5){
        document.body.style.color = '#000000'
        return
    }
    document.body.style.color = '#FFFFFF'
}