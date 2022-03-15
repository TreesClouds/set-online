class Card {
    constructor (count, color, shade, shape, imageFileName) {
        this.count = count;
        this.color = color;
        this.shade = shade;
        this.shape = shape;
        this.playIndex = -1;
        this.selected = false;
        this.image = loadImage(imageFileName);
    }

    get getCount() {
        return this.count;
    }

    get getColor() {
        return this.color;
    }

    get getShade() {
        return this.shade;
    }

    get getShape() {
        return this.shape;
    }
    get PlayIndex () {
        return this.playIndex;
    }

    set PlayIndex (pi) {
        this.playIndex = pi;
    }

    get getImage() {
        return this.image;
    }

    hint() {
        let ind = inPlay.findIndex((element) => element === this);
        let p = getCardPos(ind);
        rect(p[0]-4, p[1]-4, 154, 250);
    }
}

class Deck {
    constructor() {
        this.myDeck = [];
        let card = 0;

        let shapes = ["oval", "diamond", "peanut"];
        let shades = ["solid", "open", "hatched"];
        let colors = ["purple", "green", "red"];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    for (let l = 1; l < 4; l++) {
                        let imageValue = "images/Slide" + (card+1) + ".PNG";
                        this.myDeck[card] = new Card(l, colors[k], shades[j], shapes[i], imageValue);
                        card++;
                    }
                }
            }
        }
    }

    getCard() {
        let result, rand;
        while (true) {
            rand = Math.floor(Math.random()*81);
            result = this.myDeck[rand];
            if (this.myDeck[rand] != null) {
                break;
            }
        }
        this.myDeck[rand] = null;
        return result;
    }

    isSet (cards) {
        let set = true;

        if (cards[0] === null || cards[1] === null || cards[2] === null) {
            return false;
        }

        if (
            !(
                (
                    this.attributeSame(cards[0].getCount, cards[1].getCount, cards[2].getCount) ||
                    this.allAttributeDifferent(cards[0].getCount, cards[1].getCount, cards[2].getCount)
                ) && (
                    this.attributeSame(cards[0].getColor, cards[1].getColor, cards[2].getColor) ||
                    this.allAttributeDifferent(cards[0].getColor, cards[1].getColor, cards[2].getColor)
                ) && (
                    this.attributeSame(cards[0].getShade, cards[1].getShade, cards[2].getShade) ||
                    this.allAttributeDifferent(cards[0].getShade, cards[1].getShade, cards[2].getShade)
                ) && (
                    this.attributeSame(cards[0].getShape, cards[1].getShape, cards[2].getShape) ||
                    this.allAttributeDifferent(cards[0].getShape, cards[1].getShape, cards[2].getShape)
                )
            )
        ) {
            set = false;
        }
        return set;
    }

    attributeSame(a, b, c) {
        return a === b && a === c;
    }

    allAttributeDifferent(a, b, c) {
        return a !== b && a !== c && b !== c;
    }

    get getCardsLeft() {
        let count = 0;
        for (let i = 0; i < 81; i++) {
            if (this.myDeck[i] != null) {
                count++;
            }
        }
        return count;
    }
}

let gameDeck;
let inPlay;
let selected;
let selectedSpots;
let collected;
let hint;
let hinted;
let possible;

function get12Cards() {
    for (let i = 0; i < 12; i++) {
        let card = gameDeck.getCard()
        card.PlayIndex = i;
        inPlay.push(card);
    }
}

function getCardPos(ind) {
    let cw = 144;
    let ch = 240;
    let placeX = 80;
    let placeY = 10;
    let card = 0;

    let tempPlaceX = placeX;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (card === ind) {
                return [tempPlaceX, placeY]
            }
            tempPlaceX = tempPlaceX + cw + 10;
            card++;
        }
        tempPlaceX = placeX;
        placeY = placeY + ch + 10;
    }
    return -1;
}

function placeCards() {
    for (let i = 0; i < 12; i++) {
        if (inPlay[i] !== null) {
            let p = getCardPos(i);
            image(inPlay[i].getImage, p[0], p[1], 144, 240);
        }
    }
}

function getHint() {
    let a;
    for (let i = 0; i < inPlay.length-2; i++) {
        for (let j = i+1; j < inPlay.length-1; j++) {
            for (let k = j+1; k < inPlay.length; k++) {

                a = [inPlay[i], inPlay[j], inPlay[k]]

                if (gameDeck.isSet(a)) {
                    for (const c of a) {
                        c.hint();
                    }
                    return;
                }
            }
        }
    }
}
function updateSelectedCards() {
    let numSel = selected.length;
    for (let i = 0; i < numSel; i++) {
        let l = selectedSpots[i];
        image(selected[i].getImage, l, 260, 144, 240);
    }
}

function setup() {
    createCanvas(1920, 1080);
    frameRate(30);
    textAlign(CENTER);
    gameDeck = new Deck();
    inPlay = [];
    selected = [];
    selectedSpots = [780, 938, 1096];
    collected = 0;
    possible = 27;
    hint = false;
    hinted = false;
    get12Cards();
}

function mousePressWithin(x, y, w, h) {
    return mouseIsPressed && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function draw() {
    background(0);

    if (hint) {
        fill("red")
        getHint();
    }
    placeCards();
    updateSelectedCards();
    textSize(18);
    fill("white");
    if (selected.length === 3) {
        if (gameDeck.isSet(selected)) {
            text("This is a valid set", 1010, 200);
            buttonPlacement("#282828", "gray");

        } else {
            text("This is not a valid set", 1010, 200);
            buttonPlacement("#282828", "#282828");
        }
    } else if (selected.length === 0) {
        buttonPlacement("gray", "#282828");
        // Enable hint
    } else {
        buttonPlacement("#282828", "#282828");
    }
    fill("white");
    textSize(18);
    text("Sets Collected: " + collected + "/" + possible, 1010, 100);
}

function buttonPlacement(r1, r2) {
    fill(r1)
    rect(938-80, 570, 144, 50);
    fill(r2)
    rect(938+80, 570, 144, 50);
    fill("white");
    text("DISCARD", 1010+80, 600);
    text("HINT", 1010-80, 600);
    textSize(12);
    text("(Does not earn a point)", 1010-80, 640);
}

function mousePressed() {
    for (let i = 0; i < 12; i++) {
        if (inPlay[i] !== null) {
            let pos = getCardPos(i);
            if (mousePressWithin(pos[0], pos[1], 144, 240) && selected.length !== 3) {
                hint = false;
                selected.push(inPlay[i]);
                inPlay[i].setSelected = true;
                inPlay[i] = null;
            }
        }
    }
    for (let i = 0; i < selected.length; i++) {
        if (mousePressWithin(selectedSpots[i], 260, 144, 240)) {
            let c = selected[i];
            selected.splice(i, 1);
            inPlay[c.PlayIndex] = c;
            break;
        }
    }
    if (selected.length === 3) {
        if (gameDeck.isSet(selected)) {
            if (mousePressWithin(938+80, 570, 144, 50)) {
                if (!hinted) {
                    collected++;
                } else {
                    hint = false;
                    hinted = false;
                    possible--;
                }
                for (let card of selected) {
                    if (gameDeck.getCardsLeft !== 0) {
                        let nc = gameDeck.getCard();
                        nc.PlayIndex = card.PlayIndex;
                        inPlay[nc.PlayIndex] = nc;
                    }
                }
                selected = [];
            }
        }
    } else if (selected.length === 0) {
        if (mousePressWithin(938-80, 570, 144, 50)) {
            hint = true;
            hinted = true;
        }
    }
}
