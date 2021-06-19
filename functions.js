const playerFactory = (name, sign) => {
    let _name = name;
    let _sign = sign;
    return { name, sign };
}; //create playerObj and computerObj with factory

//Gameboard object (module)
//Array to hold values. Change the values of the array to X or O.

const gameBoard = (() => {
    // 3x3 grid
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const _board = new Array(9);

    const emptyBoard = () => {
        _board.fill(null);
    }

    const checkEmptySlot = (position) => {
        return _board[position]===null ? true : false;
        //if empty(null) return true, otherwise false;
    }

    const addToBoard = (index, sign) => {
        if(checkEmptySlot(index)){
            _board[index]=sign;
        }
    }

    const checkWin = () => {
        //  _board[0] = 'X'; //test cases 
        //  _board[3] = 'X';
        //  _board[6] = 'X';

        //verticals (0,3,6), (1,4,7), (2,5,8)
        const checkVerticals = () => {
            for (let i = 0; i <=2 ; i++){
                if(_board[i] && _board[i]===_board[i+3] && _board[i]===_board[i+6]){
                    //three nulls/undefined is not a win
                    return true;              
                }
            }
            return false;
        }
        //horizontals (0,1,2), (3,4,5), (6,7,8)
        const checkHorizontals = () => {
            for (let i = 0; i <=6 ; i+=3){
                if(_board[i] && _board[i]===_board[i+1] && _board[i]===_board[i+2]){
                    return true;              
                }
            }
            return false;      
        }
        //diagonals (0,4,8), (2,4,6);
        const checkDiagonals = () => {
            for (let i = 0; i<=2; i+=2){
                if(i===0){
                    if(_board[i] && _board[i]===_board[i+4] && _board[i]===_board[i+8]){
                        return true;
                    }
                }
                else if(i===2){
                    if(_board[i] && _board[i]===_board[i+2] && _board[i]===_board[i+4]){
                        return true;
                    }
                }
            }
            return false;
        }
        return checkVerticals() || checkHorizontals() || checkDiagonals();
    }

    const checkDraw = () => {
        return _board.indexOf(null)===-1 ? true : false;
    } //assumes board is nulled, no more empty(null) in arr = draw

    return { emptyBoard, addToBoard, checkEmptySlot, checkWin, checkDraw };
})();

//displayController (module)
//Deals with the input, buttons, forms and textboxes that pop up
//Change the CSS when an X or O is present in the array
//3x3 grid, items will be either 'X' or 'O'

const displayController = ((currentSign) => {
    const form = document.querySelector('.name');
    const replay = document.querySelector('#replay');
    const signBtn = document.querySelector('.signbtn');
    const textBox = document.querySelector('.textbox');

    const matchNode = (index) => {
        return document.getElementById('slot' + index);
    }

    const updateBoard = (node, currentSign) => {
        node.textContent = currentSign;
    }

    const resetBoard = () => {
        const gridItem = document.querySelectorAll('.div-item');
        gridItem.forEach((node) => node.textContent="");
    }

    const toggleDisplayElem = (str) => {
        let node;
        switch(str) {
            case 'form':
                node = form;  
                break;
            case 'replay':
                node = replay;  
                break;
            case 'signbtn':
                node = signBtn;
                break;
            case 'textbox':
                node = textBox; 
                break;
            default:
                alert("ERROR");
                return;
        }
        if (node.style.display === "none"){
            node.style.display = "flex";
        }
        else {
            node.style.display = "none";
        }
    }

    const formHandler = (event) => {
        event.preventDefault(); //prevent page refresh
        toggleDisplayElem('form'); //toggle name input form off
        form.removeEventListener('submit', formHandler);
        toggleDisplayElem('signbtn');
    }

    const replayHandler = () => {
        toggleDisplayElem('replay');
        resetBoard();
        textUpdate('empty', null, null);
        gameFlow.resetMoveCount();
        gameFlow.playGame(gameFlow.randomStarter());
    }

    const signBtnHandler = (event) => {
        let userArr = gameFlow.assignSigns(event.target.textContent); //assign player clicked sign, assign CPU opposite
        toggleDisplayElem('signbtn');
        signBtn.removeEventListener('submit', signBtnHandler); //toggle off, remove event

        let starter = gameFlow.randomStarter();

        toggleDisplayElem('textbox');
        textUpdate('start', userArr, starter);

        setTimeout(() => {
            gameFlow.playGame(starter);
        }, 4000);
    }

    const textUpdate = (command, userArr, currentPlayer) => {
        switch(command) {
            case 'start':
                let player = userArr[0];
                let computerSign = userArr[1].sign;
                textBox.textContent = player.name + " has chosen: '" + player.sign + "'. Computer will be assigned: '" + computerSign + "'.";
                setTimeout(() => {
                    textBox.textContent = currentPlayer.name + " has been randomly selected to start first.";
                }, 1500);
                break;
            case 'player':
                textBox.textContent = "Make your move, " + currentPlayer.name + ".";
                break;
            case 'computer':
                textBox.textContent = "Computer move. Please hold.";
                break;
            case 'victory':
                textBox.textContent = "You have won. Congratulations!";
                break;
            case 'defeat':
                textBox.textContent = "The computer is victorious, better luck next time.";
                break;
            case 'draw':
                textBox.textContent = "It's a draw!";
                break;
            case 'empty':
                textBox.textContent = "";
                break;
            default:
                alert("ERROR, should never print this");
                return;
        }
    }

    form.addEventListener('submit', formHandler); //disable after input
    signBtn.addEventListener('click', signBtnHandler); //disable after input
    replay.addEventListener('click', replayHandler); //do not disable

    return { matchNode, updateBoard, toggleDisplayElem, textUpdate };
})();

