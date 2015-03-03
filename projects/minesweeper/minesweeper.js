var ms = {
  //Starts the game
  playGame    :   function() {
    ms.createBoard();
  },

  createBoard   :   function() {
    var gameBoard = document.createElement("table"),
      boardSize = 10,  //Sets size of play area and number of bombs!
      i, j,
      row,
      cell,
      cellID = 0;  //Allows us to tag each cell with a unique ID

    //Create the game board...
    for (i = 0; i < boardSize; i++) {
      row = document.createElement("tr");
      gameBoard.appendChild(row);
      for (j = 0; j < boardSize; j++) {
        cell = document.createElement("td");
        cell.setAttribute("class", "cell-unclicked");
        cell.setAttribute("id", cellID);
        row.appendChild(cell);
        cellID += 1;
      };
    };
    gameBoard.setAttribute("id", "gameboard");
    //Insert game board into HTML document
    $("#minesweeper").append(gameBoard);

    //Create Bombs - number of bombs is equal to slightly more than the length of one side of the game board.
    for (i = 0; i < boardSize; i ++) {
      ms.createBombs(boardSize, gameBoard);   
    };

    //Adds the correct numbers into adjacents tiles
    ms.generateAdjacentNumbers(boardSize, gameBoard);

    //Preload images
    ms.preload(["img/bomb_small.png", "img/skull.png"]);

    //Listen for Click Events
    ms.clickEvents(boardSize, gameBoard);
  },

  createBombs   :   function(boardSize, gameBoard) {
    var random = Math.floor(Math.random() * (boardSize*boardSize));
    var cell = $(gameBoard).find('#'+random);
    
    // Prevent double-tagging. Makes sure we have the right number of bombs.
    while (cell.hasClass('cell-bomb')) {
      random >= 99 ? random = 0 : random = random;
      cell = $(gameBoard).find('#'+random++);
    };

    cell.addClass('cell-bomb');
  },

  //Adds numbers to all nodes adjacent to bombs
  generateAdjacentNumbers     :   function(boardSize, gameBoard) {
    var bombLocations = [];
    //Create an index of where the bombs are located on the board.
    for (var i = 0; i < (boardSize*boardSize); i++) {
      currentTile = $(gameBoard).find('#'+i);

      if (currentTile.hasClass('cell-bomb')) {
        bombLocations.push(parseInt(currentTile.attr('id')));
      };
    };

    //Find all tiles adjacent to the bomb locations. Each bomb's adjacent tiles get stored in their own array.
    var adjacentTiles = ms.findAjacentTiles(boardSize, bombLocations);

    //Generates the adjacent tile numbers from the found adjacent tiles.
    for (i = 0; i < adjacentTiles.length; i++) {
      adjacentTiles[i].forEach(function(tile) {
        //Assign each unique ID to the node variable
        node = $('#'+tile);
        //Don't assign a number to bombs!
        if (!$(node).hasClass('cell-bomb')) {
          //Empty nodes are given a value of 1. Non-empty nodes have their value incremented by 1.
          if (node.text() === '') {
            node.text('1');
          } else { 
            newNum = parseInt(node.text());
            newNum += 1;
            node.text(newNum);
          }         
        }
      });   
    }
  },

  //'Sweep Clearing' - Recursive Flood-Fill algorithm!
  //Triggered when a user clicks an empty tile.  Will clear all adjacent zero-value tiles too.
  clearZeroTiles    :   function(tile, boardSize) {
    var tileID = parseInt(tile.attr('id'));
    var adjacentTiles = ms.findAjacentTiles(boardSize, [tileID]);
    var tileSet = [];

    //Only runs if we are operating on a valid tile.  Prevents stack freakouts.
    if (ms.tileCanBeCleared(tile, tileID, boardSize)) {
      //clear the tile
      $(tile).attr('class', 'cell-clear');
      
      //Make an array of all the adjacent tiles
      for (i = 0; i < adjacentTiles.length; i++) {
        adjacentTiles[i].forEach(function(val){
          tileSet.push(($('#'+val)));
        });
      };

      //Iterate through the array of adjacent tiles.
      //Recursively clear all adjacent tiles to that one too!     
      tileSet.forEach(function(val){
        ms.clearZeroTiles(val, boardSize);
      });
    }
  },

  //Helper function. Returns arrays of IDs of all the tiles adjacent to a given set of input tiles.
  findAjacentTiles  : function(boardSize, tileLocation) {
    var allTiles = []
    
    for (var i = 0; i < tileLocation.length; i++) {
      //Get ID for node
      tileID = tileLocation[i];
      //Empty array will hold adjacent tiles
      adjacentTiles = [];

      //Bomb is on Left margin
      if ( (tileID % boardSize) === 0 ){
        adjacentTiles.push( (tileID - boardSize), (tileID - boardSize + 1), (tileID + 1), (tileID + boardSize), (tileID + boardSize + 1));
      }
      //Bomb is on Right margin
      else if ( ((tileID+1) % boardSize) === 0 ){
        adjacentTiles.push( (tileID - boardSize - 1), (tileID - boardSize), (tileID - 1), (tileID + boardSize -1), (tileID + boardSize) ); 
      }
      //Bomb is on Top margin
      else if ( tileID < boardSize ){
        adjacentTiles.push( (tileID - 1), (tileID + 1), (tileID + boardSize -1), (tileID + boardSize), (tileID + boardSize + 1) ); 
      }
      //Bomb is on Bottom margin
      else if ( tileID >= ((boardSize*boardSize)-boardSize) ){
        adjacentTiles.push( (tileID - boardSize + 1), (tileID - boardSize), (tileID - boardSize + 1), (tileID - 1), (tileID + 1) );
      }
      //Bomb is in center - add bombs all around node.
      else {
        adjacentTiles.push( (tileID - boardSize - 1), (tileID - boardSize), (tileID - boardSize + 1), (tileID - 1), (tileID + 1), (tileID + boardSize -1), (tileID + boardSize), (tileID + boardSize + 1) );
      }
    
      //All a single tiles adjacents get stored in an array and pushed to allTiles.
      allTiles.push(adjacentTiles);
    };
    
    //Return adjacents for all input tiles.
    return allTiles;
  },


  //Checks if a tile can be cleared by the 'sweeper' clearZeroTiles algorithm.
  tileCanBeCleared    :    function(tile, tileID, boardSize) {
    if ( tile.text() === '' && tile.hasClass('cell-unclicked') && (!tile.find('img').length > 0) && !tile.hasClass('cell-bomb') ) {
      return true;
    }
    else {
      return false;
    }
  },

  //Ends the game
  gameOver    :   function() {
    $('#gameboard').remove();
    ms.playGame();
  },

  //Allows games of variable sizes.  UI needs to be implemented.
  customGameSize  :   function(boardSize) {
    input = parseInt(prompt('Please enter a number between 8 and 15'));
      if (input > 15) { 
        input = 15; 
      }
      else if (input < 8) { 
        input = 8 
      };
    return input;
  },

  //Pre-load images
  preload     :   function(arrayOfImages) {
    $(arrayOfImages).each(function(){
      $('<img/>')[0].src = this;
    });
  },

  clickEvents   :   function(boardSize, gameBoard) {

    $('.cell-unclicked').mousedown(function(event){

      //Win Conditions
      if ($('.cell-clear').length === ( ((boardSize*boardSize)-1)-boardSize) ){
        setTimeout(function() {
          alert('You Cleared the Bombs!');
          setTimeout(function() {
            ms.gameOver();
          }, 100);
        }, 200);
      };

      //Left Click / Right Click Conditions
      switch (event.which) {
        //Left Click
        case 1:
          //If this has the 'bomb' class then blow up, game over.
          if ($(this).hasClass('cell-bomb')) {
            $('.cell-bomb').attr('class', 'explode');
            $('.cell-bomb').removeAttr('class', 'cell-bomb');
            $('.explode').find('img').remove();
            $('.explode').append('<img src="img/bomb_small.png">');
            setTimeout(function() {
              alert('You Blew Up!');
              setTimeout(function() {
                ms.gameOver();
              }, 100);
            }, 400);    
          }
          //If it's clear, and has no number, open the board up.
          else if ($(this).text() === '') {
            $(this).find('img').remove();  //In case this square has been flagged
            ms.clearZeroTiles($(this), boardSize);
          } 
          //Or just show the number underneath! 
          else {
            $(this).find('img').remove();
            $(this).attr('class', 'cell-clear');
          };
          break;
        
        //Right Click
        case 3:
          if ($(this).hasClass('cell-unclicked')) {
            if ($(this).hasClass('marked')) {
              $(this).removeClass('marked');
              $(this).addClass('unmarked');
              $(this).find('img').remove();
            }
            else {
              $(this).removeClass('unmarked');
              $(this).addClass('marked');
              $(this).append('<img src="img/skull.png">');
            };
          };
          break;
        
        default:
          break;
      };
    });

    //Board Size Button
    $('#button-default').click(function(){
      ms.gameOver();
    });   
  }
};

//Game starts on Document Ready
$(function() {
  //Play the game
  ms.playGame();
});
