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
        { emoji: '🔋', text: 'Akkumulátor', value: 10 }, // Akkumulátor, 10 pont
                { emoji: '🖥️', text: 'Kijelző', value: 10 }, // Kijelző, 10 pont
                { emoji: '💾', text: 'SSD', value: 15 }, // SSD, 15 pont
                { emoji: '🔌', text: 'Port Kártya', value: 20 }, // Port kártya, 20 pont
                { emoji: '💡', text: 'RAM', value: 15 } // RAM, 15 pont

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

// jatek inicializalasa
function  createPlayerElement() {
    if (player.element) {
        player.element.remove(); // Eltávolítja a régi elemet, ha létezik
    }
    
    const p = document.createElement('div'); //letrehozzuk a jatekos div elemet
    p.id = 'player';
    p.style.left = `${player.x}px`; // kezdo pozicio
    gameArea.appendChild(p); //hozzaadjuk a jatek terulethez
}

function renderPlayer() {
    if (player.element) {
        // csak  az X poziciot frissitjuk 
        player.element.style.left = `${player.x}px`;
    }
}


// bemenet kezelese (eger)
function setupMouseControls() {
    gameArea.addEventListener('mousemove', (e) => {
        if (!gameActive) return;

        let mouseX = e.pffsetX;//eger X pozicio

        let newX = mouseX - player.width / 2;

        // jatekos pozicio korlatozasa a jatek teruleten belul
        if (newX < 0) {
            newX = 0;
        } 
        
        else if (newX + player.width > settings.CANVAS_WIDTH) {
            newX = settings.CANVAS_WIDTH - player.width;
        }

        player.x = newX;
    
});

}


// az egér vezérlésének beállítása rogton a script betöltése után
setupMouseControls();


// uptate logika

// leeső alkatrészek frissítése es mozgatasa
function updateItems() {
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        const item = fallingItems[i];
        item.y += currentItemSpeed; // mozgatjuk lefele a targyat

        //mozgas frissetese a dom elemben
        item.element.style.top = `${item.y}px`;

        //utkozes ellenorzes
        if (checkCollision(player, item)) {
            score += item.value; //pontszam noveles
            updateScore();//pontszam kijelzo frissitese

            //vizualis visszajelzes
            item.element.style.transition = 'opacity 0.1s';
            item.element.style.opacity = '0';

            //kesleltetes az elem eltavolitasa elott
            setTimeout(() => {
                item.element.remove();//elem eltavolitasa a dombol
            }, 100);
            
            // targy eltavolitasa a tombbol
            fallingItems.splice(i, 1);
        }
        
        else if (item.y > settings.CANVAS_HEIGHT) {
            missedCount++;//elhagyott targyak szamanak noveles  
            updateMissed();//kijelzo frissitese
            
            // targy eltavolitasa a dombol
            item.element.remove();
            fallingItems.splice(i, 1); // torles a tombbol
            checkGameOver();//jatek vege ellenorzes
        }
    }
    // nehezsegi szint noveles
    currentItemSpeed += settings.SPEED_INCREASE_RATE;
}    

//utkozes ellenorzo
function checkCollision(player, item) {
    // player X tengelyenek hatarai
    const playerLeft = player.x;
    const playerRight = player.x + player.width;

    // item X tengelyenek hatarai
    const itemLeft = item.x;
    const itemRight = item.x + settings.ITEM_SIZE;

    // Y tengely: az elem eleri a laptop tetejet
    const itemBottom = item.y + settings.ITEM_SIZE / 2;
    const playerTop = player.y;

    // Y ütközés: az elem alja a laptop magasságán belül van
    const y_collision = itemBottomY >= playerTopY && itemBottomY <= playerTopY + player.height;
    // X ütközés: az elemek vízszintesen fedik egymást
    const x_collision = itemRight >= playerLeft && itemLeft <= playerRight; 

    // akkor van ütközés, ha mindkét tengelyen fedik egymást
    return x_collision && y_collision;
}

// uj alkatresz letrehozasa
function spawnItem() {
    //veletlenszeru alkatresz kivalasztasa
    const randomItemData = settings.ITEMS[Math.floor(Math.random() * settings.ITEMS.length)];

    //veletlenseru X posicio generálása szélességen belül
    const xPos = Math.random() * (settings.CANVAS_WIDTH - settings.ITEM_SIZE) + settings.ITEM_SIZE / 2;

    const itemElement = document.createElement('div'); //uj div elem letrehozasa
    itemElement.className = 'falling-item'; // css osztaly hozzarendeles
    itemElement.textContent = randomItemData.emoji; //emojit beallitasa

    // X pozicio beallitasa
    itemElement.style.left = '${xPos - settings.ITEM_SIZE / 2}px';
    // kezdo Y pozicio (a jatek teruleten felul)
    itemElement.style.top = `- ${settings.ITEM_SIZE}px`;
    gameArea.appendChild(itemElement); //hozzaadas a jatek terulethez

    // hozzaadas a fallingItems tombhoz a mozgatashoz szukseges adatokkal
    fallingItems.push({
        x: xPos, //kozeppont x kordinataja
        y: -settings.ITEM_SIZE, //kezdo y kordinataja
        value: randomItemData.value, //pont ertek
        element: itemElement //dom elem hivatkozas
    });
}



// frissites es jatek vege 

function updateScore() {
    scoreDisplay.textContent = 'Score: ${score}'; // pontszam kijelzo szovegenek frissitese 
}






