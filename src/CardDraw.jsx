import { useState, useEffect, useRef } from "react";
import Card from "./Card";

const CardDraw = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [cardsLeftInDeck, setCardsLeftInDeck] = useState(null);
  const URL = "https://deckofcardsapi.com/api/deck";

  useEffect(() => {
    if (cardsLeftInDeck === 0) {
      return alert("Error: no cards remaining!");
    }
  }, [cardsLeftInDeck]);

  const makeAndShuffleNewDeck = async () => {
    const response = await fetch(`${URL}/new/shuffle/?deck_count=1`);
    const data = await response.json();
    setDeckId(data.deck_id);
    setCardsLeftInDeck(data.remaining);

    setDrawnCards([]);
  };

  useEffect(() => {
    makeAndShuffleNewDeck();
  }, []);

  const drawCard = async () => {
    if (cardsLeftInDeck === 0) {
      return alert("Error: no cards remaining! Use a new deck!");
    }

    const response = await fetch(`${URL}/${deckId}/draw/?count=1`);
    const data = await response.json();

    setDrawnCards((prevCards) => [...prevCards, data.cards[0].image]);
    setCardsLeftInDeck(data.remaining);
    console.log(cardsLeftInDeck);
  };

  return (
    <>
      <button onClick={drawCard}>Draw a Card</button>
      <button onClick={makeAndShuffleNewDeck}>New Deck</button>
      <p>{!deckId ? "loading..." : deckId}</p>
      <div className="card-container">
        {drawnCards.map((card, index) => (
          <Card key={index} imageUrl={card} />
        ))}
      </div>
    </>
  );
};

export default CardDraw;
