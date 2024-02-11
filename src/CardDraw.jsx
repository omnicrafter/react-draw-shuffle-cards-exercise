import { useState, useEffect, useRef } from "react";
import Card from "./Card";

const CardDraw = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [cardsLeftInDeck, setCardsLeftInDeck] = useState(null);
  const URL = "https://deckofcardsapi.com/api/deck";

  useEffect(() => {
    const makeAndShuffleNewDeck = async () => {
      const response = await fetch(`${URL}/new/shuffle/?deck_count=1`);
      const data = await response.json();
      setDeckId(data.deck_id);
    };
    makeAndShuffleNewDeck();
  }, []);

  const drawCard = async () => {
    const response = await fetch(`${URL}/${deckId}/draw/?count=1`);
    const data = await response.json();
    const card = data.cards[0].image;

    setDrawnCards((prevCards) => [...prevCards, card]);
    setCardsLeftInDeck(data.remaining);
  };

  return (
    <>
      <p>{!deckId ? "loading..." : deckId}</p>
      <div>
        {drawnCards.map((card, index) => (
          <Card key={index} imageUrl={card} />
        ))}
      </div>
    </>
  );
};

export default CardDraw;
