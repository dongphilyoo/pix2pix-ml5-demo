const SIZE = 256;
let inputImg, inputCanvas, output, statusMsg, pix2pix, randomBtn, clearBtn, transferBtn, currentColor, currentStroke;


function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('input');

  // Set background color
//   background(255, 0, 0);

  // Display initial input image
  inputImg = loadImage('images/seg0.png', drawImage);

  // Selcect output div container
  output = select('#output');
  statusMsg = select('#status');

  // Get the buttons
  currentColor = color(0, 0, 255);
  currentStroke = 17;
  select('#red').mousePressed(() => currentColor = color(255, 0, 0));
  select('#blue').mousePressed(() => currentColor = color(0, 0, 255));
  select('#size').mouseReleased(() => currentStroke = select('#size').value());

  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');
  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function() {
    clearCanvas();
    background(255, 0, 0);
  });

  randomBtn = select('#randomBtn');
  randomBtn.mousePressed(function() {
    let src =['images/seg0.png', 'images/seg1.png', 'images/seg2.png', 'images/seg3.png', 'images/seg4.png', 'images/seg5.png', 'images/seg6.png', 'images/seg7.png', 'images/seg8.png', 'images/seg9.png', 'images/seg10.png', 'images/seg11.png', 'images/seg12.png'];
    let index = int(random(0, 13));
    inputImg = loadImage(src[index], drawImage);
  });


  // Set stroke to black
  stroke(0);
  pixelDensity(1);

  // Create a pix2pix method with a pre-trained model
  pix2pix = ml5.pix2pix('model/humanseg_BtoA.pict', modelLoaded);
}

// Draw on the canvas when mouse is pressed
function draw() {
  if (mouseIsPressed) {
    stroke(currentColor);
    strokeWeight(currentStroke)
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Call transfer function when mouse is released
// function mouseReleased() {
//     transfer();
// }

// A function to be called when the models have loaded
function modelLoaded() {
  // Show 'Model Loaded!' message
  statusMsg.html('Model Loaded!');
  // Call transfer function after the model is loaded
  //transfer();
  // Attach a mousePressed event to the transfer button
  transferBtn.mousePressed(function() {
    transfer();
  });
}

// Draw the input image to the canvas
function drawImage() {
  image(inputImg, 0, 0,SIZE, SIZE);
}

// Clear the canvas
function clearCanvas() {
  background(255);
}

function transfer() {
  // Update status message
  statusMsg.html('Transfering...');

  // Select canvas DOM element
  const canvasElement = select('canvas').elt;

  // Apply pix2pix transformation
  pix2pix.transfer(canvasElement, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result && result.src) {
      statusMsg.html('Done!');
      // Create an image based result
      output.elt.src = result.src;
    }
  });
}
