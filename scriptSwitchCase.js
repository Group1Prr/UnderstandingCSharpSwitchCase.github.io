const hangmanVid = document.querySelector(".hangman-box video");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const scorePoints = document.querySelector(".score-points h4");
const loadingVideo = document.getElementById("loadingVideo");
const loadingSound = document.getElementById("loadingSound");

document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const contentContainer = document.getElementById("content-container");
    const loadingBar = document.getElementById("loading-bar");
    const loadingSound = document.getElementById("loadingSound");

    const totalTime = 6500;
    const interval = 20;
    const increment = (interval / totalTime) * 100;

    let currentWidth = 0;

    // Play the loading sound
    loadingSound.play();

    const loadingInterval = setInterval(function () {
        currentWidth += increment;
        loadingBar.style.width = currentWidth + "%";

        if (currentWidth >= 100) {
            clearInterval(loadingInterval);
            loadingScreen.style.opacity = 0;
            setTimeout(function () {
                loadingScreen.style.display = "none";
                contentContainer.style.display = "block";
            }, 500);

            // Stop the loading sound
            loadingSound.pause();
            loadingSound.currentTime = 0;
        }
    }, interval);
});


let currentWord, correctLetters = [], wrongGuessCount = 0, score = 0;
const maxGuess = 6;
let currentWordIndex = 0; // Variable to keep track of the current word index

const resetGame = () => {
    const victorySound = document.getElementById("victorySound");
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanVid.src = `hangman/hangman-${wrongGuessCount}.mp4`;
    guessesText.innerText =`${wrongGuessCount} / ${maxGuess}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
    victorySound.pause();
    victorySound.currentTime = 0;
    defeatSound.pause();
    defeatSound.currentTime = 0;

    scorePoints.innerText = `Score: ${score}/${wordList.length}`;

   
};

const wordList = [
    {
        word: "case",
        hint: "The value of the expression in switch is compared with the values of each ____"
    },
    
    {
        word: "break",
        hint: "When C# reaches a _____ keyword, it breaks out of the switch block."
    },
    
    {
        word: "default",
        hint: "The _______ keyword is optional and specifies some code to run if there is no case match."
    },
    
    {
        word: "switch",
        hint: "This statement allows us to execute one code block among many alternatives."
    },
    
    {
        word: "expression",
        hint: "Is evaluated once and compared with the values of each case label."
    },
    
    {
        word: "break",
        hint: "It is used to jump out of a switch statement."
    },
    
    {
        word: "square",
        hint: "To declare an array, define the variable type with _____ brackets."
    },
    
    {
        word: "array",
        hint: "Are used to store multiple values in a single variable, instead of declaring separate variables for each value."
    }
    
];

const getNextWord = () => {
    const { word, hint, number } = wordList[currentWordIndex];

    // Check if all words are answered before updating the index
    if (score === wordList.length) {
        playAgainBtn.disabled = true; // Disable the "Play Again" button when all words are answered
    }

    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
    currentWordIndex = (currentWordIndex + 1) % wordList.length; // Increment index or loop back to the beginning

    console.log("Current Question Number: " + number); // Log the current question number (optional)
};
const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `Congratulations you guessed the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!!!' : 'Game Over!'}`;
        
        // Check if all words are answered
        if (score === wordList.length) {
            gameModal.querySelector("p").innerText = `You scored ${score}/${wordList.length}`;
            playAgainBtn.innerText = 'Go To Next Lesson'; // Change the text of the "Play Again" button
        } else {
            gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}<b>`;
        }

        const victorySound = document.getElementById("victorySound");
        const defeatSound = document.getElementById("defeatSound");

        if (isVictory) {
            victorySound.loop = true;
            victorySound.play();
        } else {
            defeatSound.loop = true;
            defeatSound.play();
        }

        gameModal.classList.add("show");

        // Display different messages based on the score
        let scoreMessage = "";
        if (score < 4) {
            scoreMessage = "You did not perform well but it's okay.";
        } else if (score >= 4 && score <= 7) {
            scoreMessage = "Good job!";
        } else if (score >= 8 && score <= 9) {
            scoreMessage = "You did great!";
        } else if (score === 10) {
            scoreMessage = "PERFECT! YOU'RE A GENIUS";
        }

    }, 300);
};

const click = document.getElementById("click");

const initGame = (button, clickedLetter) => {
    click.currentTime = 1.5;
    click.play();
    click.volume = 0.5;
    
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {

                correctLetters.push(letter);
                click.currentTime = 0.2;
                click.play();
                click.volume = 0.5;
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        // If it's the last word (number 10), play the victory animation even if the answer is wrong
        if (currentWordIndex === wordList.length - 1) {
            score++; // Increase the score when a word is guessed correctly
            scorePoints.innerText = `${score}/${wordList.length}`;
            if (score === wordList.length) {
                playAgainBtn.disabled = true; // Disable the "Play Again" button when all words are answered
            }
            gameOver(true);
        } else {
            wrongGuessCount++;    
            hangmanVideo.src = `hangman/hangman-${wrongGuessCount}.mp4`; 
        }
    }

    button.disabled = true;
    guessesText.innerText =`${wrongGuessCount} / ${maxGuess}`;

    if(wrongGuessCount === maxGuess) return gameOver(false);
    if (correctLetters.length === currentWord.length) {
        score++; // Increase the score when a word is guessed correctly
        scorePoints.innerText = `${score}/${wordList.length}`;
        if (score === wordList.length) {
            playAgainBtn.disabled = true; // Disable the "Play Again" button when all words are answered
        }
        gameOver(true);
    }
};


for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

const additionalButtons = [" ", "-"];
additionalButtons.forEach(char => {
    const button = document.createElement("button");
    button.innerText = char;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, char));
});


getNextWord();
playAgainBtn.addEventListener("click", getNextWord);

