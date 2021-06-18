const playerFactory = (name, sign) => {

    // const useInputName = () => {
    //     const submit = document.querySelector('#submit');
    //     submit.addEventListener('click', (event) => {
    //         event.preventDefault();
    //         const input = document.querySelector('#playername');
    //         console.log(input.value);
    //         return input.value;
    //     });
    //

    let _name = name;
    let _sign = sign;

    return { name, sign };
};

//playerObject
//computerObject
//create these with factories
  

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
        //if empty(null) return true, else return false;
    }

    const addToBoard = (position, sign) => {
        if(checkEmptySlot(position)){
            _board[position]=sign;
        }
    }

    const checkWin = () => {
        //  _board[0] = 'X';
        //  _board[3] = 'X';
        //  _board[6] = 'X';
        //test cases 

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
                    //three nulls/undefined is not a win
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
    } //assumes you null the board, no more empty/null indexes = draw

    return { emptyBoard, addToBoard, checkWin, checkDraw, checkEmptySlot, _board};
})();

//displayController (module)
//Deals with the input, buttons and forms that pop up
//Assign the indexes of the array to a CSS grid item
//Change the CSS when an X or O is present in the array
//3x3 grid, items will be either 'X' or 'O'


const displayController = ((currentSign) => {
    const form = document.querySelector('.name');
    const replay = document.querySelector('#replay');
    const signBtn = document.querySelector('.signbtn');
    const textBox = document.querySelector('.textbox');

    const updateDisplay = (node, currentSign) => {
        node.textContent = currentSign;
    }

    const resetDisplay = () => {
        const gridItem = document.querySelectorAll('.div-item');
        gridItem.forEach((node) => node.textContent="");
    }

    const formHandler = (event) => {
        event.preventDefault(); //prevent refresh
        toggleDisplayUnits('form');

        form.removeEventListener('submit', formHandler);
        toggleDisplayUnits('signbtn');
    }

    const toggleDisplayUnits = (str) => {
        let unit;
        if (str==='form'){
            unit = form;
        }
        else if (str==='replay'){
            unit = replay;
        }
        else if (str==='signbtn'){
            unit = signBtn;
        }
        else if (str==='textbox'){
            unit = textBox;
        }
        else {
            console.log("ERROR");
        }
        //console.log(unit);

        if (unit.style.display === "none"){
            unit.style.display = "flex";
        }
        else {
            unit.style.display = "none";
        }
    }

    const replayHandler = () => {
        toggleDisplayUnits('replay');
        resetDisplay();
        textUpdate('');
        gameFlow.resetMoveCount();
        gameFlow.playGame();
    }

    const signBtnHandler = (event) => {
        toggleDisplayUnits('signbtn');
        signBtn.removeEventListener('submit', signBtnHandler);

        gameFlow.firstGame(event.target.textContent);
        toggleDisplayUnits('textbox');
        // let x = gameFlow.pickStarter();
        // console.log(x);
        gameFlow.playGame();
    }

    const textUpdate = (str) => {
        textBox.textContent = str;
    }

    form.addEventListener('submit', formHandler); //add once then disable
    replay.addEventListener('click', replayHandler); //do not disable
    signBtn.addEventListener('click', signBtnHandler); //add once then disable


    return { toggleDisplayUnits, updateDisplay, resetDisplay, textUpdate };
})();

//Gameflow 
//User inputs his name.
//User picks X or O. Computer will be assigned the other
//Randomly assign either the computer or the player to start first
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
    let player;
    let computer = playerFactory('Computer', 'O');
    let moveCount = 0;

    const firstGame = (sign) => {
        const playerNameInput = document.getElementById('playername');
        player = playerFactory(playerNameInput.value, sign);
        let computerSign;
        if (sign==='X'){
            computerSign = 'O';
        }
        else {
            computerSign = 'X';
        }
        computer = playerFactory('Computer', computerSign);
        return;
    }

    const pickStarter = () => {
        let randNum = Math.floor(Math.random() * 2);
        console.log(randNum);
        if (randNum===0){
            return player;
        }
        else {
            return computer;
        }
    }

    const gridClickHandler = (event) => {
        let clickIndex = event.target.id[event.target.id.length-1];
        let currentSign;

        if (moveCount===0){
            gameBoard.emptyBoard();
            currentSign = player.sign;
        }
        else {
            currentSign = assignSign(player.sign);
        }
        
        if(gameBoard.checkEmptySlot(clickIndex)){
            gameBoard.addToBoard(clickIndex, currentSign);
            displayController.updateDisplay(event.target, currentSign);
            moveCount++;
        }

        if (gameBoard.checkWin()){
            detectWinnerSign(currentSign);
            disableClick();
            displayController.toggleDisplayUnits('replay');
        }

        if (gameBoard.checkDraw()) {
            displayController.textUpdate("It's a draw.");
            disableClick();
            displayController.toggleDisplayUnits('replay');
        }
    }
    

    const playGame = () => {
        gridItem.forEach((node) => node.addEventListener('click', gridClickHandler));
    }

    const assignSign = (startingSign) => {
        if (startingSign==='X'){
            if (moveCount % 2 === 0) {
                return 'X';
            }
            else {
                return 'O';
            }
        }
        else {
            if (moveCount % 2 === 0) {
                return 'O';
            }
            else {
                return 'X';
            }
        } 
    }

    const disableClick = () => {
        gridItem.forEach((node) => node.removeEventListener('click', gridClickHandler));
    }

    const detectWinnerSign = (currentSign) => {
        if (player.sign===currentSign){
            displayController.textUpdate("You are victorious!");
        }
        else {
            displayController.textUpdate("The computer is victorious, better luck next time.");
        }
    }

    const resetMoveCount = () => {
        moveCount = 0;
    }



    return { playGame, resetMoveCount, firstGame, pickStarter };
})();