//Gameflow 
//Logic
//User inputs his name. Clicks submit button. 
//Button press hides form. Save input. Do not refresh page
//User X or O button. Computer will be automatically be assigned the other
//Randomly assign either the computer or the player to start first
//Set delay when computer moves to change textbox message to be visible.
// --> extra: if this is not the first game, let the winning player start first
//First move will commence
//Check for move validity 
//Check win condition
//The user that did not go first will choose a move
//check for move validity
//Recheck win condition
//second move commence, recheck, third move, recheck, etc
//Win condition satisified
//display message for winner
//--> extra: Create a button to play again

const gameFlow = (() => {
    const gridItem = document.querySelectorAll('.div-item');
    let _player;
    let _computer;
    let _userArr;
    let _moveCount = 0;
    
    const assignSigns = (sign) => {
        const playerNameInput = document.getElementById('playername');
        _player = playerFactory(playerNameInput.value, sign);
        let computerSign;
        if (sign==='X'){
            computerSign = 'O';
        }
        else {
            computerSign = 'X';
        }
        _computer = playerFactory('Computer', computerSign);
        return _userArr = [_player, _computer];
    }

    const randomStarter = () => {
        let randNum = Math.floor(Math.random() * 2);
        if (randNum===0){
            return _player;
        }
        else {
            return _computer;
        }
    }

    const gridClickHandler = (event) => {
        let clickIndex = event.target.id[event.target.id.length-1];
        
        if(gameBoard.checkEmptySlot(clickIndex)){
            gameBoard.addToBoard(clickIndex, _player.sign);
            displayController.updateBoard(event.target, _player.sign);
            _moveCount++;

            if (gameBoard.checkWin()){
                detectWinnerSign(_player.sign);
                disableClick();
                displayController.toggleDisplayElem('replay');
                return;
            }
    
            if (gameBoard.checkDraw()) {
                displayController.textUpdate('draw', _userArr, _player);
                disableClick();
                displayController.toggleDisplayElem('replay');
                return;
            }
            playGame(_computer);
        }
    }

    const computerPlay = () => {
        let randPosition = Math.floor(Math.random() * 9); //exclusive of 9
        while(!(gameBoard.checkEmptySlot(randPosition))){
            randPosition = Math.floor(Math.random() * 9);
        }
        
        let node = displayController.matchNode(randPosition);
        gameBoard.addToBoard(randPosition, _computer.sign);
        displayController.updateBoard(node, _computer.sign);
        _moveCount++;

        if (gameBoard.checkWin()){
            detectWinnerSign(_computer.sign);
            disableClick();
            displayController.toggleDisplayElem('replay');
            return;
        }

        if (gameBoard.checkDraw()) {
            displayController.textUpdate('draw', _userArr, _computer);
            disableClick();
            displayController.toggleDisplayElem('replay');
            return;
        }
        playGame(_player);
    }
    
    const playGame = (currentPlayer) => {
        if (_moveCount===0){
            gameBoard.emptyBoard();
        }
        if (currentPlayer===_player){
            displayController.textUpdate('player', _userArr, currentPlayer);
            playerMove();
        }
        else if(currentPlayer===_computer){
            displayController.textUpdate('computer', _userArr, currentPlayer);
            setTimeout(() => {
            computerPlay();     
            }, 1500);
        }
    }

    const playerMove = () => {
        gridItem.forEach((node) => node.addEventListener('click', gridClickHandler));
    }

    const disableClick = () => {
        gridItem.forEach((node) => node.removeEventListener('click', gridClickHandler));
    }

    const detectWinnerSign = (currentSign) => {
        if (_player.sign===currentSign){
            displayController.textUpdate('victory', _userArr, _player);
        }
        else {
            displayController.textUpdate('defeat', _userArr, _computer);
        }
    }

    const resetMoveCount = () => {
        _moveCount = 0;
    }

    return { playGame, resetMoveCount, assignSigns, randomStarter };
})();
