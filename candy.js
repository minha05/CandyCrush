/**/
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [] /*2D Board Array will hold all the image tags, to access them to crush the candies, to update the image tag on the web page, image source is changed every time the candies are crushed and generate new ones */
var rows = 9;
var columns = 9;
var score = 0;
var turns = 5;

//Timer// 
var timeLeft = 60;
var timer;


//refers to the candy currently  being clicked to drag
var currTile;
//candy that gets dropped on/triying to swap with
var otherTile;

window.onload = function() { /*Calls the function startGame*/
    startGame(); 

    //for every 1/10th of a second it is going to call the crushCandy function
    window.setInterval(function(){
       crushCandy();
       slideCandy();
       generateCandy();
    }, 100);

    document.getElementById("restart-button").addEventListener("click", restartGame);

    
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame(){ /*the function will initilaise the board by generating random candies and placing it on #board */

    // Reset time
    timeLeft = 60;
    document.getElementById("timer").innerText = timeLeft;

    // Clear any old timer before starting a new one
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("game-over").style.display = "block";
        }
    }, 1000);

    board =[];
    for (let r= 0; r < rows; r++) {
        let row = []; /*Holds the image tags for the specific row*/
        for (let c = 0; c < columns; c++) {
            // img id corresponds to the coordinates of the 2D array, allows us to locate the img tag within the board
            // <img id="0-0">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";


            //Drag Functionality - multi step process
            tile.addEventListener("dragstart", dragStart); //candy is clicked, this function starts the drag process
            tile.addEventListener("dragover", dragOver); // clicking on candt, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy, just before they touch
            tile.addEventListener("dragleave", dragLeave); //stop clicking, and leave the image
            tile.addEventListener("drop", dragDrop); //dropping the candy over the other candy and letting it go
            tile.addEventListener("dragend", dragEnd); //after drag completed, candies swap

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

//Defining the functions
function dragStart() {
    // this refers to the candy clicked on to be dragged, it is saved in into currTile
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //refers to the candy that it was dropped on
    otherTile = this;
}

function dragEnd() { // check for Adjacency  
    //stops players from making more moves when turns is 0
    if (turns <= 0) {
        return;
    }
    //when drag ends, make sure that the tiel and other tile selected neither of them are blank
    //makes sure we dont swap a candy with a blank tile
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    
    }

    //rows and columns for current candy
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    //rows and columns for other candy
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // check for Adjacency 
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c ==c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    currTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = checkValid();

    if (validMove) {
        // Valid move: use up turn
        turns -= 1;
        document.getElementById("turns").innerText = turns;

        if (turns === 0) {
            document.getElementById("game-over").style.display = "block";
        }
    } else {
        // Invalid move, swap back
        currTile.src = currImg;
        otherTile.src = otherImg;
    }
}

}



//crushing the candy, 3 in a row
function crushCandy() {
    //crushFive()
    
function getColorFromSrc(src) {
    let filename = src.split("/").pop(); // Get "Red.png" or "Red-Striped-Horizontal.png"
    return filename.split("-")[0].split(".")[0]; // Return "Red"
}


    function crushFour() {
    // Horizontal Match of 4

    function addDragListeners(tile) {
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("dragenter", dragEnter);
    tile.addEventListener("dragleave", dragLeave);
    tile.addEventListener("drop", dragDrop);
    tile.addEventListener("dragend", dragEnd);
    }


    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];

            if (
                !candy1.src.includes("blank") &&
                candy1.src === candy2.src &&
                candy2.src === candy3.src &&
                candy3.src === candy4.src
            ) {
                // Turn one of them into a horizontal striped candy
                let color = getColorFromSrc(candy1.src);
                candy1.src = `./images/${color}-Striped-Horizontal.png`;
                addDragListeners(candy1);

                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";

                score += 40;
            }
        }
    }

    // Vertical Match of 4
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];

            if (
                !candy1.src.includes("blank") &&
                candy1.src === candy2.src &&
                candy2.src === candy3.src &&
                candy3.src === candy4.src
            ) {
                let color = getColorFromSrc(candy1.src);
                candy1.src = `./images/${color}-Striped-Vertical.png`;
                addDragListeners(candy1);

                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";

                score += 40;
            }
        }
    }
}

    crushFour();
    crushThree();
    document.getElementById("score").innerText =score;
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c= 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";

                //update the score by 30
                score +=30;
            }
        }
    }
    
    //check columns
    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";

                candies.forEach(candy => {
                    if (candy.src.includes("Striped-Horizontal")) {
                        clearRow(getCoords(candy).row);
                    } else if (candy.src.includes("Striped-Vertical")) {
                        clearColumn(getCoords(candy).col);
                    } else {
                        candy.src = "./images/blank.png";
                    }
                });

                score +=30;
            }
        }
    }
}

function getCoords(candy) {
    let [r, c] = candy.id.split("-").map(Number);
    return { row: r, col: c };
}

function clearRow(r) {
    for (let c = 0; c < columns; c++) {
        board[r][c].src = "./images/blank.png";
    }
}

function clearColumn(c) {
    for (let r = 0; r < rows; r++) {
        board[r][c].src = "./images/blank.png";
    }
}



function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c= 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

//check columns
for (let c = 0; c < columns; c++){
    for (let r = 0; r < rows-2; r++) {
        let candy1 = board[r][c];
        let candy2 = board[r+1][c];
        let candy3 = board[r+2][c];
        if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
            return true; // found a combination 3 in a row/column that we can crush, instead of crushing them we return true
        }
    }
}
    return false; // if no combination found
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows-1; r >= 0; r--){
            if (!board[r][c].src.includes("blank")){
                board[ind][c].src =board [r][c].src;
                ind -= 1; //move the blank tile up by one
            }
        }

        for (let r = ind; r >= 0; r--){
            board[r][c].src = "./images/blank.png"; // each one is set to a blank tile
        }
    }
}

//generate for the top row only, because it will slide down and generate new candy again.
function generateCandy() {
    for (let c =0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
            addDragListeners(board[0][c]);
        }
    }
}

function restartGame() {
    // Reset score and turns
    score = 0;
    turns = 5;
    document.getElementById("score").innerText = score;
    document.getElementById("turns").innerText = turns;

    // Hide game-over message
    document.getElementById("game-over").style.display = "none";

    // Clear and regenerate the board
    board = [];
    document.getElementById("board").innerHTML = "";
    startGame();
}


