from os import readlink
import random

class Card:
  def __init__(self, rank, suit):
    self.rank = rank
    self.suit = suit


  def to_string(self):
    return f"{self.rank}{self.suit}"

  def get_points(self):
    if type(self.rank) == int:
      return int(self.rank)
    elif self.rank == 'A':
      return 11
    else:
      return 10



class Hand:
  def __init__(self, cards):
    self.cards = cards
    self.bust = False

  def get_points(self):
    if not self.cards:
      return 0
    elif all(card.rank == "A" for card in self.cards):
      return 21
    else:
      points = 0
      for card in self.cards:
        points += card.get_points()
      return points

  def to_string(self):
    return f"{', '.join([card.to_string() for card in self.cards])}"

  def hit(self, new_card):
    print("Hitting...")
    self.cards.append(new_card)

  def check_bust(self):
    if self.get_points() > 21:
      print("Bust.")
      self.bust = True
      return False
    else:
      return True



class Deck:
  def __init__(self):
    self.cards = self.generate_deck()

  def generate_deck(self):
    suits = ['S', 'D', 'C', 'H']
    ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    deck = []
    for suit in suits:
      for rank in ranks: 
        deck.append(Card(rank, suit))
    return deck

  def shuffle(self):
    random.shuffle(self.cards)
  
  def draw(self):
    return self.cards.pop()


class Game:
  def __init__(self):
    self.deck = Deck()

  def get_winner(self, player_hand, dealer_hand):
    p_points = player_hand.get_points()
    d_points = dealer_hand.get_points()

    if (player_hand.bust and dealer_hand.bust) or (p_points == d_points):
      print("Draw!")
    elif (dealer_hand.bust) or (p_points > d_points):
      print("Player wins.")
    elif(player_hand.bust) or (p_points < d_points):
      print("Dealer wins.")


  def play(self):
    self.deck.shuffle()
    player_hand = Hand([self.deck.draw(), self.deck.draw()])
    print(f"Player hand: {player_hand.to_string()}. \n {player_hand.get_points()} points.")
    
    # Player turn
    player_turn = True
    while(player_turn):
      hit_or_stick = input("Enter 'hit' or 'stick': ")
      if hit_or_stick == "hit":
        player_hand.hit(self.deck.draw())
        print(f"Player hand: {player_hand.to_string()}. \n {player_hand.get_points()} points.")
        player_turn = player_hand.check_bust()
      else:
        player_turn = False

    # Dealer turn
    dealer_hand = Hand([self.deck.draw(), self.deck.draw()])
    print(f"Dealer hand: {dealer_hand.to_string()}. \n {dealer_hand.get_points()} points.")
    while(dealer_hand.get_points() <= 17):
      dealer_hand.hit(self.deck.draw())
      print(f"Dealer hand: {dealer_hand.to_string()}. \n {dealer_hand.get_points()} points.")
      dealer_hand.check_bust()

  
    # Get winner
    self.get_winner(player_hand, dealer_hand)






game = Game()
print(game.play())