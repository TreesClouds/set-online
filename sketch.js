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

    get Selected() {
        return this.selected;
    }

    set Selected (s) {
        this.selected = s;
    }

    get getImage() {
        return this.image;
    }

    hint() {
        let ind = inPlay.findIndex((element) => element === this);
        let p = getCardPos(ind);
        rect(p[0]-4, p[1]-4, 148+6, 244+6);
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
    let placeX = 10 + cw / 4;
    let placeY = 10 + ch / 4;
    let card = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (card === ind) {
                return [placeX, placeY]
            }
            placeX = placeX + cw + 10;
            card++;
        }
        placeX = 10 + cw / 4;
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
    hint = false;
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
    if (selected.length === 3) {
        if (gameDeck.isSet(selected)) {
            fill("gray")
            rect(938, 570, 144, 50);
            fill("white");
            text("This is a valid set", 1010, 200);
            text("DISCARD", 1010, 600);
        } else {
            fill("white");
            text("This is not a valid set", 1010, 200);
        }
    } else {
        fill("gray")
        rect(938, 570, 144, 50);
        fill("white");
        text("HINT", 1010, 600);
    }
    text("Sets Collected: " + collected + "/27", 1010, 100);
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
        }
    }
    if (selected.length === 3) {
        if (gameDeck.isSet(selected)) {
            if (mousePressWithin(938, 570, 144, 50)) {
                hint = false;
                collected++;
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
    } else {
        if (mousePressWithin(938, 570, 144, 50)) {
            hint = true;
        }
    }
}
