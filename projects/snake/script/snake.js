//Empty Object - This will hold the Game!
var SNAKE = {};

//GAME BOARD AND LOGIC
SNAKE.game = (function(){
  var player;
  var food;
  var c;  //context
  var FPS = 12;
  var gameIsPaused = false;

  SNAKE.width = 400;
  SNAKE.height = 400;
  SNAKE.cellSize = 10;
  SNAKE.score = 0;
  SNAKE.direction; 

  //===== FUNCTIONS =====
  //Main Game Loop 
  function gameLoop() {
    update();
    draw();       
    if (player.collided()) {
      gameOver()
      //Restart the game after 1.5 seconds
      setTimeout(function() {
      init();
      }, 1500);
    }
    else {
      //Control FPS of game
      setTimeout(function() {  
        window.requestAnimFrame(gameLoop);
      }, 1000/FPS);
    };
  };

  //Start New Game
  function init() {
    //Set up the canvas
    var $canvas = $('#canvas');
    if ($canvas.length === 0) { 
      $('#container').append('<canvas id="canvas">');
    };
    $canvas = $('#canvas');
    $canvas.attr('width', SNAKE.width);
    $canvas.attr('height', SNAKE.height);
    var canvas = $canvas[0];
    c = canvas.getContext('2d');
    //Initialise variables
    SNAKE.direction = 'right';
    SNAKE.score = 0;
    FPS = 12;   
    //Set the player and food variables
    player = SNAKE.player();
    food = SNAKE.food();
    //Place the food
    food.setFoodPosition();
    //Call the game loop
    window.requestAnimFrame(gameLoop);
  };

  //Update Frame Function
  function update() {    
    keyboardInput();
    
    //Move the player
    player.moveSnake(SNAKE.direction);

    //If player eats the food
    if (player.foodCollision()) {
      //Increase speed and score
      FPS >= 20 ? FPS = FPS : FPS += 0.25;
      SNAKE.score += 1;
      //Increase player size and move food to new position
      player.growSnake(SNAKE.direction);
      food.setFoodPosition();
    };    
  };

  //Player controls
  function keyboardInput() {
    //Prevents page scrolling when user hits buttons.
    //Adapted from http://stackoverflow.com/questions/2020414/how-to-disable-page-scrolling-in-ff-with-arrow-keys
    document.onkeydown = function(e) {
      var k = e.keyCode;
      if(k >= 37 && k <= 40) {
        return false;
      }
      else if (k === 32) {
        return false;
      };
    };

    //Register key strokes and set direction appropriately.
    if (keydown.left && SNAKE.direction != "right" ) {
      SNAKE.direction = "left";
    };

    if (keydown.right && SNAKE.direction != "left" ) {
      SNAKE.direction = "right";
    };

    if (keydown.up && SNAKE.direction != "down" ) {
      SNAKE.direction = "up";
    };

    if (keydown.down && SNAKE.direction != "up" ) {
      SNAKE.direction = "down";
    };

    if (keydown.space) {
      console.log('space');
      // pause game function needs to be built!
    };

  };

  //Draws Game Objects and Background
  function draw() {
    //Clear each frame
    c.clearRect(0, 0, SNAKE.width, SNAKE.height);
    
    //Fill background
    c.fillStyle = "#cde696";
    c.fillRect(0, 0, SNAKE.width, SNAKE.height);
    
    //Draw Game Objects
    player.drawSnake(c);
    food.drawFood(c);

    //Draw Score
    drawScore();
  };

  function drawScore() {
    c.save();
    c.font = 'bold 15px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'left';
    c.fillText('Score: '+SNAKE.score, 10, SNAKE.height-10);
    c.restore();
  };

  //Ends the Game
  function gameOver() {
    c.save();
    c.font = 'bold 30px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'center';
    var center = SNAKE.width / 2;
    c.fillText('Snake?', center, center - 10);
    c.font = 'bold 15px sans-serif';
    c.fillText('Snaaaaaaaaaaaaake!!!', center, center + 15);
    c.restore();
  };

  return {init: init};
})();

