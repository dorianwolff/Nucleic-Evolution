document.addEventListener('DOMContentLoaded', () => {
    const openPackButton = document.getElementById('open-pack');
    const revealAllButton = document.getElementById('reveal-all');
    const saveCardsButton = document.getElementById('save-cards');
    const clearSavedCardsButton = document.getElementById('clear-saved-cards');
    const createDeckButton = document.getElementById('create-deck');
    const openedCardsContainer = document.getElementById('opened-cards');
    const savedCardsGrid = document.getElementById('saved-cards');
    const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

    const cardBacks = {
        'land': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/049_back.png',
        'unit': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/000_back.png',
        'power-up': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/119_back.png',
        'civilization': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/128_back.png'
    };

    function getRandomCards() {
        const pack = [];
        const types = ['unit', 'land', 'power-up', 'civilization'];

        // Ensure special unit card logic
        let specialUnitIncluded = false;
        if (Math.random() < 1 / 3) {
            const specialUnitCards = window.cards.filter(c => c.type === 'unit');
            let specialUnitCard = specialUnitCards[Math.floor(Math.random() * specialUnitCards.length)];

            if (specialUnitCard) {
                // Assign the full art image if available
                specialUnitCard.image = specialUnitCard.fullArtImage || specialUnitCard.image;
                pack.push(specialUnitCard);
                specialUnitIncluded = true;
            } else {
                console.error('No valid special unit card found.');
            }
        }

        types.forEach(type => {
            let selectedCards = window.cards.filter(c => c.type === type);

            // If a special unit is already included, reduce the number of unit cards to add
            if (specialUnitIncluded && type === 'unit') {
                selectedCards = selectedCards.sort(() => 0.5 - Math.random()).slice(0, 1);
            } else {
                selectedCards = selectedCards.sort(() => 0.5 - Math.random()).slice(0, 2);
            }

            pack.push(...selectedCards);
        });

        // Ensure exactly 8 cards are selected
        if (pack.length > 8) {
            pack.length = 8;
        }

        return pack;
    }



    function displayCards(cards, revealed = false) {
        openedCardsContainer.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${revealed ? 'revealed' : ''}`;
            cardElement.draggable = true;
            cardElement.innerHTML = `
                <img src="${revealed ? card.image : cardBacks[card.type]}" alt="${card.name}">
            `;
            cardElement.dataset.cardId = card.id;
            cardElement.dataset.cardJson = JSON.stringify(card); // Store card data as JSON in the dataset

            cardElement.addEventListener('click', () => {
                cardElement.classList.toggle('revealed');
                cardElement.querySelector('img').src = cardElement.classList.contains('revealed') ? card.image : cardBacks[card.type];
                checkSaveButtonState();
            });

            cardElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', cardElement.dataset.cardJson);
                cardElement.style.opacity = '0.5';
            });

            cardElement.addEventListener('dragend', (e) => {
                cardElement.style.opacity = '1';
            });

            openedCardsContainer.appendChild(cardElement);
        });
        checkSaveButtonState();
    }

    openPackButton.addEventListener('click', () => {
        const openedCards = getRandomCards();

        // Get the current user
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Please login or create an account');
            return;
        }

        // Get the user's data
        let userData = JSON.parse(localStorage.getItem('user-' + currentUser)) || { collection: [], decks: [] };
        let userCollection = userData.collection || [];

        // Deep copy and add opened cards to the user's collection
        openedCards.forEach(card => {
            const cardCopy = JSON.parse(JSON.stringify(card));
            userCollection.push(cardCopy);
        });

        // Save the updated collection
        userData.collection = userCollection;
        localStorage.setItem('user-' + currentUser, JSON.stringify(userData));

        // Display the cards
        displayCards(openedCards);
        checkSaveButtonState();
        saveCardsButton.onclick = () => saveCards(openedCards);
    });


    revealAllButton.addEventListener('click', () => {
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach(cardElement => {
            if (!cardElement.classList.contains('revealed')) {
                cardElement.classList.add('revealed');
                const cardId = parseInt(cardElement.dataset.cardId, 10);
                const card = window.cards.find(c => c.id === cardId);
                cardElement.querySelector('img').src = card.image;
            }
        });
        checkSaveButtonState();
    });

    clearSavedCardsButton.addEventListener('click', () => {
        localStorage.removeItem('savedCards');
        savedCards.length = 0;
        displaySavedCards();
        alert('Saved cards cleared!');
        checkSaveButtonState();
    });

    createDeckButton.addEventListener('click', () => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Please login or create an account');
            return;
        }
        let deckName = prompt('Enter the name of the new deck (max 15 characters):');
        if (deckName) {
            let userData = JSON.parse(localStorage.getItem('user-' + currentUser)) || { decks: [] };
            let savedDecks = userData.decks || [];
            if (savedDecks.length < 3) {
                deckName = deckName.substring(0, 15); // Limit to 15 characters
                savedDecks.push({ name: deckName, cards: savedCards });
                userData.decks = savedDecks;
                localStorage.setItem('user-' + currentUser, JSON.stringify(userData));
                window.location.href = `deck-editor.html?deck=${deckName}`;
            } else {
                alert('You can only create up to 3 decks.');
            }
        }
    });

    function saveCards(cards) {
        const coloredCards = cards.filter(card => {
            const cardElement = openedCardsContainer.querySelector(`[data-card-id='${card.id}']`);
            return cardElement && !cardElement.classList.contains('blocked');
        });

        coloredCards.forEach(card => {
            const cardElement = openedCardsContainer.querySelector(`[data-card-id='${card.id}']`);
            if (cardElement) {
                cardElement.classList.add('blocked');
                cardElement.style.filter = 'grayscale(100%)';
                cardElement.style.pointerEvents = 'none';
            }
        });

        savedCards.push(...coloredCards);
        localStorage.setItem('savedCards', JSON.stringify(savedCards));
        displaySavedCards(); // Reflect saved cards immediately
        alert('Cards saved!');
        checkSaveButtonState();
    }

    function displaySavedCards() {
        savedCardsGrid.innerHTML = ''; // Clear previous cards
        savedCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card revealed';
            cardElement.draggable = true;
            cardElement.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
            cardElement.dataset.cardIndex = index;

            cardElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                cardElement.style.opacity = '0.5';
            });

            cardElement.addEventListener('dragend', (e) => {
                cardElement.style.opacity = '1';
            });

            savedCardsGrid.appendChild(cardElement);
        });
        checkClearButtonState();
    }

    savedCardsGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    savedCardsGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (isNaN(parseInt(data, 10))) { // Ensure no action if dropping within the same zone
            const card = JSON.parse(data);
            if (!savedCards.find(c => c.id === card.id)) {
                savedCards.push(card);
                localStorage.setItem('savedCards', JSON.stringify(savedCards));
                displaySavedCards();
                const cardElement = openedCardsContainer.querySelector(`[data-card-id='${card.id}']`);
                if (cardElement) {
                    cardElement.classList.add('blocked');
                    cardElement.style.filter = 'grayscale(100%)';
                    cardElement.style.pointerEvents = 'none';
                }
            }
            checkSaveButtonState();
        }
    });

    openedCardsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    openedCardsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const cardIndex = parseInt(data, 10);
        if (!isNaN(cardIndex)) {
            const card = savedCards[cardIndex];
            savedCards.splice(cardIndex, 1);
            localStorage.setItem('savedCards', JSON.stringify(savedCards));
            displaySavedCards();
            const cardElement = openedCardsContainer.querySelector(`[data-card-id='${card.id}']`);
            if (cardElement) {
                cardElement.classList.remove('blocked');
                cardElement.style.filter = 'none';
                cardElement.style.pointerEvents = 'auto';
            }
        }
        checkSaveButtonState();
    });

    function checkSaveButtonState() {
        const allRevealed = Array.from(openedCardsContainer.children).every(cardElement => cardElement.classList.contains('revealed'));
        const allBlocked = Array.from(openedCardsContainer.children).every(cardElement => cardElement.classList.contains('blocked'));
        saveCardsButton.disabled = !(allRevealed && !allBlocked);
        saveCardsButton.classList.toggle('bg-gray-500', saveCardsButton.disabled === true);
    }

    function checkClearButtonState() {
        clearSavedCardsButton.disabled = savedCards.length === 0;
        clearSavedCardsButton.classList.toggle('bg-gray-500', clearSavedCardsButton.disabled === true);
    }

    displaySavedCards();
    checkSaveButtonState();
    checkClearButtonState();
});
