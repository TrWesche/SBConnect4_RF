class BoardGame {
    constructor (name) {
        this.name = name,
        this.scoreKeep = [],
        this.currPlayer,
        this.playerList = [],
        this.board = [],
        this.gameControls = document.getElementById("game-controls"),
        this.htmlBoard = document.getElementById("board"),
        this.enableAnimations = true,
        this.gameInProgress = false
        this.handleQtyPlayers = this.handleQtyPlayers.bind(this);
        this.handlePlayerColor = this.handlePlayerColor.bind(this);
    }

    makeNewGameButton() {
        const newGame = document.createElement("button");
        newGame.setAttribute("id", "new-game");
        newGame.innerText = "New Game";
        newGame.addEventListener("click", this.handleNewGame);

        return newGame;
    }

    makePlayerTracker() {
        const currentPlayer = document.createElement("p");
        currentPlayer.setAttribute("id", "current-player");
        currentPlayer.innerText = "Current Player: ";

        const playerIdentifier = document.createElement("span");
        playerIdentifier.innerText = "1";

        currentPlayer.append(playerIdentifier);

        return currentPlayer;
    }

    makeGameSettings() {
        const gameSettings = document.createElement("div");
        gameSettings.setAttribute("id", "game-settings");

        const enAnimationsText = document.createElement("p");
        enAnimationsText.innerText = "Enable Animations: ";

        const enableAnimations = document.createElement("input");
        enableAnimations.setAttribute("type", "checkbox");
        enableAnimations.setAttribute("checked",this.enableAnimations);
        enableAnimations.addEventListener("change",this.handleToggleAnimations);

        gameSettings.append(enAnimationsText);
        gameSettings.append(enableAnimations);

        return gameSettings;
    }

    makePlayerSettings(minPlayers, maxPlayers) {
        const playerSettings = document.createElement("form");
        playerSettings.setAttribute("id", "player-settings")

        if (minPlayers != maxPlayers) {
            const numPlayersLabel = document.createElement("label");
            numPlayersLabel.setAttribute("for", "num-players");
            numPlayersLabel.innerText = "# Players: "
        
            const numPlayers = document.createElement("input");
            numPlayers.setAttribute("name", "num-players")
            numPlayers.setAttribute("type","range");
            numPlayers.setAttribute("value", minPlayers);
            numPlayers.setAttribute("min", minPlayers);
            numPlayers.setAttribute("max", maxPlayers);
            numPlayers.addEventListener("change", this.handleQtyPlayers);

            playerSettings.append(numPlayersLabel);
            playerSettings.append(numPlayers);
        }

        // TODO: Pull this code into updatePlayerHtml so there is no redundancy/two places to update
        for (let i = 1; i <= minPlayers; i++) {
            const player = document.createElement("div");
            player.classList.add(`player`)
            player.setAttribute("id",`p${i}Settings`);

            const playerName = document.createElement("p");
            playerName.innerText = `Player ${i}`;

            const playerColor = document.createElement("input");
            playerColor.setAttribute("id", `${i-1}-color`);
            playerColor.setAttribute("type", "color");
            playerColor.setAttribute("value", this.playerList[i-1].color);
            playerColor.addEventListener("change",this.handlePlayerColor);

            player.append(playerName);
            player.append(playerColor);

            playerSettings.append(player);
        }

        return playerSettings;
    }

    cleanGameBoard() {
        const oldGameBoard = document.getElementById('board');
        if (oldGameBoard.childNodes.length > 0) {
            for (let child of Array.from(oldGameBoard.childNodes)) {
                child.remove();
            }
        }
    }

    cleanGameControls() {
        const controls = document.getElementById('game-controls');
        if (controls.childNodes.length <= 1) {
            for (let child of Array.from(controls.childNodes)) {
                child.remove();
            }
        }
    }

    createRandPlayer(playerNumber) {
        let red;
        let green;
        let blue;
        
        if (playerNumber === 1 || playerNumber === 4 || playerNumber === 6 || playerNumber === 7) {
            red = "8B";
        } else {
            red = "00";
        }

        if (playerNumber === 3 || playerNumber === 4 || playerNumber === 6 || playerNumber === 7) {
            green = "8B";
        } else {
            green = "00"
        }

        if (playerNumber === 2 || playerNumber >= 5) {
            blue = "8B";
        } else {
            blue = "00";
        }
   
        const player = new Player(playerNumber, `#${red}${green}${blue}` )
        return player
    }

    updatePlayerList(numPlayers) {
        let newPlayerList = [];

        if (numPlayers <= this.playerList.length) {
            for (let i = 0; i < numPlayers; i++) {
                newPlayerList.push(this.playerList[i]);
            }
        } else {
            for (let i = 0; i < this.playerList.length; i++) {
                newPlayerList.push(this.playerList[i]);
            }
            for (let i = this.playerList.length; i < numPlayers; i++) {
                newPlayerList.push(this.createRandPlayer(i+1));
            }
        }

        this.playerList = newPlayerList;
    }

    updatePlayerHtml(numPlayers) {
        const playerSettings = document.getElementById("player-settings");
        const playerDivs = document.querySelectorAll("#player-settings div");
        for (let child of Array.from(playerDivs)) {
            child.remove();
        }

        for (let i = 1; i <= numPlayers; i++) {
            const player = document.createElement("div");
            player.classList.add(`player`)
            player.setAttribute("id",`p${i}Settings`);

            const playerName = document.createElement("p");
            playerName.innerText = `Player ${i}`;

            const playerColor = document.createElement("input");
            playerColor.setAttribute("id", `${i-1}-color`);
            playerColor.setAttribute("type", "color");
            playerColor.setAttribute("value", this.playerList[i-1].color);
            playerColor.addEventListener("change",this.handlePlayerColor);

            player.append(playerName);
            player.append(playerColor);

            playerSettings.append(player);
        }
    }

    handleQtyPlayers(evt) {
        let userConfirmation = false;

        if (this.gameInProgress) {
            userConfirmation = confirm("Changing the number of players will reset your game. \nWould you like to continue?");
        }

        if (userConfirmation) {
            this.handleNewGame();
        } 

        this.updatePlayerList(evt.target.valueAsNumber);
        this.updatePlayerHtml(evt.target.valueAsNumber);
    }

    handlePlayerColor(evt) {
        let userConfirmation = false;

        if (this.gameInProgress) {
            userConfirmation = confirm("Changing the color of players will reset your game. \nWould you like to continue?");
        }

        const playerIndex = Number(evt.srcElement.id[0]);

        if (userConfirmation || !this.gameInProgress) {
            this.playerList[playerIndex].color = evt.srcElement.value;
            this.handleNewGame();
        } else {
            evt.srcElement.value = this.playerList[playerIndex].color;
        }

    }
}

