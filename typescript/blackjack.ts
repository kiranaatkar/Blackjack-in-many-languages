export class Card {
  rank: string;
  suit: string;

  constructor(rank: string, suit: string) {
    this.rank = rank;
    this.suit = suit.toUpperCase();
  }

  toString(): string {
    return `${this.rank}${this.suit}`;
  }

  get points(): number {
    if (parseInt(this.rank)) {
      return parseInt(this.rank);
    } else if (this.rank === 'A') {
      return 11;
    } else {
      return 10;
    }
  }
}

export class Deck {
  cards: Array<Card>;

  constructor() {
    this.cards = this.generateDeck();
  }

  generateDeck(): Array<Card> {
    const suits = ['S', 'D', 'C', 'H'];
    const ranks = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ];
    const deck: Array<Card> = [];
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

  shuffle(): Array<Card> {
    let seed: number = Math.floor(Math.random() * 10000 + 1);
    let currentIndex: number = this.cards.length;
    let temporaryValue: Card;
    let randomIndex: number;

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

export class Hand {
  cards: Array<Card>;
  bust: boolean;

  constructor(cards: Array<Card>) {
    this.cards = cards;
    this.bust = false;
  }

  get points(): number {
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

  toString(): string {
    return `${this.cards.join(', ')}\n(${this.points} points)`;
  }

  hit(newCard: Card) {
    console.log('Hitting...');
    this.cards.push(newCard);
  }

  checkBust(): boolean {
    if (this.points > 21) {
      console.log('Bust.');
      this.bust = true;
      return false;
    } else {
      return true;
    }
  }
}
