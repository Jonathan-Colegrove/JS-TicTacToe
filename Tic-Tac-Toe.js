var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

var myMove = false;

function ai() {
  return $(".pvc").hasClass("player_mode");
}

if (myMove) {
  makeMove();
}

function restartGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  myMove = false;
  updateMove();
}

$(document).ready(function() {
  $(".pvc").addClass('player_mode');

  $("button").click(function() {
    var cell = $(this).attr("id")
    var row = parseInt(cell[1])
    var col = parseInt(cell[2])
    if (!myMove) {
      board[row][col] = false;
      myMove = true;
      updateMove();
      console.log(ai());
      if(ai()){
         makeMove();
      }
    } else if(!ai()){
      board[row][col] = true;
      myMove = false;
      updateMove();
    }
  });

  $("#restart").click(restartGame);

  var addclass = 'player_mode';
  var $cols = $('.choice').click(function(e) {
  $cols.removeClass(addclass);
  $(this).addClass(addclass);
  });
});

function updateMove() {
  updateButtons();

  var winner = getWinner(board);

  if (ai()) {
    $("#winner").text(winner == 1 ? "AI Won!" : winner == 0 ? "You Won!" : winner == -1 ? "Tie!" : "");
    $("#move").text(myMove ? "AI's Move" : "Your Move");
  } else {
    $("#winner").text(winner == 1 ? "Player 2 Won!" : winner == 0 ? "Player 1 Won!" : winner == -1 ? "Tie!" : "");
    $("#move").text(myMove ? "Player 2's Move" : "Player 1's Move");
  }
}

function getWinner(board) {
  // Check if someone won
  vals = [true, false];
  var allNotNull = true;
  for (var k = 0; k < vals.length; k++) {
    var value = vals[k];

    // Check rows, columns, & diagonals
    var diagonalComplete1 = true;
    var diagonalComplete2 = true;
    for (var i = 0; i < 3; i++) {
      if (board[i][i] != value) {
        diagonalComplete1 = false;
      }
      if (board[2 - i][i] != value) {
        diagonalComplete2 = false;
      }
      var rowComplete = true;
      var colComplete = true;
      for (var j = 0; j < 3; j++) {
        if (board[i][j] != value) {
          rowComplete = false;
        }
        if (board[j][i] != value) {
          colComplete = false;
        }
        if (board[i][j] == null) {
          allNotNull = false;
        }
      }
      if (rowComplete || colComplete) {
        return value ? 1 : 0;
      }
    }
    if (diagonalComplete1 || diagonalComplete2) {
        return value ? 1 : 0;
    }
  }
  if (allNotNull) {
    return -1;
  }
  return null;
}

function updateButtons() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        $("#c" + i + "" + j).text(board[i][j] == false ? "x" : board[i][j] == true ? "o" : "");
    }
  }
}

function makeMove() {
  board = minimaxMove(board);
  console.log(numNodes);
  myMove = false;
  updateMove();
}

function minimaxMove(board) {
  numNodes = 0;
  return recurseMinimax(board, true)[1];
}

var numNodes = 0;

function recurseMinimax(board, player) {
  numNodes++;
  var winner = getWinner(board);
  if (winner != null) {
    switch(winner) {
        case 1:
            // AI wins
            return [1, board]
        case 0:
            // Opponent wins
            return [-1, board]
        case -1:
            // Tie
            return [0, board];
    }
  } else {
    // Next states
    var nextVal = null;
    var nextBoard = null;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] == null) {
          board[i][j] = player;
          var value = recurseMinimax(board, !player)[0];
          if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
            nextBoard = board.map(function(arr) {
              return arr.slice();
            });
            nextVal = value;
          }
          board[i][j] = null;
        }
      }
    }
    return [nextVal, nextBoard];
  }
}

updateMove();