class ConnectFour extends BoardGame {
    constructor (rows, columns) {
        super("Connect Four"),
        this.rows = rows,
        this.columns = columns
        this.handleToggleAnimations = this.handleToggleAnimations.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
    }

    makeBoard() {
        this.board = [];

        const rowArray = []
        for(let i = 0; i < this.columns; i++) {
          rowArray.push(null);
        }
      
        for(let j = 0; j < this.rows; j++){
          const cloneArr = [...rowArray];
          this.board.push(cloneArr);
        }
    }

    makeGameControls(minPlayers, maxPlayers) {        
        this.gameControls.append(this.makeNewGameButton());
        this.gameControls.append(this.makePlayerTracker());
        this.gameControls.append(this.makeGameSettings());
        this.gameControls.append(this.makePlayerSettings(minPlayers,maxPlayers));
    }

    makeHtmlBoard() {
        const table = document.createElement("table");

        const top = document.createElement("tr");
        top.setAttribute("id", "column-top");
        top.addEventListener("click", this.handleClick);
      
        for (let x = 0; x < this.columns; x++) {
          const headCell = document.createElement("td");
          headCell.setAttribute("id", x);
          top.append(headCell);
        }  
        table.append(top);
      

        for (let y = 0; y < this.rows; y++) {
          const row = document.createElement("tr");
          for (let x = 0; x < this.columns; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
          }
          table.append(row);
        }

        this.htmlBoard.append(table);
    }

    findSpotForCol(x) {
        for (let index = this.rows - 1; index >= 0; index--) {
          if(this.board[index][x] === null) {
            return index;
          }
        }
      
        return null;
    }

    dropGamePiece(y, x, div) {
        document.getElementById('column-top').removeEventListener('click', this.handleClick);

        const endElement = document.getElementById(`${y}-${x}`);
        const posEnd = endElement.offsetTop;
        let posTop = 0;
        
        const movePiece = () => {
            posTop += 4;
            if (posTop >= posEnd) {
                div.style.top = posEnd + 'px';
                clearInterval(intervalID);
                document.getElementById('column-top').addEventListener('click', this.handleClick);
                return;
            }
            div.style.top = posTop + 'px';
        }

        const intervalID = setInterval(movePiece, 5);
    }

