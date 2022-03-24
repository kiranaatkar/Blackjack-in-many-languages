export class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit.toUpperCase();
  }

  toString() {
    return `${this.rank}${this.suit}`;
  }

  get points() {
    if (parseInt(this.rank)) {
      return parseInt(this.rank);
    } else if (this.rank === 'A') {
      return 11;
    } else {
      return 10;
    }
  }
}

export class Hand {
  constructor(cards) {
    if (!cards.every((card) => card instanceof Card)) {
      throw new TypeError('A Hand can only contain Cards');
    }

    this.cards = cards;
    this.bust = false;
  }

  get points() {
    //Handle case for two Aces.
    if (this.cards.length === 0) {
      return 0;
    } else if (this.cards.every((card) => card.rank === 'A')) {
      return 21;
    } else {
      return this.cards.reduce((total, card) => {
        return (total += card.points);
      }, 0);
    }
  }

  toString() {
    return `${this.cards.join(', ')}\n(${this.points} points)`;
  }

  hit(newCard) {
    console.log('Hitting...');
    this.cards.push(newCard);
  }

  checkBust() {
    if (this.points > 21) {
      console.log('Bust.');
      this.bust = true;
      return false;
    } else {
      return true;
    }
  }
}

export class Deck {
  constructor() {
    this.cards = this.generateDeck();
  }

  generateDeck() {
    const suits = ['S', 'D', 'C', 'H'];
    const ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    const deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push(new Card(rank, suit));
      }
    }
    return deck;
  }

  draw() {
    return this.cards.shift();
  }

  shuffle() {
    let seed = Math.floor(Math.random() * 10000 + 1);

    let currentIndex = this.cards.length;
    let temporaryValue, randomIndex;

    let random = () => {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    while (0 !== currentIndex) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }

    return this.cards;
  }
}

export class Game {
  constructor() {
    this.deck = new Deck();
  }

  play() {
    console.log('Welcome to a game of Blackjack.');
    this.deck.shuffle();
    let playerHand = new Hand([this.deck.draw(), this.deck.draw()]);
    console.log(`Your hand is ${playerHand.toString()}`);
    // Player turn
    let playerTurn = true;
    while (playerTurn) {
      let hitOrStick = window.prompt("Enter 'hit' or 'stick': ");
      if (hitOrStick === 'hit') {
        playerHand.hit(this.deck.draw());
        console.log(`Your hand is ${playerHand.toString()}`);
        playerTurn = playerHand.checkBust();
      } else {
        playerTurn = false;
      }
    }

    // Dealer turn
    let dealerHand = new Hand([this.deck.draw(), this.deck.draw()]);
    console.log(`Dealers hand is ${dealerHand.toString()}`);
    while (dealerHand.points <= 17) {
      dealerHand.hit(this.deck.draw());
      console.log(`Dealers hand is ${dealerHand.toString()}`);
      dealerHand.checkBust();
    }

    // Get winner
    this.getWinner(playerHand, dealerHand);
  }

  getWinner(player, dealer) {
    const pPoints = player.points;
    const dPoints = dealer.points;
    if ((player.bust && dealer.bust) || pPoints === dPoints) {
      console.log('Draw!');
    } else if (dealer.bust || pPoints > dPoints) {
      console.log('You win!');
    } else if (player.bust || pPoints < dPoints) {
      console.log('Dealer wins.');
    }
  }
}

let game1 = new Game();
game1.play();
