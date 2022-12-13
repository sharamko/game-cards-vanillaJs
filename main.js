(() => {
  const creatTitle = (title) => {
    const creatTitle = document.createElement('h2');
    creatTitle.innerHTML = title;
    return creatTitle;
  };
  const creatForm = () => {
    const gameForm = document.createElement('form');
    const gameInput = document.createElement('input');
    const gameGoBtn = document.createElement('button');
    gameForm.classList.add('input-group', 'mb-3');
    gameInput.classList.add('form-control');
    gameInput.placeholder = 'Введите ширину поля от 2 до 10';
    gameGoBtn.classList.add('btn', 'btn-primary');
    gameGoBtn.textContent = 'Начать игру';
    gameForm.style.maxWidth = '400px';

    gameForm.append(gameInput);
    gameForm.append(gameGoBtn);

    return {
      gameForm,
      gameInput,
      gameGoBtn,
    };
  };

  let timerId;

  const creatGame = () => {
    const formWrapper = document.querySelector('.header');
    const gameTitle = creatTitle('Game Cards');
    const cardsForm = creatForm();

    formWrapper.append(gameTitle);
    formWrapper.append(cardsForm.gameForm);

    cardsForm.gameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputValue = cardsForm.gameInput.value;
      if (!inputValue) {
        return;
      }

      const validNumber = numberValidator(inputValue);
      if (!validNumber) {
        cardsForm.gameInput.value = '4';
      } else {
        cardsForm.gameInput.value = '';
        cardsForm.gameGoBtn.disabled = true;
        timerId = setTimeout(() => {
          alert('Time is over!');
          window.location.reload();
        }, 60000);
        startOfGame(Math.pow(validNumber, 2));
      }
    });
  };
  const numberValidator = (numb) => {
    if (numb > 1 && numb < 11) {
      if (!(numb % 2)) {
        return numb;
      }
    }
    return null;
  };
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  };
  const createCardList = () => {
    const list = document.createElement('ul');
    list.id = 'cardList';
    list.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap');
    list.setAttribute(
      'style',
      'width: 600px; height: 600px; outline: 2px solid grey; padding: 0; list-style: none; align-content: space-evenly;'
    );
    return list;
  };
  const createCard = (idValue, numberOfCards) => {
    const cardWidth = (600 * 0.95) / Math.sqrt(numberOfCards);
    const card = document.createElement('li');
    const button = document.createElement('button');
    card.setAttribute(
      'style',
      `width: ${cardWidth}px; height: ${cardWidth}px; `
    );
    button.id = idValue;
    button.setAttribute(
      'style',
      `font-size: ${cardWidth * 0.7}px;line-height:${
        cardWidth * 0.7
      }px; width: 100%; height:100%; border:1px solid grey;`
    );

    card.append(button);

    return {
      card,
      button,
    };
  };

  let numberOfCoincidences = 0;

  const startOfGame = (numberOfCards) => {
    const arrayOfCards = [];
    let valueOfCards = numberOfCards / 2;

    for (let i = 0; i < numberOfCards; ++i) {
      arrayOfCards.push(valueOfCards);
      if (i % 2) {
        --valueOfCards;
      }
    }

    const shuffledArray = shuffle(arrayOfCards);

    createListOfCards(numberOfCards, shuffledArray);
  };
  const createListOfCards = (numberOfCards, shuffledArray) => {
    const section = document.querySelector('.main');
    const listOfCards = createCardList();

    for (let i = 0; i < numberOfCards; ++i) {
      let currentCard = createCard(i, numberOfCards);
      listOfCards.append(currentCard.card);
      currentCard.button.addEventListener('click', () => {
        let valueOfCard = shuffledArray[currentCard.button.id];
        currentCard.button.textContent = valueOfCard;
        comparePairs(currentCard, valueOfCard);
        if (numberOfCards === numberOfCoincidences * 2) {
          playAgain();
        }
      });
    }
    section.appendChild(listOfCards);
  };

  let firstNumberObj = {};
  let secondNumberObj = {};
  let isEqual = false;

  const comparePairs = (card, value) => {
    if (!Object.keys(firstNumberObj).length) {
      firstNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
    } else if (!Object.keys(secondNumberObj).length) {
      secondNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      if (firstNumberObj.value === secondNumberObj.value) {
        isEqual = true;
        ++numberOfCoincidences;
        return;
      }
    } else {
      if (!isEqual) {
        firstNumberObj.card.button.innerHTML = '';
        secondNumberObj.card.button.innerHTML = '';
        firstNumberObj.card.button.removeAttribute('disabled');
        secondNumberObj.card.button.removeAttribute('disabled');
      } else {
        isEqual = false;
      }

      firstNumberObj = {
        card: card,
        value: value,
      };

      card.button.setAttribute('disabled', 'true');
      secondNumberObj = {};
    }
  };
  const playAgain = () => {
    const section = document.querySelector('.main');
    const button = document.createElement('button');
    button.innerText = 'New Game';
    button.classList.add('btn', 'btn-success');
    section.after(button);

    clearTimeout(timerId);

    button.addEventListener('click', () => {
      window.location.reload();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    creatGame();
  });
})();
