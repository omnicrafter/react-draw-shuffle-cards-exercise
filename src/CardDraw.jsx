import { useState, useEffect, useRef } from "react";
import Card from "./Card";

const CardDraw = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [cardsLeftInDeck, setCardsLeftInDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const URL = "https://deckofcardsapi.com/api/deck";

  useEffect(() => {
    console.log(`Deck ID: ${deckId}`);
  }, [deckId]);

  useEffect(() => {
    if (cardsLeftInDeck === 0) {
      return alert("Error: no cards remaining!");
    }
  }, [cardsLeftInDeck]);

  const makeAndShuffleNewDeck = async () => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/new/shuffle/?deck_count=1`);

      const data = await response.json();
      setDeckId(data.deck_id);
      setCardsLeftInDeck(data.remaining);

      setDrawnCards([]);
      hasFetched.current = false;
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    makeAndShuffleNewDeck();
  }, []);

  const drawCard = async () => {
    if (cardsLeftInDeck === 0) {
      return alert("Error: no cards remaining! Use a new deck!");
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/${deckId}/draw/?count=1`);
      const data = await response.json();

      setDrawnCards((prevCards) => [...prevCards, data.cards[0].image]);
      setCardsLeftInDeck(data.remaining);
      console.log(cardsLeftInDeck);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={drawCard} disabled={isLoading}>
        Draw a Card
      </button>
      <button onClick={makeAndShuffleNewDeck} disabled={isLoading}>
        New Deck
      </button>
      <div className="card-container">
        {drawnCards.map((card, index) => (
          <Card key={index} imageUrl={card} />
        ))}
      </div>
    </>
  );
};

export default CardDraw;