    placeInTable(y, x) {
        // Create a new div element to insert into the table representing the player's move
        const newDiv = document.createElement('div');
        newDiv.classList.add('piece');
        newDiv.classList.add(`color-p${this.currPlayer.id}`)
      
        // Assign the piece a color depending on which player made the last move
        newDiv.style.backgroundColor = this.currPlayer.color;

        // Set game piece size
        newDiv.style.width = '40px';
        newDiv.style.height = '40px';

        // Determine destination cell
        const destCell = document.getElementById(`${y}-${x}`);

        if (this.enableAnimations) {
            // Initialize starting to top of board
            newDiv.style.top = '0px';
        
            // Append the element into the appropriate table location defined by a string 'yLoc-xLoc' formatted as '0-0' ... 'n-n'
            destCell.append(newDiv);
        
            // Run the drop game piece animation
            this.dropGamePiece(y, x, newDiv);
        } else {
            // Append the element into the appropriate table location defined by a string 'yLoc-xLoc' formatted as '0-0' ... 'n-n'
            destCell.append(newDiv);
        }
    }

    endGame(msg) { 
        document.getElementById('column-top').removeEventListener('click', this.handleClick);
        if (this.enableAnimations) {
            setTimeout(() => alert(msg), 500);
        } else {
            alert(msg);
        }
    }

    switchPlayers() {
        if (this.currPlayer.id >= this.playerList.length) {
            this.currPlayer = this.playerList[0];
        } else {
            this.currPlayer = this.playerList[this.currPlayer.id];
        }

        const playerElement = document.querySelector('#current-player span');
        playerElement.style.backgroundColor = this.currPlayer.color;
        playerElement.innerText = this.currPlayer.id;
    }

    checkForWin() {
        const _win = (cells) => {
          // Check four cells to see if they're all color of current player
          //  - cells: list of four (y, x) cells
          //  - returns true if all are legal coordinates & all match currPlayer
      
            return cells.every(
                ([y, x]) =>
                y >= 0 &&
                y < this.rows &&
                x >= 0 &&
                x < this.columns &&
                // this.board[y][x] === this.currPlayer
                this.board[y][x] === this.currPlayer.id
            );
        }
      
        // Note: The array being iterated over has the indicies [y,x] as follows:
        /*
        [0,0], [0,1], [0,2] ... [0,n]
        [1,0]
        [2,0]
        ...
        [n,0]
        */
      
        for (let y = 0; y < this.rows; y++) {                                              // Starting from [0, 0] in your matrix loop through every possible horizontal, vertical, diagonal down and right, and diagonal down and left combination on the board
            for (let x = 0; x < this.columns; x++) {
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];                   // Create an array consisting of every location starting from your current x & y coordinates progressing horizontally to the right
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];                    // Create an array consisting of every location starting from your current x & y coordinates progressing vertically down
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];      // Create an array consisting of every location starting from your current x & y combining an horizontal motion to the right with a downward vertical motion
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];      // Create an array consisting of every location starting from your current x & y combining an horizontal motion to the left with a downward vertical motion
        
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {            // Call the function above to check that every x & y coordinate is within the allowed range and is the current player.  If all 4 return true for any of the array combinations resulting in a completed game.
                return true;
                }
            }
        }
    }    

    handleToggleAnimations(evt) {
        this.enableAnimations = this.enableAnimations === true ? false : true;
    }

    handleClick(evt) {
        this.gameInProgress = true;

        // get x from ID of clicked cell
        const x = +evt.target.id;
      
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
        
        // place piece in board and add to HTML table
        // this.board[y][x] = this.currPlayer;
        this.board[y][x] = this.currPlayer.id;
        this.placeInTable(y, x);
      
        // check for win
        if (this.checkForWin()) {
        //   return this.endGame(`Player ${this.currPlayer} won!`);
          return this.endGame(`Player ${this.currPlayer.id} won!`);
        }
      
        // check for tie
        if (this.board[0].every(value => value > 0)) {
          return this.endGame(`Game Over - Tie!`);
        }
      
        this.switchPlayers();
    }

    gameInitialize(minPlayers, maxPlayers, ...defaultPlayers) {
        this.gameInProgress = false;

        this.cleanGameControls();
        this.cleanGameBoard();

        this.updatePlayerList(minPlayers);
        this.currPlayer = this.playerList[0];

        this.makeBoard();

        this.makeGameControls(minPlayers, maxPlayers);
        this.makeHtmlBoard();

        const playerElement = document.querySelector('#current-player span');
        playerElement.innerText = this.currPlayer.id;
        playerElement.style.backgroundColor = this.currPlayer.color;
    }

    handleNewGame() {
        this.gameInProgress = false;

        this.cleanGameBoard();

        this.currPlayer = this.playerList[0];
        this.makeBoard();
        this.makeHtmlBoard();
      
        const playerElement = document.querySelector('#current-player span');
        playerElement.innerText = this.currPlayer.id;
        playerElement.style.backgroundColor = this.currPlayer.color;
    }
}


class Player {
    constructor(id, color) {
        this.id = id,
        this.color = color
    }

    chooseColor(color) {
        this.color = color
    }
}

const game = new ConnectFour(6, 7);
game.gameInitialize(2, 4);