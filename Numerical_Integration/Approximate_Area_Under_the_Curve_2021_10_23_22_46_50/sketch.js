var lowerLimit = 1, upperLimit = 3;

// Original variable declaration before having selector button
var deltaX = 0.1;

var zoomScale = 15;

var x = 1; // x = lowerLimit

var rectangleCount = 1;

let sizeSlider;

let colorSlider;

let defaultFunc = 'x';

let mathFuncBox;
let mathFuncUpdateButton;
let mathFunction;

let answerBox;

let lowerLimitBox,
    upperLimitBox;

let updateButton;

let deltaXSel;

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(400, 400);
  
  sizeSlider = createSlider(10, 30, 20, 1); 
  sizeSlider.position(0, height + 75);

  mathFuncBox = createInput(defaultFunc);
  mathFunction = new MathFunc(defaultFunc, upperLimit, lowerLimit);
  mathFunction.getApproxArea(deltaX);

  mathFuncBox.position(10, height + 5);
  
  lowerLimitBox = createInput(lowerLimit);
  upperLimitBox = createInput(upperLimit);
  
  lowerLimitBox.position(210, height);
  lowerLimitBox.size(50, 10);
  
  upperLimitBox.position(270, height);
  upperLimitBox.size(50, 10);
  
  updateButton = createButton("Update");
  updateButton.position(330, height);
  updateButton.mousePressed(updateIntegral);
  
  // Selector for Δx
  deltaXSel = createSelect();
  deltaXSel.position(210, height + 30);
  
  deltaXSel.style('width', '100px');
  deltaXSel.option('(1) Δx = 1', 1);
  deltaXSel.option('(2) Δx = 0.5', 2);
  deltaXSel.option('(3) Δx = 0.1', 3);
  deltaXSel.option('(4) Δx = 0.01', 4);
  
  deltaXSel.value('3');

  // answerBox contains the result
  answerBox = createInput(mathFunction.getApproxArea(deltaX));
  answerBox.position(10, height + 35);
  answerBox.attribute('readonly', true);  // Make the input box non-modifiable
}

function draw() {
  
  background(255); 
  
  // Scale slider
  let sliderVal = sizeSlider.value();
  scale(sliderVal);
  
  // Translates the canvas to the origin of the axes
  translate(width / (2.0 * sliderVal), height / (2 * sliderVal) + 5);
  
  // Draws x-y axes
  axes();
  
  // Switch statement for the deltaX variable
  if (deltaXSel.selected())
  {
    switch(deltaXSel.selected()) 
    {
      case '1':
        deltaX = 1;
        break;
      case '2':
        deltaX = 0.5;
        break;
      case '3':
        deltaX = 0.1;
        break;
      case '4':
        deltaX = 0.01;
        break;
      default:
        deltaX = 0.1;
    }
  }
  
  // Creates different color for function
  noFill();
  stroke(0);
  strokeWeight(2/zoomScale);
  
  drawMathFunc();

  drawIntegral(mathFunction, deltaX, upperLimit, lowerLimit);
  answerBox.value(mathFunction.getApproxArea(deltaX));
}

/**
 * Draws the shape of the selected math function.
 */
function drawMathFunc() {

  beginShape();
  for (var x = -width/zoomScale; x < width/zoomScale; x += 0.1) {
    vertex(x, -mathFunction.evaluateAt(x));
  }
  endShape();
}

/**
 * Creating the x and y axes with ticks
 */
function axes() {
  push();
  stroke(100);

  //Draw the x-axis
  line(-width/zoomScale, 0, width/zoomScale, 0);
  
  // Draw the y-axis
  line(0, -height/zoomScale, 0, height/zoomScale); 
  
  // Draws ticks on positive y-axis
  for (let y = 1; y < height/zoomScale; y++) 
  {
    noStroke();
    stroke(160)
    line(-0.2, -y, 0.2, -y)
  }
  
  // Draws ticks on negative y-axis
  for (let y = -1; y > -height/zoomScale; y--) 
  {
    noStroke();
    stroke(160)
    line(-0.2, -y, 0.2, -y)
  }
  
  // Draws ticks on positive x-axis
  for (let x = 0; x < width/zoomScale; x++) 
  {
    noStroke();
    stroke(160)
    line(x+1, 0.2, x+1, -0.2)
  }
  
  // Draws ticks on the negative x-axis
  for (let x = -1; x > -width/zoomScale; x--) 
  {
    noStroke();
    stroke(160)
    line(x+1, 0.2, x+1, -0.2)
  }
  pop();
  
}

/**
 * Draws the Riemann sum (rectangles).
 * @param {*} mathFunction The math Function.
 * @param {*} deltaX The length of each rectangle.
 * @param {*} upperLimit The upper limit of integration, b.
 * @param {*} lowerLimit The lower limit of integration, a.
 */
function drawIntegral(mathFunction, deltaX, upperLimit, lowerLimit) {
    noFill();
    stroke('rgb(0,200,230)');
    strokeWeight(0.05);

    for (var x = lowerLimit; x < upperLimit; x += deltaX) {
      rect(x, 0, deltaX, -mathFunction.evaluateAt(x));
    }    
}

/**
 * Updates the mathFunction, the limits of integration,
 * and the answer.
 */
function updateIntegral() {

  var a = parseFloat(lowerLimitBox.value(), 10);
  var b = parseFloat(upperLimitBox.value(), 10);
  
  // Will not update canvas if none of these hold
  if (a !== isNaN && b !== isNaN && b > a)
  {
    lowerLimit = a;
    upperLimit = b;
  }
  
  // Checks if the rules are being followed
  if (upperLimitBox.value(isNaN))
  {
    upperLimitBox.value(upperLimit);  
  }
  
  if (lowerLimitBox.value(isNaN))
  {
    lowerLimitBox.value(lowerLimit);
  }
  if (a > b)
  {
    lowerLimitBox.value(lowerLimit); 
  }  

  // If update is clicked with an empty function box
  if (mathFuncBox.value() == "") {
    // Use the defaultFunc
    mathFuncBox.value(defaultFunc);
  } 
  //mathFunction = new MathFunc(mathFuncBox.value(), b, a);
  mathFunction = new MathFunc(mathFuncBox.value(), upperLimit, lowerLimit);

  answerBox.value(mathFunction.getApproxArea(deltaX));
}