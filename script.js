//jatek beallitasok
const settings = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_WIDTH: 80,
    PLAYER_HEIGHT: 15,
    PLAYER_SPEED: 8,//jatekos sebessege
    MAX_MISSES: 5,//maximalis elet
    ITEM_SIZE: 20,
    ITEM_SPEED: 2,//targy sebessege
    SPEED_INCREASE_RATE: 0.01,//sebesseg noveles idokoz   
    SPAWN_RATE: 1500 //targy spawnozas idokoz
    ITEMS: [
        { image: 'batteryy.webp', value: 10 }, //elem
        {}
        {}


    ] //targyak 
};

//dom lekerese
const gameArea = document.getElementById('game-area'); //jatek terulet
const scoreDisplay = document.getElementById('score');//pontszam kijelzo
const missesDisplay = document.getElementById('misses');//elhagyott targyak kijelzo
const messageBox = document.getElementById('message-box'); //uzenet doboz

//jatek allapota
let score = 0;//pontszam
let missedCount = 0;//elrontott targyak szama
let gameActive = false;//jatek fut-e 
let animationFrameId; //animacio frame id
let SpawnIntervalId;//targy spawnozas interval id
let currentItemSpeed = settings.ITEM_SPEED;//jelenlegi targy sebesseg

//laptop objektum
let player = {
    x: (settings.CANVAS_WIDTH - settings.PLAYER_WIDTH) / 2,
    y: settings.CANVAS_HEIGHT - settings.PLAYER_HEIGHT - 10,
    width: settings.PLAYER_WIDTH,
    height: settings.PLAYER_HEIGHT,
    element: null // dom elem hivatkoozása 
};

//targyak tombje (itt tároljuk az aktuálisan leeső elemeket)
let fallingItems = [];