//====== PLAYER GAME OBJECT ======
SNAKE.player = function() {

  //Stores the snake's position.  Initialised with the snake in the top-left
  var snakePos = [[9, 4],[8, 4],[7, 4]];
  var nextPos;

  //Draws the snake.
  function drawSnake(c) {
    c.save();
    c.fillStyle = "#7F9E41";
    for (var i = 0; i < snakePos.length; i++) {
      drawSection(c, snakePos[i]);  //Call helper function - draws one section for each length
    };
    c.restore();
  };

  //Helper function - draws one section of the snake.
  function drawSection(c, snakePos) {
    var x = SNAKE.cellSize * snakePos[0];
    var y = SNAKE.cellSize * snakePos[1];
    c.fillRect(x, y, SNAKE.cellSize, SNAKE.cellSize);
  };

  function moveSnake(direction) {
    nextPos = snakePos[0].slice();  //Copy the head of the snake

    switch (direction) {
      case 'left':
        nextPos[0] -= 1;
        break;
      case 'right':
        nextPos[0] += 1;
        break;
      case 'up':
        nextPos[1] -= 1;
        break;
      case 'down':
        nextPos[1] += 1;
        break;
      default:
        break;
    }; 

    snakePos.unshift(nextPos);  //Add nextPos to the head of the array
    snakePos.pop();   //remove the last position (tail of snake)
  };

  //Increase player size by 1 square
  function growSnake(direction) {
    var lastSection = snakePos[snakePos.length-1];
    var xPos = lastSection[0];
    var yPos = lastSection[1];
    if (direction === 'up' || direction === 'down') {
      newSection = [xPos,yPos-1];
    }
    else {
      newSection = [xPos-1,yPos]; 
    };
    snakePos.push(newSection);
  };

  //Detects collision with wall and self
  function collided() {
    //Checks left and right walls
    if (nextPos[0] >= (SNAKE.width / SNAKE.cellSize) || nextPos[0] < 0 ) {
      return true;
    } 
    //Checks top and bottom walls
    else if (nextPos[1] >= (SNAKE.height / SNAKE.cellSize) || nextPos[1] < 0 ) {
      return true;
    }
    //Checks self
    else if (selfCollision()) {
      return true;
    }
    //Returns false if there's no collisions
    else {
      return false;
    };
  };

  //Check if the snake collides with itself
  function selfCollision() {
    //Store collision in variable
    var collided = false;
    for (i=1; i < snakePos.length; i++) {
      if (snakePos[i][0] === nextPos[0] && snakePos[i][1] === nextPos[1]) {
        //Switches to true if it detects a collision
        collided = true;
        SNAKE.direction = '';
      }
    };
    return collided;
  };

  //Detect when player eats food
  function foodCollision() {
    if (nextPos[0] === SNAKE.foodPos[0] && nextPos[1] === SNAKE.foodPos[1] ) {
      return true;
    } else {
      return false;
    };
  }

  return {
    drawSnake: drawSnake,
    moveSnake: moveSnake,
    collided: collided,
    foodCollision: foodCollision,
    growSnake: growSnake
  };
};

//====== FOOD GAME OBJECT ======
SNAKE.food = function() {

  //Sets food at random position
  function setFoodPosition() {
    var xPos = Math.floor((Math.random() * (SNAKE.width / SNAKE.cellSize) ));
    var yPos = Math.floor((Math.random() * (SNAKE.height / SNAKE.cellSize) ));
    SNAKE.foodPos = [xPos,yPos];
  };

  //Make food appear on the board
  function drawFood(c) {
    c.save();
    c.fillStyle = '#475728';
    c.beginPath();
    var radius = SNAKE.cellSize / 2;
    var x = SNAKE.foodPos[0] * SNAKE.cellSize + radius;
    var y = SNAKE.foodPos[1] * SNAKE.cellSize + radius;
    c.arc(x, y, radius, 0, Math.PI * 2, true);
    c.fill();
    c.restore();
  };

  return {drawFood: drawFood,
          setFoodPosition: setFoodPosition
  };
};

//Start the game on Document Ready.
$(document).ready(function(){
  SNAKE.game.init();
});