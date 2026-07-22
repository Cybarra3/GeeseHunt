// =======================================
// GEESE HUNT
// Part 1 - Game Engine
// =======================================

// -----------------------------
// Screens
// -----------------------------

const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");

// -----------------------------
// Buttons
// -----------------------------

const startButton = document.getElementById("startButton");
const nextLevelButton = document.getElementById("nextLevel");
const playAgainButton = document.getElementById("playAgain");

// -----------------------------
// HUD
// -----------------------------

const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const levelText = document.getElementById("level");
const finalScoreText = document.getElementById("finalScore");
const levelScoreText = document.getElementById("levelScore");

// -----------------------------
// Game Area
// -----------------------------

const gameArea = document.getElementById("gameArea");

// -----------------------------
// Game Variables
// -----------------------------

let score = 0;
let level = 1;
let timeLeft = 30;

let timerInterval = null;
let difficultyInterval = null;
let animationFrame = null;

let geese = [];

let gooseSpeed = 2;
let gooseCount = 2;

// -----------------------------
// Utility
// -----------------------------

function hideAllScreens() {

    titleScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    levelComplete.classList.remove("active");
    gameOver.classList.remove("active");

}

// -----------------------------

function showTitle() {

    hideAllScreens();

    titleScreen.classList.add("active");

}

// -----------------------------

function showGame() {

    hideAllScreens();

    gameScreen.classList.add("active");

}

// -----------------------------

function showGameOver() {

    hideAllScreens();

    gameOver.classList.add("active");

    finalScoreText.textContent = score;

}

// -----------------------------

function showLevelComplete() {

    hideAllScreens();

    levelComplete.classList.add("active");

    levelScoreText.textContent =
        "Score: " + score;

}

// -----------------------------
// Reset Game
// -----------------------------

function resetGame() {

    score = 0;
    timeLeft = 30;
    gooseSpeed = 2;
    gooseCount = 2;

    scoreText.textContent = score;
    timerText.textContent = timeLeft;
    levelText.textContent = level;

    geese.forEach(goose => goose.remove());

    geese = [];

}

// -----------------------------
// Start Game
// -----------------------------

function startGame() {

    resetGame();

    showGame();

    spawnInitialGeese();

    startTimer();

    startDifficulty();

    animationLoop();

}

// -----------------------------
// Timer
// -----------------------------

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft--;

        timerText.textContent = timeLeft;

        if (timeLeft <= 0) {

            endLevel();

        }

    }, 1000);

}

// -----------------------------
// Difficulty
// -----------------------------

function startDifficulty() {

    clearInterval(difficultyInterval);

    difficultyInterval = setInterval(() => {

        gooseSpeed *= 1.3;

        gooseCount *= 2;

        spawnExtraGeese();

    }, 5000);

}

// -----------------------------
// Finish
// -----------------------------

function endLevel() {

    clearInterval(timerInterval);

    clearInterval(difficultyInterval);

    cancelAnimationFrame(animationFrame);

    geese.forEach(goose => goose.remove());

    geese = [];

    if(level < 3){

        showLevelComplete();

    }else{

        showGameOver();

    }

}

// -----------------------------
// Button Events
// -----------------------------

startButton.onclick = () => {

    level = 1;

    startGame();

};

nextLevelButton.onclick = () => {

    level++;

    startGame();

};

playAgainButton.onclick = () => {

    level = 1;

    startGame();

};

// ======================================
// Goose Class
// ======================================

class Goose {

    constructor(){

        this.x=Math.random()*(window.innerWidth-100);
        this.y=80+Math.random()*(window.innerHeight-180);

        this.size=60+Math.random()*25;

        this.speed=gooseSpeed+(Math.random()*2);

        this.dx=Math.random()<0.5?-1:1;
        this.dy=Math.random()<0.5?-1:1;

        this.element=document.createElement("div");

        this.element.className="goose";

        this.element.innerHTML="🪿";

        this.element.style.left=this.x+"px";
        this.element.style.top=this.y+"px";
        this.element.style.fontSize=this.size+"px";

        gameArea.appendChild(this.element);

        this.element.addEventListener("click",(e)=>{

            e.stopPropagation();

            this.destroy();

        });

    }

    update(){

        this.x+=this.dx*this.speed;

        this.y+=this.dy*this.speed;

        if(this.x<0){

            this.dx=1;

        }

        if(this.x>window.innerWidth-this.size){

            this.dx=-1;

        }

        if(this.y<70){

            this.dy=1;

        }

        if(this.y>window.innerHeight-this.size){

            this.dy=-1;

        }

        this.element.style.left=this.x+"px";

        this.element.style.top=this.y+"px";

    }

    destroy(){

        score++;

        scoreText.textContent=score;

        this.element.remove();

        geese=geese.filter(g=>g!==this);

    }

}

// ======================================
// Spawn Initial
// ======================================

function spawnInitialGeese(){

    for(let i=0;i<gooseCount;i++){

        let goose=new Goose();

        geese.push(goose);

    }

}

// ======================================
// Spawn Extra
// ======================================

function spawnExtraGeese(){

    let needed=gooseCount-geese.length;

    for(let i=0;i<needed;i++){

        let goose=new Goose();

        geese.push(goose);

    }

}

// ======================================
// Animation Loop
// ======================================

function animationLoop(){

    geese.forEach(goose=>{

        goose.update();

    });

    animationFrame=requestAnimationFrame(animationLoop);

}

// ======================================
// Resize Support
// ======================================

window.addEventListener("resize",()=>{

    geese.forEach(g=>{

        if(g.x>window.innerWidth-80){

            g.x=window.innerWidth-80;

        }

        if(g.y>window.innerHeight-80){

            g.y=window.innerHeight-80;

        }

    });

});
