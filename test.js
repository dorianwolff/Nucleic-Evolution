// history.replaceState(null, null, 'game.html'); // manages the history of the browser

document.addEventListener('DOMContentLoaded', () => {
    const userZones = document.querySelectorAll('.user-zone');
    const opponentZones = document.querySelectorAll('.opponent-zone');
    const revealCardsContainer = document.getElementById('reveal-cards');
    const turnIndicatorContainer = document.getElementById('turn-indicator-container');
    const turnIndicator = turnIndicatorContainer;
    const popupMessage = document.getElementById('popup-message');
    const surrenderButton = document.createElement('button');
    let maskButton;
    let fightButton;
    let maskActive = false;

    // Zone status can have 'fightUsingResource', 'Frozen'
    let userZoneStatus = [[],[],[]];
    let opponentZoneStatus = [[],[],[]];

    const defeatedUnits = {
        user: [],
        ai: []
    };

    let userResourcePoints = 0;
    let aiResourcePoints = 0;

    const userResourceDisplay = document.createElement('div');
    const aiResourceDisplay = document.createElement('div');
    userResourceDisplay.id = 'user-resource-display';
    aiResourceDisplay.id = 'ai-resource-display';

    document.body.appendChild(userResourceDisplay);
    document.body.appendChild(aiResourceDisplay);

    const cardBacks = {
        'land': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/049_back.png',
        'unit': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/000_back.png',
        'power-up': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/119_back.png',
        'civilization': 'Individual_Cards/Nucleic_Evolution_1_pngs/backs/128_back.png'
    };

    let playerGoesFirst = JSON.parse(localStorage.getItem('playerGoesFirst'));
    let currentPlayer = playerGoesFirst ? 'user' : 'ai';
    let currentPhase = 'land';
    let turnCount = 0;
    let lastPlayedCard = null;
    const selectedAI = JSON.parse(localStorage.getItem('selectedAI'));
    const aiGlowClass = `aura-${selectedAI.glow}`;

    userResourceDisplay.className = 'resource-display aura-yellow';
    aiResourceDisplay.className = `resource-display ${aiGlowClass}`;

    const playerDeck = JSON.parse(localStorage.getItem('selectedDeck')).cards;
    const aiDeck = JSON.parse(localStorage.getItem('selectedAI')).deck.cards;

    const shuffleDeck = (deck) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    };

    const playerPiles = {
        land: playerDeck.filter(card => card.type === 'land'),
        unit: playerDeck.filter(card => card.type === 'unit'),
        powerUp: playerDeck.filter(card => card.type === 'power-up'),
        civilization: playerDeck.filter(card => card.type === 'civilization')
    };

    const aiPiles = {
        land: aiDeck.filter(card => card.type === 'land'),
        unit: aiDeck.filter(card => card.type === 'unit'),
        powerUp: aiDeck.filter(card => card.type === 'power-up'),
        civilization: aiDeck.filter(card => card.type === 'civilization')
    };

    shuffleDeck(playerPiles.land);
    shuffleDeck(playerPiles.unit);
    shuffleDeck(playerPiles.powerUp);
    shuffleDeck(playerPiles.civilization);

    shuffleDeck(aiPiles.land);
    shuffleDeck(aiPiles.unit);
    shuffleDeck(aiPiles.powerUp);
    shuffleDeck(aiPiles.civilization);

    surrenderButton.id = 'surrender-button';
    surrenderButton.className = 'button-custom mt-6';
    surrenderButton.textContent = 'Surrender';
    surrenderButton.style.fontSize = '18px';
    surrenderButton.style.padding = '2px 24px';
    surrenderButton.style.position = 'absolute';
    surrenderButton.style.left = '84%';
    surrenderButton.style.transform = 'translateX(-50%)';
    surrenderButton.style.top = '10px';
    surrenderButton.style.backgroundColor = '#CD5C5C';
    surrenderButton.style.color = 'black';
    surrenderButton.style.border = '3px solid black';
    surrenderButton.style.borderRadius = '5px';
    surrenderButton.style.transition = 'all 0.3s ease';

    surrenderButton.addEventListener('mouseover', () => {
        surrenderButton.style.backgroundColor = 'black';
        surrenderButton.style.color = '#CD5C5C';
    });

    surrenderButton.addEventListener('mouseout', () => {
        surrenderButton.style.backgroundColor = '#CD5C5C';
        surrenderButton.style.color = 'black';
    });

    surrenderButton.addEventListener('click', () => {
        endGame('ai');
    });

    document.body.appendChild(surrenderButton);

    function updateTurnIndicator() {
        turnIndicator.textContent = `${currentPlayer === 'user' ? 'Your' : 'AI'} Turn`;
        if (currentPhase === 'confrontation') {
            turnIndicatorContainer.className = 'turn-indicator-box aura-black';
        } else {
            turnIndicatorContainer.className = `turn-indicator-box ${currentPlayer === 'user' ? 'aura-yellow' : aiGlowClass}`;
        }
    }

    function updateResourceDisplay() {
        userResourceDisplay.textContent = userResourcePoints;
        aiResourceDisplay.textContent = aiResourcePoints;
    }

    function startTurn() {
        if (turnCount >= 6 && currentPhase === 'land') {
            currentPhase = 'unit';
            turnCount = 0;
            currentPlayer = currentPlayer === 'user' ? 'ai' : 'user';
        } else if (turnCount >= 6 && currentPhase === 'unit') {
            currentPhase = 'powerUp';
            turnCount = 0;
            currentPlayer = currentPlayer === 'user' ? 'ai' : 'user';
        } else if (turnCount >= 6 && currentPhase === 'powerUp') {
            currentPhase = 'civilization';
            turnCount = 0;
            currentPlayer = playerGoesFirst ? 'ai' : 'user';
        } else if (turnCount >= 4 && currentPhase === 'civilization') {
            if (lastPlayedCard && lastPlayedCard.name === 'Field') {
                revealCardsContainer.innerHTML = ''; // Clear remaining drawn cards
            }
            turnIndicator.textContent = 'Confrontation Phase';
            turnIndicatorContainer.className = 'turn-indicator-box aura-black';
            setTimeout(() => {
                disableMaskButton();
                flipAIFieldCards(0);
            }, 1500); // Start flipping AI cards with a delay
            return;
        }

        updateTurnIndicator();

        setTimeout(() => {
            revealCards(currentPlayer);
        }, 1500);
    }

    function revealCards(player) {
        revealCardsContainer.innerHTML = '';
        const deck = player === 'user' ? playerPiles[currentPhase] : aiPiles[currentPhase];

        if (!deck || deck.length < 3) {
            turnIndicator.textContent = 'Game Over';
            return;
        }

        const revealedCards = deck.splice(0, 3);

        revealedCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'reveal-card';
            cardElement.style.backgroundImage = `url('${card.image}')`;
            cardElement.dataset.type = card.type;
            cardElement.dataset.index = index;
            cardElement.dataset.resource = card.resource;
            cardElement.dataset.combat = card.combat;
            cardElement.dataset.rawResource = card.rawResource;
            cardElement.dataset.rawCombat = card.rawCombat;
            cardElement.dataset.status = [];
            cardElement.dataset.faction = JSON.stringify(card.faction || []);
            cardElement.dataset.placement = card.placement;
            cardElement.dataset.name = card.name;  // Ensure name is set
            cardElement.dataset.cardName = card.cardName;
            cardElement.dataset.effect = JSON.stringify(card.effect || []);
            revealCardsContainer.appendChild(cardElement);

            if (player === 'user') {
                cardElement.draggable = true;

                cardElement.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(card));
                });

                cardElement.addEventListener('click', () => {
                    if (card.name !== 'Field' && currentPhase === 'civilization') {
                        activateUserCard(card);
                    }
                });
            }
        });

        if (player === 'ai') {
            const nextButton = document.createElement('button');
            nextButton.id = 'next-button';
            nextButton.className = 'button-custom mt-6';
            nextButton.textContent = 'Next';
            nextButton.style.fontSize = '18px';
            nextButton.style.padding = '2px 24px';
            nextButton.style.position = 'absolute';
            nextButton.style.left = '48%';
            nextButton.style.transform = 'translateX(-50%)';
            nextButton.style.bottom = '-60px';
            nextButton.style.backgroundColor = '#CBC3E3';
            nextButton.style.color = 'black';
            nextButton.style.border = '3px solid black';
            nextButton.style.borderRadius = '5px';
            nextButton.style.transition = 'all 0.3s ease';

            nextButton.addEventListener('mouseover', () => {
                nextButton.style.backgroundColor = 'black';
                nextButton.style.color = '#CBC3E3';
            });

            nextButton.addEventListener('mouseout', () => {
                nextButton.style.backgroundColor = '#CBC3E3';
                nextButton.style.color = 'black';
            });

            revealCardsContainer.appendChild(nextButton);

            nextButton.addEventListener('click', () => {
                aiPlay(revealedCards);
                nextButton.remove();
            });
        }

        // Add mask button
        if (!maskButton) {
            maskButton = document.createElement('button');
            maskButton.id = 'mask-button';
            maskButton.className = 'button-custom mt-6';
            maskButton.textContent = 'Mask';
            maskButton.style.fontSize = '18px';
            maskButton.style.padding = '2px 24px';
            maskButton.style.position = 'absolute';
            maskButton.style.left = '14%';
            maskButton.style.transform = 'translateX(-50%)';
            maskButton.style.top = '10px';
            maskButton.style.backgroundColor = '#CBC3E3';
            maskButton.style.color = 'black';
            maskButton.style.border = '3px solid black';
            maskButton.style.borderRadius = '5px';
            maskButton.style.transition = 'all 0.3s ease';

            maskButton.addEventListener('mouseover', () => {
                if (!maskButton.disabled) {
                    maskButton.style.backgroundColor = 'black';
                    maskButton.style.color = '#CBC3E3';
                }
            });

            maskButton.addEventListener('mouseout', () => {
                if (!maskButton.disabled) {
                    maskButton.style.backgroundColor = '#CBC3E3';
                    maskButton.style.color = 'black';
                }
            });

            maskButton.addEventListener('click', () => {
                if (revealCardsContainer.style.display === 'none') {
                    revealCardsContainer.style.display = 'flex';
                    maskButton.textContent = 'Mask';
                    maskActive = false;  // Set maskActive to false
                } else {
                    revealCardsContainer.style.display = 'none';
                    maskButton.textContent = 'Unmask';
                    maskActive = true;  // Set maskActive to true
                }
            });

            document.body.appendChild(maskButton);
        }

        // Add fight button
        if (!fightButton) {
            fightButton = document.createElement('button');
            fightButton.id = 'fight-button';
            fightButton.className = 'button-custom mt-6';
            fightButton.textContent = 'Fight';
            fightButton.style.fontSize = '18px';
            fightButton.style.padding = '2px 24px';
            fightButton.style.position = 'absolute';
            fightButton.style.left = '50%';
            fightButton.style.transform = 'translateX(-50%)';
            fightButton.style.bottom = '5px';
            fightButton.style.borderRadius = '5px';
            fightButton.style.transition = 'all 0.3s ease';
            fightButton.style.backgroundColor = 'black';
            fightButton.style.color = '#CD5C5C';
            fightButton.style.border = '3px solid black';
            fightButton.disabled = true;
            fightButton.classList.add('button-disabled');
            fightButton.classList.remove('button-custom');

            fightButton.addEventListener('mouseover', () => {
                if (!fightButton.disabled) {
                    fightButton.style.backgroundColor = 'black';
                    fightButton.style.color = '#CD5C5C';
                }
            });

            fightButton.addEventListener('mouseout', () => {
                if (!fightButton.disabled) {
                    fightButton.style.backgroundColor = '#CD5C5C';
                    fightButton.style.color = 'black';
                }
            });


            fightButton.addEventListener('click', () => {
                if (!fightButton.disabled) {
                    fightButton.disabled = true;
                    fightButton.classList.add('button-disabled');
                    resolveCombat(currentZoneIndex);
                }
            });

            document.body.appendChild(fightButton);
        }

        updateResourceDisplay();
    }

    function disableMaskButton() {
        if (maskButton) {
            maskButton.disabled = true;
            maskButton.style.backgroundColor = 'grey';
            maskButton.style.color = 'white';
            maskButton.textContent = 'Mask';
            maskActive = false;

            // Remove current hovering over face-down AI cards
            opponentZones.forEach(zone => {
                zone.querySelectorAll('.placed-card').forEach(card => {
                    if (card.dataset.isFaceDown === 'true') {
                        card.removeEventListener('mouseover', showAICardChoices);
                        card.removeEventListener('mouseleave', hideAICardChoices);
                        const preview = card.querySelector('.ai-choices-preview');
                        if (preview) {
                            preview.remove();
                        }
                        card.style.backgroundImage = `url('${cardBacks[card.dataset.type]}')`;
                    }
                });
            });
        }
    }

    function aiPlay(cards) {
        const card = cards[Math.floor(Math.random() * cards.length)];
        lastPlayedCard = card;

        if (currentPhase === 'civilization') {
            revealCardsContainer.innerHTML = '';
            if (card.name === 'Field') {
                placeAICardOnField(card, false); // Place field card face up
            } else {
                activateAICard(card);
            }
        } else {
            const availableZones = Array.from(opponentZones).filter(zone => {
                const row = zone.querySelector(`.row[data-type="${card.type}"]`);
                return row && (card.type === 'power-up' || row.children.length === 0);
            });

            if (availableZones.length > 0) {
                const zoneIndex = Math.floor(Math.random() * availableZones.length);
                const zone = availableZones[zoneIndex];
                const row = zone.querySelector(`.row[data-type="${card.type}"]`);

                if (row) {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'placed-card';
                    cardElement.style.backgroundImage = `url('${cardBacks[card.type]}')`;
                    cardElement.style.backgroundSize = 'cover';
                    row.appendChild(cardElement);
                    cardElement.dataset.realImage = card.image; // Store the real image for later
                    cardElement.dataset.type = card.type;
                    cardElement.dataset.resource = card.resource;
                    cardElement.dataset.combat = card.combat;
                    cardElement.dataset.rawResource = card.rawResource;
                    cardElement.dataset.rawCombat = card.rawCombat;
                    cardElement.dataset.status = [];
                    cardElement.dataset.faction = JSON.stringify(card.faction || []);
                    cardElement.dataset.placement = card.placement;
                    cardElement.dataset.name = card.name;  // Ensure name is set
                    cardElement.dataset.effect = JSON.stringify(card.effect || []);
                    cardElement.dataset.aiChoices = JSON.stringify(cards); // Store AI choices
                    cardElement.dataset.cardName = card.cardName;
                    cardElement.dataset.isFaceDown = 'true'; // Set isFaceDown to true

                    cardElement.addEventListener('mouseover', showAICardChoices);
                    cardElement.addEventListener('mouseleave', hideAICardChoices);
                }
            }

            endTurn();
        }
    }

    function showAICardChoices(e) {
        if (!maskActive) return;  // Do nothing if mask is not active
        const cardElement = e.currentTarget;
        if (cardElement.dataset.isFaceDown === 'true') {
            const aiChoices = JSON.parse(cardElement.dataset.aiChoices);

            // Clear any existing choice previews
            const existingPreview = cardElement.querySelector('.ai-choices-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            // Create container for AI choices
            const choicesContainer = document.createElement('div');
            choicesContainer.className = 'ai-choices-preview';
            choicesContainer.style.display = 'flex';
            choicesContainer.style.justifyContent = 'center';
            choicesContainer.style.alignItems = 'center';
            choicesContainer.style.gap = '5px';
            choicesContainer.style.position = 'absolute';
            choicesContainer.style.top = '50%';
            choicesContainer.style.left = '50%';
            choicesContainer.style.transform = 'translate(-50%, -50%)';
            choicesContainer.style.zIndex = '40';
            choicesContainer.style.pointerEvents = 'none';

            // Create card previews
            aiChoices.forEach(choice => {
                const choiceElement = document.createElement('div');
                choiceElement.className = 'ai-choice-card';
                choiceElement.style.width = '82.5px';
                choiceElement.style.height = '112.5px';
                choiceElement.style.backgroundImage = `url('${choice.image}')`;
                choiceElement.style.backgroundSize = 'cover';
                choicesContainer.appendChild(choiceElement);
            });

            cardElement.style.backgroundImage = 'none';
            cardElement.appendChild(choicesContainer);
        }
    }

    function hideAICardChoices(e) {
        if (!maskActive) return;  // Do nothing if mask is not active
        const cardElement = e.currentTarget;
        if (cardElement.dataset.isFaceDown === 'true') {
            const preview = cardElement.querySelector('.ai-choices-preview');
            if (preview) {
                preview.remove();
            }
            cardElement.style.backgroundImage = `url('${cardBacks[cardElement.dataset.type]}')`;
        }
    }

    function addCardNumbers(cardElement) {
        const cardType = cardElement.dataset.type;
        const resourceValue = cardElement.dataset.resource;
        const combatValue = cardElement.dataset.combat;

        if (cardType === 'land') {
            const resourceCircle = document.createElement('div');
            resourceCircle.className = 'resource-circle';
            resourceCircle.textContent = resourceValue;
            cardElement.appendChild(resourceCircle);

            // Store a reference to the resource circle
            cardElement.resourceCircle = resourceCircle;
        } else if (cardType === 'unit') {
            const resourceCircle = document.createElement('div');
            resourceCircle.className = 'resource-circle';
            resourceCircle.textContent = resourceValue;
            cardElement.appendChild(resourceCircle);

            // Store a reference to the resource circle
            cardElement.resourceCircle = resourceCircle;

            const combatCircle = document.createElement('div');
            combatCircle.className = 'combat-circle';
            combatCircle.textContent = combatValue;
            cardElement.appendChild(combatCircle);

            // Store a reference to the combat circle
            cardElement.combatCircle = combatCircle;
        }
    }


    function placeAICardOnField(card, faceDown = true) {
        const availableZones = Array.from(opponentZones);
        const zoneIndex = Math.floor(Math.random() * availableZones.length);
        const zone = availableZones[zoneIndex];
        const row = zone.querySelector(`.row[data-type="land"]`);

        if (row) {
            const cardElement = document.createElement('div');
            cardElement.className = 'placed-card';
            cardElement.style.backgroundImage = `url('${faceDown ? cardBacks.land : card.image}')`;
            cardElement.style.backgroundSize = 'cover';
            row.appendChild(cardElement);
            if (faceDown) {
                cardElement.dataset.realImage = card.image;
                cardElement.dataset.isFaceDown = 'true';
            } else {
                cardElement.dataset.type = card.type;
                cardElement.dataset.resource = card.resource;
                cardElement.dataset.combat = card.combat;
                cardElement.dataset.rawResource = card.rawResource;
                cardElement.dataset.rawCombat = card.rawCombat;
                cardElement.dataset.status = [];
                cardElement.dataset.faction = JSON.stringify(card.faction || []);
                cardElement.dataset.placement = card.placement;
                cardElement.dataset.name = card.name;  // Ensure name is set
                cardElement.dataset.effect = JSON.stringify(card.effect || []);
                cardElement.dataset.cardName = card.cardName;
                cardElement.dataset.isFaceDown = 'false';
                addCardNumbers(cardElement);
            }
        }

        endTurn();
    }

    function activateAICard(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `placed-card ${aiGlowClass}`;
        cardElement.style.backgroundImage = `url('${card.image}')`;
        cardElement.style.backgroundSize = 'cover';
        revealCardsContainer.appendChild(cardElement);
        lastPlayedCard = card;
        cardElement.dataset.type = card.type;
        cardElement.dataset.resource = card.resource;
        cardElement.dataset.combat = card.combat;
        cardElement.dataset.rawResource = card.rawResource;
        cardElement.dataset.rawCombat = card.rawCombat;
        cardElement.dataset.status = [];
        cardElement.dataset.faction = JSON.stringify(card.faction || []);
        cardElement.dataset.placement = card.placement;
        cardElement.dataset.name = card.name;  // Ensure name is set
        cardElement.dataset.effect = JSON.stringify(card.effect || []);
        cardElement.dataset.cardName = card.cardName;
        cardElement.dataset.isFaceDown = 'false';
        if (card.type === 'civilization' && card.name !== 'Field') {
            cardElement.classList.add('big-card');
            const effects = JSON.parse(cardElement.dataset.effect || '[]');
            effects.forEach(function(effect) {
                effect.push('civilization');
                effect.push(2);
                if (effect[0] !== 'quick-use'){
                    //cardElement.dataset.effect = JSON.stringify(effects);
                    lastingCivilizationCards.push(effect);
                } // check if lasting
            });
        }
        addCardNumbers(cardElement);

        setTimeout(() => {
            revealCardsContainer.innerHTML = '';
            popupMessage.style.display = 'block';
            setTimeout(() => {
                popupMessage.style.display = 'none';
                cardElement.remove();
                endTurn();
            }, 1500);
        }, 1500);
    }

    function activateUserCard(card) {
        revealCardsContainer.innerHTML = '';
        const cardCopy = document.createElement('div');
        cardCopy.className = `placed-card glow`;
        cardCopy.style.backgroundImage = `url('${card.image}')`;
        cardCopy.style.backgroundSize = 'cover';
        revealCardsContainer.appendChild(cardCopy);
        lastPlayedCard = card;
        cardCopy.dataset.type = card.type;
        cardCopy.dataset.resource = card.resource;
        cardCopy.dataset.combat = card.combat;
        cardCopy.dataset.rawResource = card.rawResource;
        cardCopy.dataset.rawCombat = card.rawCombat;
        cardCopy.dataset.status = [];
        cardCopy.dataset.faction = JSON.stringify(card.faction || []);
        cardCopy.dataset.placement = card.placement;
        cardCopy.dataset.name = card.name;  // Ensure name is set
        cardCopy.dataset.effect = JSON.stringify(card.effect || []);
        cardCopy.dataset.cardName = card.cardName;
        cardCopy.dataset.isFaceDown = 'false';
        if (card.type === 'civilization' && card.name !== 'Field') {
            cardCopy.classList.add('big-card');
            const effects = JSON.parse(cardCopy.dataset.effect || '[]');
            effects.forEach(function(effect) {
                effect.push('civilization');
                effect.push(1);
                if ((effect[0] !== 'quick-use')){
                    //cardCopy.dataset.effect = JSON.stringify(effects);
                    lastingCivilizationCards.push(effect);
                } // check if lasting
            });
        }
        addCardNumbers(cardCopy);

        setTimeout(() => {
            popupMessage.style.display = 'block';
            setTimeout(() => {
                popupMessage.style.display = 'none';
                cardCopy.remove();
                endTurn();
            }, 1500);
        }, 1500);
    }

    function flipCardsSequentially(cards, index, callback) {
        if (index >= cards.length) {
            if (callback) callback();
            return;
        }
        const card = cards[index];
        if (!card.dataset.realImage) {
            // Skip flipping "Field" cards
            flipCardsSequentially(cards, index + 1, callback);
            return;
        }

        // Remove hover effect if the card is about to be flipped
        card.style.pointerEvents = 'none';

        setTimeout(() => {
            card.style.backgroundImage = `url('${card.dataset.realImage}')`;
            card.style.backgroundSize = 'cover';
            card.dataset.isFaceDown = 'false';
            addCardNumbers(card);
            card.style.pointerEvents = 'auto'; // Re-enable hover effect after flipping
            flipCardsSequentially(cards, index + 1, callback);
        }, 1000);
    }

    let currentZoneIndex = 0;

    function flipAIFieldCards(zoneIndex) {
        if (zoneIndex >= opponentZones.length) return; //here to add frozen effect
        currentZoneIndex = zoneIndex;
        const zone = opponentZones[zoneIndex];
        const landCards = zone.querySelectorAll('.row[data-type="land"] .placed-card');
        const unitCards = zone.querySelectorAll('.row[data-type="unit"] .placed-card');
        const powerUpCards = zone.querySelectorAll('.row[data-type="power-up"] .placed-card');

        flipCardsSequentially(Array.from(landCards), 0, () => {
            flipCardsSequentially(Array.from(unitCards), 0, () => {
                flipCardsSequentially(Array.from(powerUpCards), 0, () => {
                    // New here
                    preCombatCardEffects(zoneIndex);

                    fightButton.disabled = false;
                    fightButton.classList.remove('button-disabled');
                    fightButton.style.backgroundColor = '#CD5C5C';
                    fightButton.style.color = 'black';
                });
            });
        });
    }

    function resolveCombat(zoneIndex) {
        const userZone = userZones[zoneIndex];
        const opponentZone = opponentZones[zoneIndex];

        const userUnitCard = userZone.querySelector('.row[data-type="unit"] .placed-card');
        const opponentUnitCard = opponentZone.querySelector('.row[data-type="unit"] .placed-card');

        let userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.combat || 0, 10) : 0;
        let opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.combat || 0, 10) : 0;

        if (userZoneStatus[zoneIndex].includes('fightUsingResource'))
            userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.resource || 0, 10) : 0;
        if (opponentZoneStatus[zoneIndex].includes('fightUsingResource'))
            opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.resource || 0, 10) : 0;

        let zoneWinner = null;

        if (userUnitCombat > opponentUnitCombat) {
            greyOutZone(opponentZone);
            defeatedUnits.ai.push(opponentUnitCard);
            applyGlowToLand(opponentZone, 'user');
            zoneWinner = 'user';
        } else if (userUnitCombat < opponentUnitCombat) {
            greyOutZone(userZone);
            defeatedUnits.user.push(userUnitCard);
            applyGlowToLand(userZone, 'ai');
            zoneWinner = 'ai';
        } else {
            greyOutTie(userZone);
            greyOutTie(opponentZone);
            zoneWinner = 'tie';
        }

        calculateAndUpdateResourcePoints(userZone, opponentZone, zoneWinner);

        setTimeout(() => {
            if (zoneIndex + 1 < opponentZones.length) {
                flipAIFieldCards(zoneIndex + 1);
            } else {
                startResolutionPhase();
            }
        }, 1500);
    }

    function applyGlowToLand(zone, winner) {
        const landCards = zone.querySelectorAll('.row[data-type="land"] .placed-card');
        landCards.forEach(card => {
            card.classList.add(winner === 'user' ? 'glow' : aiGlowClass);
        });
    }

    function greyOutZone(zone) {
        zone.querySelectorAll('.placed-card').forEach(card => {
            if (card.dataset.type !== 'land') {
                card.style.filter = 'grayscale(100%)';
            }
        });
    }

    function greyOutTie(zone){
        zone.querySelectorAll('.placed-card').forEach(card => {
            if (card.dataset.type === 'land') {
                card.style.filter = 'grayscale(100%)';
            }
            if (card.dataset.type === 'civilization') {
                card.style.filter = 'grayscale(100%)';
            }
        });
    }

    function calculateAndUpdateResourcePoints(userZone, opponentZone, zoneWinner) {
        const userUnitCard = userZone.querySelector('.row[data-type="unit"] .placed-card');
        const opponentUnitCard = opponentZone.querySelector('.row[data-type="unit"] .placed-card');

        const userUnitResource = userUnitCard ? parseInt(userUnitCard.dataset.resource || 0, 10) : 0;
        const opponentUnitResource = opponentUnitCard ? parseInt(opponentUnitCard.dataset.resource || 0, 10) : 0;

        const userLandCards = userZone.querySelectorAll('.row[data-type="land"] .placed-card');
        const opponentLandCards = opponentZone.querySelectorAll('.row[data-type="land"] .placed-card');

        let userLandResource = 0;
        let opponentLandResource = 0;

        userLandCards.forEach(card => {
            userLandResource += parseInt(card.dataset.resource || 0, 10);
        });

        opponentLandCards.forEach(card => {
            opponentLandResource += parseInt(card.dataset.resource || 0, 10);
        });

        if (zoneWinner === 'user') {
            userResourcePoints += userUnitResource + opponentLandResource + userLandResource;
        } else if (zoneWinner === 'ai') {
            aiResourcePoints += opponentUnitResource + userLandResource +opponentLandResource;
        } else if (zoneWinner === 'tie') {
            userResourcePoints += userUnitResource;
            aiResourcePoints += opponentUnitResource;
        }

        updateResourceDisplay();
    }

    function startResolutionPhase() {
        turnIndicator.textContent = 'Resolution Phase';

        setTimeout(() => {
            if (userResourcePoints > aiResourcePoints) {
                endGame('user');
            } else if (userResourcePoints < aiResourcePoints) {
                endGame('ai');
            } else {
                endGame('draw');
            }
        }, 5000);
    }

    function endGame(winner) {
        const playerDeckName = JSON.parse(localStorage.getItem('selectedDeck')).name;
        const aiDeckName = JSON.parse(localStorage.getItem('selectedAI')).deck.name;
        localStorage.setItem('gameResult', JSON.stringify({
            winner,
            playerDeck: playerDeckName,
            aiDeck: aiDeckName
        }));
        window.location.href = 'endofgame.html';
    }

    function endTurn() {
        if (currentPhase === 'civilization') {
            if (turnCount === 0 && currentPlayer === (playerGoesFirst ? 'ai' : 'user')) {
                turnCount++;
                currentPlayer = playerGoesFirst ? 'user' : 'ai';
            } else if (turnCount === 1 && currentPlayer === (playerGoesFirst ? 'user' : 'ai')) {
                turnCount++;
            } else if (turnCount === 2 && currentPlayer === (playerGoesFirst ? 'user' : 'ai')) {
                turnCount++;
                currentPlayer = playerGoesFirst ? 'ai' : 'user';
            } else if (turnCount === 3 && currentPlayer === (playerGoesFirst ? 'ai' : 'user')) {
                turnCount++;
                if (lastPlayedCard && lastPlayedCard.name === 'Field') {
                    revealCardsContainer.innerHTML = ''; // Clear remaining drawn cards
                }
                turnIndicator.textContent = 'Confrontation Phase';
                turnIndicatorContainer.className = 'turn-indicator-box aura-black';
                setTimeout(() => {
                    disableMaskButton();
                    flipAIFieldCards(0);
                }, 1500); // Start flipping AI cards with a delay
                return;
            }
        } else {
            turnCount++;
            currentPlayer = currentPlayer === 'user' ? 'ai' : 'user';
        }

        revealCardsContainer.innerHTML = '';

        startTurn();
    }

    userZones.forEach((zone, zoneIndex) => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
            let row = zone.querySelector(`.row[data-type="${cardData.type}"]`);

            if (currentPhase === 'civilization' && cardData.name === 'Field') {
                row = zone.querySelector(`.row[data-type="land"]`);
            }

            const isZoneEmpty = currentPhase === 'powerUp' || (currentPhase === 'civilization' && cardData.name === 'Field') ? true : row && row.children.length === 0;

            if (isZoneEmpty) {
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('highlight');
            } else {
                e.dataTransfer.dropEffect = 'none';
            }
        });

        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.classList.remove('highlight');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('highlight');
            const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
            lastPlayedCard = cardData;

            if (currentPhase === 'civilization' && cardData.name !== 'Field') {
                activateUserCard(cardData);
            } else {
                let row = zone.querySelector(`.row[data-type="${cardData.type}"]`);

                if (currentPhase === 'civilization' && cardData.name === 'Field') {
                    row = zone.querySelector(`.row[data-type="land"]`);
                }

                const isZoneEmpty = currentPhase === 'powerUp' || (currentPhase === 'civilization' && cardData.name === 'Field') ? true : row && row.children.length === 0;

                if (isZoneEmpty) {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'placed-card';
                    cardElement.style.backgroundImage = `url('${cardData.image}')`;
                    cardElement.style.backgroundSize = 'cover';
                    row.appendChild(cardElement);
                    cardElement.dataset.type = cardData.type;
                    cardElement.dataset.resource = cardData.resource;
                    cardElement.dataset.combat = cardData.combat;
                    cardElement.dataset.name = cardData.name;  // Ensure name is set
                    cardElement.dataset.effect = JSON.stringify(cardData.effect || []);
                    cardElement.dataset.rawResource = cardData.rawResource;
                    cardElement.dataset.rawCombat = cardData.rawCombat;
                    cardElement.dataset.status = [];
                    cardElement.dataset.faction = JSON.stringify(cardData.faction || []);
                    cardElement.dataset.placement = cardData.placement;
                    cardElement.dataset.cardName = cardData.cardName;
                    cardElement.dataset.isFaceDown = 'false';
                    addCardNumbers(cardElement);
                    endTurn();
                }
            }
        });
    });

    opponentZones.forEach((zone) => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    });

    function updateCardValues(cardElement) {
        if (cardElement.resourceCircle) {
            cardElement.resourceCircle.textContent = cardElement.dataset.resource;
        }

        if (cardElement.combatCircle) {
            cardElement.combatCircle.textContent = cardElement.dataset.combat;
        }
    }

    let lastingCivilizationCards = [];


    let preventionNullificationChangeSwapEffectsTypeChangeReApply = [
        [],[],[],[], //lasting0
    ];

    let beforeConfrontationEffectsReApply = [
        [],[],[],[],
    ];

    let typeChangeEffectsReApply = [
        [],[],[],[], //lasting1
    ];

    let preventionStatChangeReApply = [
        [],[],[],[], //lasting2
    ];

    let ongoingEffectsReApply = [
        [],[],[],[], //lasting3
    ];

    let preventionNullificationChangeSwapEffectsTypeChange = [
        [],[],[],[], //lasting0
    ];

    let beforeConfrontationEffects = [
        [],[],[],[],
    ];

    let typeChangeEffects = [
        [],[],[],[], //lasting1
    ];

    let preventionStatChange = [
        [],[],[],[], //lasting2
    ];

    let ongoingEffects = [
        [],[],[],[], //lasting3
    ];

    function pushEffect(effect, type, userOrOpponent, effectArray, reapplyArray, zonesAffected) {
        // Create a deep copy of the original effect
        let effectCopy = JSON.parse(JSON.stringify(effect));
        effectCopy.push(type.toString());
        effectCopy.push(userOrOpponent);

        // Handle cases where the effect should be re-applied
        if (zonesAffected === 'all other' || zonesAffected === 'all other ally' || zonesAffected === 'all other opposing') {
            if (zonesAffected === 'all') effectCopy[1] = 'column';
            else if (zonesAffected === 'all other ally') effectCopy[1] = 'ally';
            else if (zonesAffected === 'all other opposing') effectCopy[1] = 'opposing';
            reapplyArray.push(effectCopy);
        } else if (zonesAffected === 'all' || zonesAffected === 'all ally' || zonesAffected === 'all opposing') {
            // Create a separate deep copy for the modification
            let modifiedEffect = JSON.parse(JSON.stringify(effect));
            if (zonesAffected === 'all') modifiedEffect[1] = 'column';
            else if (zonesAffected === 'all ally') modifiedEffect[1] = 'ally';
            else if (zonesAffected === 'all opposing') modifiedEffect[1] = 'opposing';
            modifiedEffect.push(type.toString());
            modifiedEffect.push(userOrOpponent);
            reapplyArray.push(modifiedEffect);

            // Add type and userOrOpponent to the original effect (separate copy)

            effectArray.push(effectCopy);
        } else {
            // For other cases, add type and userOrOpponent directly to the effectCopy

            effectArray.push(effectCopy);
        }
    }




    function handleCardEffects(cardElement, userOrOpponent) {
        const effects = JSON.parse(cardElement.dataset.effect || '[]');
        const status = JSON.parse(cardElement.dataset.status || '[]');
        const type = cardElement.dataset.type;

        if (!status.includes('nullifyActive')) {
            effects.forEach(function (effect) {
                const zonesAffected = effect[1];
                if (effect[0] === 'before_confrontation') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, beforeConfrontationEffects[0], beforeConfrontationEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, beforeConfrontationEffects[1], beforeConfrontationEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, beforeConfrontationEffects[2], beforeConfrontationEffectsReApply[2], zonesAffected);
                    }
                }

                if (effect[0] === 'ongoing') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, ongoingEffects[0], ongoingEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, ongoingEffects[1], ongoingEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, ongoingEffects[2], ongoingEffectsReApply[2], zonesAffected);
                    }
                }
            });
        }
    }

    function preCombatCardEffects(zoneIndex) {

        preventionNullificationChangeSwapEffectsTypeChange = preventionNullificationChangeSwapEffectsTypeChangeReApply.map(effect => JSON.parse(JSON.stringify(effect)));
        beforeConfrontationEffects = beforeConfrontationEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));
        typeChangeEffects = typeChangeEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));
        preventionStatChange = preventionStatChangeReApply.map(effect => JSON.parse(JSON.stringify(effect)));
        ongoingEffects = ongoingEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));


        const zone = userZones[zoneIndex];
        const cards = zone.querySelectorAll('.placed-card');
        cards.forEach(cardElement => handleCardEffects(cardElement, 1));

        const opponentZone = opponentZones[zoneIndex];
        const opponentCards = opponentZone.querySelectorAll('.placed-card');
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2));

        lastingCivilizationCards.forEach(function (cardEffect) {
            console.log(`Processing lasting civilization card effect:`, cardEffect);

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'lasting3') {
                ongoingEffects[3].push(effect);
            } else if (effect[0] === 'lasting2') {
                preventionStatChange[3].push(effect);
            } else if (effect[0] === 'lasting1') {
                typeChangeEffects[3].push(effect);
            } else {
                preventionNullificationChangeSwapEffectsTypeChange[3].push(cardEffect);
            }
        });


        console.log('Card effects to resolve before combat preventing nullification:', preventionNullificationChangeSwapEffectsTypeChange, preventionNullificationChangeSwapEffectsTypeChangeReApply);
        preventionNullificationChangeSwapEffectsTypeChange.forEach(effects => ResolveEffects(effects, zoneIndex));

        console.log('Card effects to resolve before confrontation:', beforeConfrontationEffects, beforeConfrontationEffectsReApply);
        beforeConfrontationEffects.forEach(effects => ResolveEffects(effects, zoneIndex));

        console.log('Card type-change effects to resolve:', typeChangeEffects, typeChangeEffectsReApply);
        typeChangeEffects.forEach(effects => ResolveEffects(effects, zoneIndex));

        console.log('Card effects preventing stat change to resolve:', preventionStatChange, preventionStatChangeReApply);
        preventionStatChange.forEach(effects => ResolveEffects(effects, zoneIndex));

        console.log('Ongoing card effects to resolve:', ongoingEffects, ongoingEffectsReApply);
        ongoingEffects.forEach(effects => ResolveEffects(effects, zoneIndex));


        // Now you can safely reset the original arrays without affecting the new ones
        preventionNullificationChangeSwapEffectsTypeChange = [[], [], [], []];
        beforeConfrontationEffects = [[], [], [], []];
        typeChangeEffects = [[], [], [], []];
        preventionStatChange = [[], [], [], []];
        ongoingEffects = [[], [], [], []];


    }



    function ResolveEffects(cardEffects, zoneIndex) {
        const zone = userZones[zoneIndex];
        const opponentZone = opponentZones[zoneIndex];


        for (let i = 0; i < cardEffects.length; i++) {
            const effect = cardEffects[i];

            const zonesAffected = effect[1];
            const requirement = effect[2];
            const typeOfEffect = effect[3];
            const param1 = effect[4];
            const userOrOpponent = effect[effect.length-1];
            const typeOfSourceCard = effect[effect.length-2];

            let userZonesToBeApplied = [];
            let opposingZonesToBeApplied = [];

            let opposingCombatValue;
            let opposingResourceValue;
            let allyCombatValue;
            let allyResourceValue;

            let numberOfAllyPowerUps = 0;
            let numberOfOpponentPowerUps = 0;

            let opposingUnitTypes;

            // Zones to Apply effects on
            if (userOrOpponent === 1) { // user effect
                opponentZone.querySelectorAll('.placed-card').forEach(card => {
                    if (card.dataset.type === 'unit'){
                        opposingCombatValue = parseInt(card.dataset.rawCombat, 10);
                        opposingResourceValue = parseInt(card.dataset.rawResource, 10);
                        opposingUnitTypes = JSON.parse(card.dataset.faction || '[]');
                    }
                    else if (card.dataset.type === 'power-up'){
                        numberOfOpponentPowerUps+=1;
                    }
                });

                zone.querySelectorAll('.placed-card').forEach(card => {
                    if (card.dataset.type === 'unit'){
                        allyCombatValue = parseInt(card.dataset.rawCombat, 10);
                        allyResourceValue = parseInt(card.dataset.rawResource, 10);
                    }
                    else if (card.dataset.type === 'power-up'){
                        numberOfAllyPowerUps+=1;
                    }
                });

                if (zonesAffected === 'column' || zonesAffected === 'all' || zonesAffected === 'all ally' || zonesAffected === 'ally') {
                    userZonesToBeApplied.push(zone);
                }
                if (zonesAffected === 'column' || zonesAffected === 'all' || zonesAffected === 'all opposing' || zonesAffected === 'opposing') {
                    opposingZonesToBeApplied.push(opponentZone);
                }
            }
            else { // opponent effect
                opponentZone.querySelectorAll('.placed-card').forEach(card => {
                    if (card.dataset.type === 'unit'){
                        allyCombatValue = parseInt(card.dataset.rawCombat, 10);
                        allyResourceValue = parseInt(card.dataset.rawResource, 10);
                    }
                    else if (card.dataset.type === 'power-up'){
                        numberOfAllyPowerUps+=1;
                    }
                });

                zone.querySelectorAll('.placed-card').forEach(card => {
                    if (card.dataset.type === 'unit'){
                        opposingCombatValue = parseInt(card.dataset.rawCombat, 10);
                        opposingResourceValue = parseInt(card.dataset.rawResource, 10);
                        opposingUnitTypes = JSON.parse(card.dataset.faction || '[]');
                    }
                    else if (card.dataset.type === 'power-up'){
                        numberOfOpponentPowerUps+=1;
                    }
                });

                if (zonesAffected === 'column' || zonesAffected === 'all' || zonesAffected === 'all opposing' || zonesAffected === 'opposing') {
                    opposingZonesToBeApplied.push(zone);
                }
                if (zonesAffected === 'column' || zonesAffected === 'all' || zonesAffected === 'all ally' || zonesAffected === 'ally') {
                    userZonesToBeApplied.push(opponentZone);
                }
            }


            // if 1 then user's card. if 2 then opponent's card
            if (typeOfEffect === 'modifyCombat'){
                if (requirement !== 'lowestCombatInZone' || (requirement === 'lowestCombatInZone' && (opposingCombatValue > allyCombatValue))) { // Sauriel effect
                    const param2 = effect[6]; // can be 'non'
                    const param3 = effect[7]; // optional name of card effect

                    let opponentNumber=2;
                    if (userOrOpponent === 2)
                        opponentNumber=1;

                    applyEffectToZones(userZonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3, typeOfSourceCard);
                    applyEffectToZones(opposingZonesToBeApplied, currentZoneIndex, opponentNumber, effect, requirement, param1, param2, param3, typeOfSourceCard);
                }
                function applyEffectToZones(zonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3, typeOfSourceCard) {

                    let [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, userOrOpponent);
                    let numberOfAllyPowerUps = AllyValues(currentZoneIndex, userOrOpponent);

                    console.log(`Effect applied: ${effect[effect.length - 3]} to ${userOrOpponent === 1 ? 'user' : 'opponent'}\n
                    OpposingCombatValue: ${opposingCombatValue}\nOpposingResourceValue: ${opposingResourceValue}\n
                    Number of opponent power-ups: ${numberOfOpponentPowerUps}\nNumber of ally power-ups: ${numberOfAllyPowerUps}`);

                    if (requirement === 'none' || requirement === 'lowestCombatInZone' ||
                        (param2 === 'none' && (opposingUnitTypes.includes(requirement) || opposingUnitTypes.includes('all'))) ||
                        (param2 === 'non' && !(opposingUnitTypes.includes(requirement) || opposingUnitTypes.includes('all')))) {

                        zonesToBeApplied.forEach(function (zoneToApply) {
                            UpdateCombatForZone(zoneToApply, opposingCombatValue, opposingResourceValue, effect[5], param1, param2, param3, numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard);
                        });
                    }
                }

            }
            else if (typeOfEffect === 'modifyResource'){

                if (requirement !== 'lowestResourceInZone' || (requirement === 'lowestResourceInZone' && (opposingResourceValue>allyResourceValue))) { // Artemis effect
                    const param2 = effect[6]; // can be 'non'
                    const param3 = effect[7]; // optional name of card effect

                    applyResourceEffectToZones(userZonesToBeApplied, currentZoneIndex, 1, effect, requirement, param1, param2, param3, typeOfSourceCard);
                    applyResourceEffectToZones(opposingZonesToBeApplied, currentZoneIndex, 2, effect, requirement, param1, param2, param3, typeOfSourceCard);
                }

                function applyResourceEffectToZones(zonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3, typeOfSourceCard) {
                    console.log(`Effect applied: ${effect[effect.length - 3]} to ${userOrOpponent === 1 ? 'user' : 'opponent'}`);

                    let [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, userOrOpponent);
                    let numberOfAllyPowerUps = AllyValues(currentZoneIndex, userOrOpponent);

                    if (requirement === 'none' || requirement === 'lowestResourceInZone' || (param2 === 'none' && (opposingUnitTypes.includes(requirement)||opposingUnitTypes.includes('all')))
                        || (param2 === 'non' && !(opposingUnitTypes.includes(requirement)||opposingUnitTypes.includes('all')))) {

                        zonesToBeApplied.forEach(function (zoneToApply) {
                            ModifyResourceForZone(zoneToApply, opposingCombatValue, opposingResourceValue, effect[5], param1, param2, param3, numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard);
                        });
                    }
                }

            }
            else if (typeOfEffect === 'modifyUnitType'){
                //const affected = effect[5];
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    ModifyUnitType(zoneToApply, param1);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    ModifyUnitType(zoneToApply, param1);
                });
            }
            else if (typeOfEffect === 'nullifyActive'){
                // param1 is type of card
                const affected = effect[5]; // faction
                const param2 = effect[6]; // confronting or not
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 1);

                    NullifyActive(zoneToApply, param1, affected, param2, opposingUnitTypes);
                });

                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 2);

                    NullifyActive(zoneToApply, param1, affected, param2, opposingUnitTypes);
                });
            }
            else if (typeOfEffect === 'nullifyDefeat'){
                // param1 is type of card
                const affected = effect[5]; // faction
                const param2 = effect[6]; // confronting or not
                userZonesToBeApplied.forEach(function (zoneToApply) {

                    [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 1);

                    NullifyDefeat(zoneToApply, param1, affected, param2, opposingUnitTypes);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {

                    [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 2);

                    NullifyDefeat(zoneToApply, param1, affected, param2, opposingUnitTypes);
                });
            }
            else if (typeOfEffect === 'preventIncrease'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventIncrease(zoneToApply, param1);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventIncrease(zoneToApply, param1);
                });
            }

            else if (typeOfEffect === 'preventDecrease'){

            }
            else if (typeOfEffect === 'preventChange'){

            }
            else if (typeOfEffect === 'preventTypeChange'){

            }
            else if (typeOfEffect === 'preventNullify'){

            }
            else if (typeOfEffect === 'swapEffect'){

            }
            else if (typeOfEffect === 'replaceEffect'){

            }
            else if (typeOfEffect === 'swapModifiers'){

            }
            else if (typeOfEffect === 'additionalEffect'){

            }
            else if (typeOfEffect === 'ancientSealEffect'){ // ancient seal

            }
            else if (typeOfEffect === 'modifyResourceCountDefeated'){

            }
            else if (typeOfEffect === 'applyResourceForCombat'){

            }
            else {
                console.log(`Effect not applied: ${effect[effect.length-3]}`);
            }
        }


    }


    function UpdateCombatForZone(zone, opposingCombatValue,opposingResourceValue, affected, param1, param2, param3,numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard) {
        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (affected === 'none' || cardFactions.includes(affected) ||
                cardFactions.includes('all') ||(!cardFactions.includes(affected) && param2 === 'non'))) {

                let combatValue = parseInt(card.dataset.combat, 10);
                if (param1 === 'highestInZone'){ // highest combat
                    if (param2 === 'none'){ // for the bee insect
                        console.log(`Stinger effect activate!`);
                        if (parseInt(card.dataset.rawCombat)>opposingCombatValue){
                            console.log(`Stinger here!`);
                            combatValue += parseInt(card.dataset.rawCombat, 10);
                        }
                        else {
                            console.log(`Stinger there!`);
                            combatValue += opposingCombatValue;
                        }
                    }
                    else { // for centurion
                        if (parseInt(card.dataset.rawCombat, 10)>opposingCombatValue){
                            console.log(`Centurion effect activate!`);
                            param2 = parseInt(param2, 10);
                            combatValue += param2;
                        }
                        else { //nothing
                            console.log(`Centurion effect did not apply!`);
                        }
                    }
                }
                else if (param1 === 'lowestInZone'){ // lowest combat
                    if (param2 === 'none'){ // for the bee insect
                        console.log(`Idk effect activate!`);
                        if (parseInt(card.dataset.rawCombat)<opposingCombatValue)
                            combatValue += parseInt(card.dataset.rawCombat, 10);
                        else {
                            combatValue += opposingCombatValue;
                        }
                    }
                    else {
                        console.log(`Birth and Genesis effect attempt to activate`);
                        if (parseInt(card.dataset.rawCombat, 10)<opposingCombatValue){
                            param2 = parseInt(param2, 10);
                            combatValue += param2;
                            console.log(`Birth and Genesis effect activate!`);
                        }
                        else { //nothing

                        }
                    }
                }
                else if (param1 === 'highestResourceInZone'){
                    console.log(`Nommad effect activate!`);
                    if (param2 === 'none'){
                        if (parseInt(card.dataset.rawResource)>=opposingResourceValue)
                            combatValue += parseInt(card.dataset.rawResource, 10);
                        else {
                            combatValue += opposingResourceValue;
                        }
                    }
                }
                else if (param1 === 'minusRawResourceFromSelf') {
                    console.log(`Antique effect activate!`);
                    combatValue -= parseInt(card.dataset.rawResource, 10);
                }
                else if (param1 === 'rawResourceFromSelf') {
                    console.log(`World Tree effect activate!`);
                    combatValue += parseInt(card.dataset.rawResource, 10);
                }
                else if (param1 === 'countPowerUp') { // counts on opponents
                    console.log(`Count opponent power-up effect activate!`);
                    param2 = parseInt(param2, 10);
                    combatValue += (param2 * numberOfOpponentPowerUps);
                }
                else if (param1 === 'Revelation'){
                    console.log(`Revelation effect activate!`);
                    combatValue -= card.dataset.rawCombat;
                }
                else if (param1 === 'countPowerUpAlly'){
                    param2 = parseInt(param2, 10);
                    if (param3 === 'Toe'){
                        console.log(`Toe and Plea effect activate!`);
                        if (numberOfAllyPowerUps === 1)
                            combatValue+=(param2);
                    }
                    else if (param3 === 'Radier'){
                        console.log(`Radier effect activate!`);
                        if (numberOfAllyPowerUps >= 1)
                            combatValue+=(param2);
                    }
                    else if (param3 === 'Unity'){
                        console.log(`Unity effect activate!`);
                        if (numberOfAllyPowerUps < 1)
                            combatValue+=(param2);
                    }
                    else {
                        combatValue+=(numberOfAllyPowerUps*param2);
                    }
                }
                else if (param2 === 'Dweller'){
                    console.log(`Dweller effect activate!`);
                    param1 = parseInt(param1, 10);
                    combatValue+=(param1);
                }
                else { // normal case, param1 is an int
                    console.log(`Given combat modifier effect activate!`);
                    param1 = parseInt(param1, 10);
                    combatValue += param1;
                }

                console.log(`Applying: a modifying combat effect, with \nparam1: ${param1}\nparam2: ${param2} 
                    \nprevious combat: ${card.dataset.combat}\nnew combat: ${combatValue}
                    \naffected: ${affected} \nto card: ${card.dataset.cardName} \nstatus: `, cardStatus);

                if (combatValue>card.dataset.combat &&
                    ((cardStatus.includes('preventIncreaseDescendant')  //prevents increase combat through these
                        || (cardStatus.includes('preventIncreaseLuna') && (typeOfSourceCard === 'land' || typeOfSourceCard === 'power-up'))
                        || (cardStatus.includes('preventIncreasePrayer') && (typeOfSourceCard === 'land'))
                        || (cardStatus.includes('preventIncreaseDuel') && (typeOfSourceCard === 'unit' || typeOfSourceCard === 'power-up'))))

                    || (combatValue<card.dataset.combat && cardStatus.includes('preventCombatDecrease'))){

                    console.log(`The change of combat was prevented!`);

                }

                else {
                    card.dataset.combat = combatValue.toString();
                    updateCardValues(card);
                }

            }
        });
    }
    function ModifyResourceForZone(zone, opposingCombatValue,opposingResourceValue, affected, param1, param2, param3, numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard){
        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (affected === 'none' || cardFactions.includes(affected) ||
                cardFactions.includes('all') || (!cardFactions.includes(affected) && param2 === 'non'))) {

                let resourceValue = parseInt(card.dataset.resource, 10);
                if (param1 === 'Yfrit'){
                    console.log(`Yfrit effect activate!`);
                    resourceValue+=opposingCombatValue;
                }
                else if (param1 === 'Organization'){
                    console.log(`Organization effect activate!`);
                    const rawCombat = parseInt(card.dataset.rawCombat, 10);
                    resourceValue+=rawCombat;
                }
                else if (param1 === 'countPowerUp'){
                    console.log(`Enchant effect activate!`);
                    param2 = parseInt(param2, 10);
                    resourceValue+=(numberOfOpponentPowerUps*param2);
                }
                else if (param1 === 'countPowerUpAlly'){
                    console.log(`Based on self power ups effect activate!`);
                    param2 = parseInt(param2, 10);
                    resourceValue+=(numberOfAllyPowerUps*param2);
                }
                else { // normal case, param1 is an int
                    console.log(`Given resource modifier effect activate!`);
                    param1 = parseInt(param1, 10);
                    resourceValue += param1;
                }

                console.log(`Applying: a modifying resource effect, with \nparam1: ${param1}\nparam2: ${param2} 
                    \nprevious resource: ${card.dataset.resource}\nnew resource: ${resourceValue}
                    \naffected: ${affected} \nto card: ${card.dataset.cardName} \nstatus: `, cardStatus);

                if ((resourceValue>card.dataset.resource && ((cardStatus.includes('preventIncreasePrayer') && (typeOfSourceCard === 'land'))
                        || cardStatus.includes('Fallen Nation') ))

                    || (resourceValue<card.dataset.resource && cardStatus.includes('preventResourceDecrease'))){

                    console.log(`The change of resource was prevented!`);
                }
                else {
                    card.dataset.resource = resourceValue.toString();
                    updateCardValues(card);
                }

            }
        });
    }
    function ModifyUnitType(zone, param1) {
        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardStatus = JSON.parse(card.dataset.status || '[]'); // Parse the status string into an array

            if (card.dataset.type === 'unit' && !cardStatus.includes('preventTypeChange')) {
                console.log(`Applying: a modifying type effect, with param1 ${param1} to ${card.dataset.cardName}`);
                console.log(`param1 type: ${typeof param1}`);

                let newType = [param1.toString()]; // Create an array with the string param1
                console.log(`type(s) was ${JSON.parse(card.dataset.faction)} and has become `, newType);

                card.dataset.faction = JSON.stringify(newType); // Store the new type back correctly as a JSON string
            }
        });
    }

    function NullifyActive(zone, param1, affected, param2, opposingUnitTypes){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            if (card.dataset.type === param1 && (affected === 'none' || cardFactions.includes('all')
                || cardFactions.includes(affected))&&(param2 === 'none' || (param2 === 'confronting' &&
                (opposingUnitTypes.includes(affected) || opposingUnitTypes.includes('all'))))) {
                if (!cardStatus.includes('preventNullifyActive')){
                    console.log(`Applying: a nullifying type effect to ${card.dataset.cardName}`);
                    cardStatus.push('nullifyActive');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
            }
        });
    }
    function NullifyDefeat(zone, param1, affected, param2, opposingUnitTypes){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            if (card.dataset.type === param1 && (affected === 'none' || cardFactions.includes('all')
                || cardFactions.includes(affected))&&(param2 === 'none' || (param2 === 'confronting' &&
                (opposingUnitTypes.includes(affected) || opposingUnitTypes.includes('all'))))) {
                if (!cardStatus.includes('preventNullifyDefeat')){
                    console.log(`Applying: a nullifying defeat type effect to ${card.dataset.cardName}`);
                    cardStatus.push('nullifyDefeat');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
            }
        });
    }

    function PreventIncrease(zone, param1){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit') {
                console.log(`Applying: a prevention increasing effect of ${param1} to ${card.dataset.cardName}`);
                if (param1 === 'Descendant'){
                    cardStatus.push('preventIncreaseDescendant');
                }
                else if (param1 === 'Luna'){
                    cardStatus.push('preventIncreaseLuna');
                }
                else if (param1 === 'Prayer'){
                    cardStatus.push('preventIncreasePrayer');
                }
                else if (param1 === 'Duel'){
                    cardStatus.push('preventIncreaseDuel');
                }
                else if (param1 === 'Fallen Nation'){
                    cardStatus.push('Fallen Nation');
                }

                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
        });
    }


    function OpposingValues(zoneIndex, userOrOpponent){
        let combat;
        let resource;
        let cardFactions;
        let powerUpCount = 0;
        let zone;
        if (userOrOpponent === 1){
            zone = opponentZones[zoneIndex];
        }
        else {
            zone = userZones[zoneIndex];
        }
        zone.querySelectorAll('.placed-card').forEach(card => {

            if (card.dataset.type === 'unit') {
                combat = card.dataset.rawCombat;
                resource = card.dataset.rawResource;
                cardFactions = JSON.parse(card.dataset.faction || '[]');

            }
            else if (card.dataset.type === 'power-up') {
                powerUpCount+=1;
            }

        });
        return [combat, resource, cardFactions, powerUpCount];
    }

    function AllyValues(zoneIndex, userOrOpponent){
        let powerUpCount = 0;
        let zone;
        if (userOrOpponent === 1){
            zone = userZones[zoneIndex];
        }
        else {
            zone = opponentZones[zoneIndex];
        }
        zone.querySelectorAll('.placed-card').forEach(card => {

            if (card.dataset.type === 'power-up') {
                powerUpCount+=1;
            }

        });
        return powerUpCount;
    }


    // When the user quits the page
    window.addEventListener('unload', function () {
        /*
        playerDeck.forEach(function(card) {
            card.dataset.combat = card.dataset.rawCombat;
            card.dataset.resource = card.dataset.rawResource;
            card.dataset.status = [];
        });
        aiDeck.forEach(function(card) {
            card.dataset.combat = card.dataset.rawCombat;
            card.dataset.resource = card.dataset.rawResource;
            card.dataset.status = [];
        });
        */

    });


    startTurn();
});
