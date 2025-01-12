history.replaceState(null, null, 'game.html'); // manages the history of the browser

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

    let lastOpponentCivilizationCard = null;  // Store the last played civilization card

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

    function calculateCardWeight(card, existingPlacements) {
        let weight = 1;
        
        // Add weight for non-basic faction cards
        if (card.faction && card.faction.length > 0 && !card.faction.includes('basic')) {
            weight += 1;
        }
        
        // Add weight for placement value if it's not already used (during land and unit phases)
        if ((currentPhase === 'land' || currentPhase === 'unit') && card.placement) {
            // Check if this placement position is already occupied
            const hasPlacementUsed = existingPlacements.includes(card.placement);
            if (!hasPlacementUsed) {
                weight += 2;
            }
        }
        
        return weight;
    }

    function weightedRandomChoice(cards) {
        // Get existing placements for the current phase
        const existingPlacements = Array.from(opponentZones).map(zone => {
            const row = zone.querySelector(`.row[data-type="${currentPhase}"]`);
            if (row && row.children.length > 0) {
                const card = row.children[0];
                return parseInt(card.dataset.placement);
            }
            return null;
        }).filter(placement => placement !== null);

        // Calculate weights for each card
        const weights = cards.map(card => calculateCardWeight(card, existingPlacements));
        
        // Calculate total weight
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        
        // Generate random value between 0 and total weight
        let random = Math.random() * totalWeight;
        
        // Choose card based on weights
        for (let i = 0; i < cards.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return cards[i];
            }
        }
        
        // Fallback to last card (shouldn't normally happen)
        return cards[cards.length - 1];
    }

    function getPreferredZone(card, availableZones) {
        if (!card.placement) return null;
        
        // Find the zone that matches the card's placement value (1, 2, or 3)
        const preferredZone = availableZones.find(zone => {
            const zoneIndex = Array.from(opponentZones).indexOf(zone);
            return zoneIndex === card.placement - 1;
        });
        
        return preferredZone;
    }

    function aiPlay(cards) {
        const card = weightedRandomChoice(cards);
        lastPlayedCard = card;

        if (currentPhase === 'civilization') {
            revealCardsContainer.innerHTML = '';
            if (card.name === 'Field') {
                // For Field cards, use the new placement logic
                const availableZones = Array.from(opponentZones);
                const preferredZone = getPreferredZone(card, availableZones);
                
                if (preferredZone && Math.random() < 0.8) {
                    placeAICardOnField(card, false, Array.from(opponentZones).indexOf(preferredZone));
                } else {
                    placeAICardOnField(card, false);
                }
            } else {
                activateAICard(card);
            }
        } else {
            const availableZones = Array.from(opponentZones).filter(zone => {
                const row = zone.querySelector(`.row[data-type="${card.type}"]`);
                return row && (card.type === 'power-up' || row.children.length === 0);
            });

            if (availableZones.length > 0) {
                let selectedZone;
                const preferredZone = getPreferredZone(card, availableZones);

                // 85% chance to use preferred zone if available
                if (preferredZone && Math.random() < 0.85) {
                    selectedZone = preferredZone;
                } else {
                    // Random zone if no preferred zone or 15% chance
                    const zoneIndex = Math.floor(Math.random() * availableZones.length);
                    selectedZone = availableZones[zoneIndex];
                }

                const row = selectedZone.querySelector(`.row[data-type="${card.type}"]`);
                // Rest of the card placement code remains the same
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


    function placeAICardOnField(card, faceDown = true, specificZoneIndex = null) {
        const availableZones = Array.from(opponentZones);
        const zoneIndex = specificZoneIndex !== null ? specificZoneIndex : Math.floor(Math.random() * availableZones.length);
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
                    lastingCivilizationCards.push(effect);
                    setTimeout(() => {
                        revealCardsContainer.innerHTML = '';
                        popupMessage.style.display = 'block';
                        setTimeout(() => {
                            popupMessage.style.display = 'none';
                            cardElement.remove();
                            if (turnCount === 0  || turnCount === 2)
                                lastOpponentCivilizationCard = card;
                            endTurn();
                        }, 1500);
                    }, 1500);
                }
                else{
                    ActivateCivilizationCards(effect, card.cardName, () => {
                        // Once the effect is fully resolved, remove the card and then end the turn
                        setTimeout(() => {
                            cardElement.remove();
                            if (turnCount === 0  || turnCount === 2)
                                lastOpponentCivilizationCard = card;
                            endTurn();
                        }, 1500);
                    });
                }
            });
        }
        else {
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
            effects.forEach(function (effect) {
                effect.push('civilization');
                effect.push(1);
                if (effect[0] !== 'quick-use') {
                    lastingCivilizationCards.push(effect);
                    //addCardNumbers(cardCopy);
                    setTimeout(() => {
                        popupMessage.style.display = 'block';
                        setTimeout(() => {
                            popupMessage.style.display = 'none';
                            cardCopy.remove();
                            if (turnCount === 0  || turnCount === 2)
                                lastOpponentCivilizationCard = card;
                            endTurn();
                        }, 1500);
                    }, 1500);
                } else {
                    ActivateCivilizationCards(effect, card.cardName, () => {
                        // Once the effect is fully resolved, remove the card and then end the turn
                        setTimeout(() => {
                            cardCopy.remove();
                            if (turnCount === 0  || turnCount === 2)
                                lastOpponentCivilizationCard = card;
                            endTurn();
                        }, 1500);
                    });
                }
            });
        } else {
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
    }

    function ActivateCivilizationCards(effect, cardName, callback) {
        console.log(`Processing quick-use civilization card effect for: ${cardName}`);

        if (cardName === "Nature's Judgement") {
            handleNaturesJudgement(callback);
        } else if (cardName === "Formation") {
            handleFormation(callback);
        } else if (cardName === "Tale") {
            handleTale(callback);
        } else if (cardName === "Assemble") {
            handleAssemble(callback);
        } else {
            console.log(`No action for the card: ${cardName}`);
            callback();  // No effect to process, directly call the callback to end the turn
        }
    }

    function handleTale(callback) {
        const friendlyZones = currentPlayer === 'user' ? userZones : opponentZones;
        let eligibleUnits = [];

        // Find all units with 0 power-ups
        friendlyZones.forEach(zone => {
            const unitRows = zone.querySelectorAll('.row[data-type="unit"]');

            unitRows.forEach(unitRow => {
                unitRow.querySelectorAll('.placed-card').forEach(unitCard => {
                    if (unitCard.dataset.type === 'unit') {
                        const powerUpRow = unitRow.closest('.zone').querySelector('.row[data-type="power-up"]');
                        const powerUps = powerUpRow.querySelectorAll('.placed-card');
                        const powerUpCount = powerUps.length;

                        if (powerUpCount === 0) {
                            eligibleUnits.push({ unit: unitCard, powerUpCount });
                        }
                    }
                });
            });
        });

        if (eligibleUnits.length === 0) {
            console.log("No eligible units without power-ups.");
            callback();  // No units to affect, directly call the callback
            return;
        }

        if (currentPlayer === 'user') {
            // Highlight eligible units for the user to select
            console.log("Prompting user to select a unit without any power-ups.");
            eligibleUnits.forEach(({ unit }) => {
                unit.classList.add('glow');
                unit.addEventListener('click', function handleClick() {
                    if (unit.dataset.type === 'unit') {
                        eligibleUnits.forEach(({ unit }) => {
                            unit.classList.remove('glow');
                            unit.style.pointerEvents = 'none'; // Disable further interactions for all units
                            unit.removeEventListener('click', handleClick);
                        });
                        moveOnePowerUpAtATime(unit, friendlyZones, () => {
                            // Re-enable hover effect for all units after the effect ends
                            eligibleUnits.forEach(({ unit }) => {
                                unit.style.pointerEvents = 'auto'; // Re-enable pointer events for hover and interactions
                            });
                            callback(); // Call the callback after re-enabling hover
                        });
                    }
                });
            });

        } else if (currentPlayer === 'ai') {
            // AI randomly selects a unit without any power-ups and attaches two power-ups
            console.log("AI selecting a unit without any power-ups to attach power-ups.");
            const selectedUnit = eligibleUnits[Math.floor(Math.random() * eligibleUnits.length)].unit;
            moveTwoPowerUpsToUnit(selectedUnit, friendlyZones, () => {
                // Re-enable hover effect for all units after the effect ends
                eligibleUnits.forEach(({ unit }) => {
                    unit.style.pointerEvents = 'auto'; // Re-enable pointer events for hover and interactions
                });
                callback(); // Call the callback after re-enabling hover
            });
        }
    }

    function moveOnePowerUpAtATime(targetUnit, zones, callback) {
        console.log(`Moving one power-up at a time to unit: ${targetUnit.dataset.cardName}`);

        let powerUpsToMove = 2;
        let moveCompleted = false; // Flag to track if the move is completed

        const handleClick = function(card) {
            return function() {
                if (moveCompleted) return; // Prevent further actions if move is completed

                const targetRow = targetUnit.closest('.zone').querySelector(`[data-type="power-up"]`);
                if (!targetRow.contains(card)) { // Check if card is not already in the target row
                    targetRow.appendChild(card);
                    card.classList.remove('glow');
                    card.classList.add('disabled'); // Disable further interactions
                    card.style.pointerEvents = 'none'; // Disable further interactions
                    card.removeEventListener('click', handleClick); // Remove the event listener
                    powerUpsToMove--;

                    console.log(`Moved power-up to ${targetUnit.dataset.cardName}`);

                    if (powerUpsToMove <= 0) {
                        moveCompleted = true; // Set the move as completed
                        // After moving the second power-up, reset remaining power-ups to their original state
                        zones.forEach(zone => {
                            zone.querySelectorAll('.row[data-type="power-up"] .placed-card').forEach(remainingCard => {
                                remainingCard.classList.remove('glow');
                                remainingCard.style.pointerEvents = 'auto'; // Re-enable interactions for future effects
                                remainingCard.removeEventListener('click', handleClick); // Properly remove the event listener
                            });
                        });
                        callback();  // Effect resolved, now call the callback to end the turn
                    }
                }
            };
        };

        zones.forEach(zone => {
            zone.querySelectorAll('.row[data-type="power-up"] .placed-card').forEach(card => {
                card.classList.add('glow');
                card.addEventListener('click', handleClick(card));
            });
        });
    }

    function moveTwoPowerUpsToUnit(targetUnit, zones, callback) {
        console.log(`Moving two power-ups to unit: ${targetUnit.dataset.cardName}`);

        let movedPowerUps = 0;
        zones.forEach(zone => {
            if (movedPowerUps < 2) {
                const powerUpRow = zone.querySelector('.row[data-type="power-up"]');
                powerUpRow.querySelectorAll('.placed-card').forEach(card => {
                    if (card !== targetUnit && movedPowerUps < 2 && !card.classList.contains('disabled')) {
                        const targetRow = targetUnit.closest('.zone').querySelector(`[data-type="power-up"]`);
                        targetRow.appendChild(card);
                        card.classList.add('disabled'); // Disable further interactions after moving
                        card.style.pointerEvents = 'none'; // Disable further interactions after moving
                        card.removeEventListener('click', handleClick); // Properly remove the event listener
                        movedPowerUps++;
                        console.log(`Moved power-up to ${targetUnit.dataset.cardName}`);
                    }
                });
            }
        });

        // Ensure callback is called only after both power-ups have been moved
        setTimeout(() => {
            callback();  // Effect resolved, now call the callback to end the turn
        }, 500 * movedPowerUps);  // Delay callback based on number of power-ups moved
    }





    function handleAssemble(callback) {
        if (!lastOpponentCivilizationCard) {
            console.log("No civilization card to copy.");
            callback();  // No card to copy, directly call the callback
            return;
        }

        console.log(`Assemble is copying the effect of: ${lastOpponentCivilizationCard.name}`);

        // Copy the last civilization card's effect
        const copiedCard = { ...lastOpponentCivilizationCard };
        copiedCard.image = lastOpponentCivilizationCard.image;

        // Simulate playing the copied card
        const cardElement = document.createElement('div');
        cardElement.className = 'placed-card glow';
        cardElement.style.backgroundImage = `url('${copiedCard.image}')`;
        cardElement.style.backgroundSize = 'cover';

        revealCardsContainer.appendChild(cardElement);

        setTimeout(() => {
            // Activate the copied card's effect
            ActivateCivilizationCards(copiedCard.effect, copiedCard.cardName, () => {
                setTimeout(() => {
                    cardElement.remove();
                    callback();  // Effect resolved, now call the callback to end the turn
                }, 1500);
            });
        }, 1500);
    }


    function handleNaturesJudgement(callback) {
        const allZones = [...userZones, ...opponentZones];
        let fieldCards = [];

        allZones.forEach(zone => {
            zone.querySelectorAll('.placed-card').forEach(card => {
                if (card.dataset.type === 'civilization' && card.dataset.name === 'Field') {
                    fieldCards.push(card);
                }
            });
        });

        if (fieldCards.length === 0) {
            console.log("No field cards available to remove.");
            callback();  // No field cards to remove, directly call the callback
            return;
        }

        if (currentPlayer === 'user') {
            console.log("Prompting user to select a field card to remove.");
            fieldCards.forEach(card => {
                card.classList.add('glow');
                card.addEventListener('click', function handleClick() {
                    card.remove();
                    console.log(`User removed field card: ${card.dataset.cardName}`);
                    fieldCards.forEach(c => c.classList.remove('glow'));
                    card.removeEventListener('click', handleClick);  // Clean up the event listener
                    callback();  // Effect resolved, now call the callback to end the turn
                });
            });
        } else if (currentPlayer === 'ai') {
            console.log("AI selecting a field card to remove.");
            const opposingFieldCards = fieldCards.filter(card => card.closest('.user-zone'));

            let cardToRemove;
            if (opposingFieldCards.length > 0) {
                cardToRemove = opposingFieldCards[Math.floor(Math.random() * opposingFieldCards.length)];
            } else {
                cardToRemove = fieldCards[Math.floor(Math.random() * fieldCards.length)];
            }

            cardToRemove.remove();
            console.log(`AI removed field card: ${cardToRemove.dataset.cardName}`);
            setTimeout(() => {
                callback();  // Effect resolved, now call the callback to end the turn
            }, 1000);  // Optional delay to visualize the AI's action
        }
    }

    function handleFormation(callback) {
        const opposingZones = currentPlayer === 'user' ? opponentZones : userZones;
        let eligibleUnits = [];

        // Find all units with exactly 1 or 2 power-ups
        opposingZones.forEach(zone => {
            const unitRows = zone.querySelectorAll('.row[data-type="unit"]');

            unitRows.forEach(unitRow => {
                unitRow.querySelectorAll('.placed-card').forEach(unitCard => {
                    if (unitCard.dataset.type === 'unit') {
                        const powerUpRow = unitRow.closest('.zone').querySelector('.row[data-type="power-up"]');
                        const powerUps = powerUpRow.querySelectorAll('.placed-card');
                        const powerUpCount = powerUps.length;

                        if (powerUpCount >= 1 && powerUpCount <= 2) {
                            eligibleUnits.push(unitCard);
                        }
                    }
                });
            });
        });

        if (eligibleUnits.length === 0) {
            console.log("No eligible units with 1 or 2 power-ups.");
            callback();  // No units to affect, directly call the callback
            return;
        }

        if (currentPlayer === 'user') {
            // Highlight eligible units for the user to select
            console.log("Prompting user to select a unit with 1 or 2 power-ups.");
            eligibleUnits.forEach(card => {
                card.classList.add('glow');
                card.addEventListener('click', function handleClick() {
                    movePowerUpsToSelectedUnit(card, opposingZones);
                    eligibleUnits.forEach(c => c.classList.remove('glow'));
                    card.removeEventListener('click', handleClick);  // Clean up the event listener
                    callback();  // Effect resolved, now call the callback to end the turn
                });
            });
        } else if (currentPlayer === 'ai') {
            // AI randomly selects a unit
            console.log("AI selecting a unit with 1 or 2 power-ups to enhance.");
            const selectedUnit = eligibleUnits[Math.floor(Math.random() * eligibleUnits.length)];
            movePowerUpsToSelectedUnit(selectedUnit, opposingZones);
            setTimeout(() => {
                callback();  // Effect resolved, now call the callback to end the turn
            }, 1000);  // Optional delay to visualize the AI's action
        }
    }

    function movePowerUpsToSelectedUnit(targetUnit, zones) {
        console.log(`Moving power-ups to unit: ${targetUnit.dataset.cardName}`);

        zones.forEach(zone => {
            zone.querySelectorAll('.placed-card').forEach(card => {
                if (card !== targetUnit && card.dataset.type === 'power-up') {
                    const targetRow = targetUnit.closest('.zone').querySelector(`[data-type="power-up"]`);
                    targetRow.appendChild(card);
                    console.log(`Moved power-up to ${targetUnit.dataset.cardName}`);
                }
            });
        });
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

        flipCardsSequentially(Array.from(unitCards), 0, () => {
            flipCardsSequentially(Array.from(landCards), 0, () => {
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
        const userUnitStatus = JSON.parse(userUnitCard.dataset.status || '[]');
        const opponentUnitStatus = JSON.parse(opponentUnitCard.dataset.status || '[]');

        let userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.combat || 0, 10) : 0;
        let opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.combat || 0, 10) : 0;


        if (userUnitStatus.includes('applyResourceConfrontation'))
        {
            if (userUnitStatus.includes('applyRawForConfrontation'))
                userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.rawResource || 0, 10) : 0;

            else
                userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.resource || 0, 10) : 0;
        }
        else if (userUnitStatus.includes('applyRawForConfrontation'))
            userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.rawCombat || 0, 10) : 0;

        if (opponentUnitStatus.includes('applyResourceConfrontation'))
        {
            if (opponentUnitStatus.includes('applyRawForConfrontation'))
                opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.rawResource || 0, 10) : 0;
            else
                opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.resource || 0, 10) : 0;
        }
        else if (opponentUnitStatus.includes('applyRawForConfrontation'))
            opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.rawCombat || 0, 10) : 0;

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

        ifDefeatsCardEffects(zoneIndex, zoneWinner);

        ifDefeatedCardEffects(zoneIndex, zoneWinner);

        reApplyOngoingEffects(zoneWinner);

        calculateAndUpdateResourcePoints(userZone, opponentZone, zoneWinner);

        setTimeout(() => {
            if (zoneIndex + 1 < opponentZones.length) {
                flipAIFieldCards(zoneIndex + 1);
            } else {
                startResolutionPhase();
            }
        }, 1500);
    }

    function reApplyOngoingEffects(zoneWinner){
        let ongoingUser=true;
        let ongoingOpponent=true;
        let userOrOpponent = 2;

        if (zoneWinner === 'user'){
            ongoingOpponent = false;
            userOrOpponent = 1;
        }
        else if (zoneWinner === 'ai'){
            ongoingUser = false;
        }
        if (ongoingUser){
            userZones[currentZoneIndex].querySelectorAll('.placed-card').forEach(card => {
                let cardEffect = JSON.parse(card.dataset.effect || '[]');
                if (card.dataset.type === 'unit') {
                    if (cardEffect[4] === 'Horus'){
                        console.log(`Reapplying: effect of ${card.dataset.cardName}`);
                        let addEffect = ['preventNullificationChangeSwap','column','none','preventNull','nullify','nullifyDefeat','none','While this unit is active, ALL units cannot have their abilities nullified (this ability continues to apply after confrontation)','other unit',userOrOpponent]
                        preventionStatChangeEffectsReApply[0].push(addEffect);
                    }
                }
                if (card.dataset.type === 'power-up'){
                    if (cardEffect[6] === 'Necrosis'){
                        console.log(`Reapplying: effect of ${card.dataset.cardName}`);
                        let addEffect = ['statChange','opposing','none','modifyCombat',-2,'undead','none','ALL opposing undead units receive -2 combat while the attached unit is active','power-up',userOrOpponent];
                        let addSecondEffect = ['statChange','opposing','none','modifyResource',-2,'undead','none','ALL opposing undead units receive -2 resource while the attached unit is active','power-up',userOrOpponent];
                        statChangeEffectsReApply[2].push(addEffect);
                        statChangeEffectsReApply[2].push(addSecondEffect);
                    }
                    else if (cardEffect[6] === 'Lost Arts'){
                        console.log(`Reapplying: effect of ${card.dataset.cardName}`);
                        let addEffect = ['preventStatChange','column','none','nullifyDefeat','none','none','none','While the attached unit is active, ALL units cannot use abilities upon defeat','power-up',userOrOpponent];
                        preventionStatChangeEffectsReApply[2].push(addEffect);
                    }
                }
            });
        }
        if (ongoingOpponent){
            opponentZones[currentZoneIndex].querySelectorAll('.placed-card').forEach(card => {
                let cardEffect = JSON.parse(card.dataset.effect || '[]');
                if (card.dataset.type === 'unit') {

                }
                if (card.dataset.type === 'power-up'){
                    if (cardEffect[6] === 'Necrosis'){
                        console.log(`Reapplying: effect of ${card.dataset.cardName}`);
                        let addEffect = ['statChange','opposing','none','modifyCombat',-2,'undead','none','ALL opposing undead units receive -2 combat while the attached unit is active','power-up',2];
                        let addSecondEffect = ['statChange','opposing','none','modifyResource',-2,'undead','none','ALL opposing undead units receive -2 resource while the attached unit is active','power-up',2];
                        statChangeEffectsReApply.push(addEffect);
                        statChangeEffectsReApply.push(addSecondEffect);
                    }
                }
            });
        }


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


    let preventionNullificationChangeSwapEffectsReApply= [
        [],[],[],[],
    ];

    let nullificationChangeSwapEffectsReApply= [
        [],[],[],[],
    ];

    let preventionTypeChangeEffectsReApply = [
        [],[],[],[],
    ];

    let typeChangeEffectsReApply = [
        [],[],[],[],
    ];

    let preventionStatChangeEffectsReApply = [
        [],[],[],[],
    ];

    let statChangeEffectsReApply = [
        [],[],[],[],
    ];


    let preventionNullificationChangeSwapEffects= [
        [],[],[],[],
    ];

    let nullificationChangeSwapEffects= [
        [],[],[],[],
    ];

    let preventionTypeChangeEffects = [
        [],[],[],[],
    ];

    let typeChangeEffects = [
        [],[],[],[],
    ];

    let preventionStatChangeEffects = [
        [],[],[],[],
    ]; // and other preventing effects similar to preventing ongoing or effects doubling boosts

    let statChangeEffects = [
        [],[],[],[],
    ]; // and other effects that would be similar to ongoing

    function pushEffect(effect, type, userOrOpponent, effectArray, reapplyArray, zonesAffected) {
        // Create a deep copy of the original effect
        let effectCopy = JSON.parse(JSON.stringify(effect));
        if (type === 'unit')
            effectCopy.push('other unit');
        else
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

    function handleCardEffects(cardElement, userOrOpponent, timing) {
        const effects = JSON.parse(cardElement.dataset.effect || '[]');
        const status = JSON.parse(cardElement.dataset.status || '[]');
        const type = cardElement.dataset.type;

        if (!status.includes('nullifyActive')) {
            effects.forEach(function (effect) {
                const zonesAffected = effect[1];
                if (effect[0] === 'preventNullificationChangeSwap' && timing === 'preventNullificationChangeSwap') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, preventionNullificationChangeSwapEffects[0], preventionNullificationChangeSwapEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, preventionNullificationChangeSwapEffects[1], preventionNullificationChangeSwapEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, preventionNullificationChangeSwapEffects[2], preventionNullificationChangeSwapEffectsReApply[2], zonesAffected);
                    }
                }
                else if (effect[0] === 'nullificationChangeSwap' && timing === 'nullificationChangeSwap') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, nullificationChangeSwapEffects[0], nullificationChangeSwapEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, nullificationChangeSwapEffects[1], nullificationChangeSwapEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, nullificationChangeSwapEffects[2], nullificationChangeSwapEffectsReApply[2], zonesAffected);
                    }
                }
                else if (effect[0] === 'preventTypeChange' && timing === 'preventTypeChange') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, preventionTypeChangeEffects[0], preventionTypeChangeEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, preventionTypeChangeEffects[1], preventionTypeChangeEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, preventionTypeChangeEffects[2], preventionTypeChangeEffectsReApply[2], zonesAffected);
                    }
                }
                else if (effect[0] === 'typeChange' && timing === 'typeChange') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, typeChangeEffects[0], typeChangeEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, typeChangeEffects[1], typeChangeEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, typeChangeEffects[2], typeChangeEffectsReApply[2], zonesAffected);
                    }
                }
                else if (effect[0] === 'preventStatChange' && timing === 'preventStatChange') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, preventionStatChangeEffects[0], preventionStatChangeEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, preventionStatChangeEffects[1], preventionStatChangeEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, preventionStatChangeEffects[2], preventionStatChangeEffectsReApply[2], zonesAffected);
                    }
                }
                else if (effect[0] === 'statChange' && timing === 'statChange') {
                    if (type === 'unit') {
                        pushEffect(effect, type, userOrOpponent, statChangeEffects[0], statChangeEffectsReApply[0], zonesAffected);
                    } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                        pushEffect(effect, type, userOrOpponent, statChangeEffects[1], statChangeEffectsReApply[1], zonesAffected);
                    } else if (type === 'power-up') {
                        pushEffect(effect, type, userOrOpponent, statChangeEffects[2], statChangeEffectsReApply[2], zonesAffected);
                    }
                }

            });
        }
        else {
            console.log(`The effect of ${cardElement.dataset.cardName} was nullified`);
        }
    }

    function preCombatCardEffects(zoneIndex) {

        preventionNullificationChangeSwapEffects = preventionNullificationChangeSwapEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));


        const zone = userZones[zoneIndex];
        const cards = zone.querySelectorAll('.placed-card');
        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'preventNullificationChangeSwap'));

        const opponentZone = opponentZones[zoneIndex];
        const opponentCards = opponentZone.querySelectorAll('.placed-card');
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'preventNullificationChangeSwap'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'preventNullificationChangeSwap'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                preventionNullificationChangeSwapEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat preventing nullification and changing or swaping effects:', preventionNullificationChangeSwapEffects, preventionNullificationChangeSwapEffectsReApply);
        preventionNullificationChangeSwapEffects.forEach(effects => ResolveEffects(effects, zoneIndex));







        nullificationChangeSwapEffects = nullificationChangeSwapEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));

        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'nullificationChangeSwap'));
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'nullificationChangeSwap'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'nullificationChangeSwap'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                nullificationChangeSwapEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat nullifying, changing or swaping effects:', nullificationChangeSwapEffects, nullificationChangeSwapEffectsReApply);
        nullificationChangeSwapEffects.forEach(effects => ResolveEffects(effects, zoneIndex));







        preventionTypeChangeEffects = preventionTypeChangeEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));

        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'preventTypeChange'));
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'preventTypeChange'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'preventTypeChange'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                preventionTypeChangeEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat preventing type change effects:', preventionTypeChangeEffects, preventionTypeChangeEffectsReApply);
        preventionTypeChangeEffects.forEach(effects => ResolveEffects(effects, zoneIndex));








        typeChangeEffects = typeChangeEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));

        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'typeChange'));
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'typeChange'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'typeChange'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                typeChangeEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat changing card factions:', typeChangeEffects, typeChangeEffectsReApply);
        typeChangeEffects.forEach(effects => ResolveEffects(effects, zoneIndex));








        preventionStatChangeEffects = preventionStatChangeEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));

        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'preventStatChange'));
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'preventStatChange'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'preventStatChange'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                preventionStatChangeEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat preventing stat change effects:', preventionStatChangeEffects, preventionStatChangeEffectsReApply);
        preventionStatChangeEffects.forEach(effects => ResolveEffects(effects, zoneIndex));







        statChangeEffects = statChangeEffectsReApply.map(effect => JSON.parse(JSON.stringify(effect)));

        cards.forEach(cardElement => handleCardEffects(cardElement, 1, 'statChange'));
        opponentCards.forEach(cardElement => handleCardEffects(cardElement, 2, 'statChange'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'statChange'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                statChangeEffects[3].push(effect);
            }

        });

        console.log('Card effects to resolve before combat changing card stats:', statChangeEffects, statChangeEffectsReApply);
        statChangeEffects.forEach(effects => ResolveEffects(effects, zoneIndex));




        // Now you can safely reset the original arrays without affecting the new ones
        preventionNullificationChangeSwapEffects = [[], [], [], []];
        nullificationChangeSwapEffects = [[], [], [], []];
        preventionTypeChangeEffects = [[], [], [], []];
        typeChangeEffects = [[], [], [], []];
        preventionStatChangeEffects = [[], [], [], []];
        statChangeEffects = [[], [], [], []];


    }


    let ifDefeatsEffects = [
        [],[],[],[],
    ];

    function handleCardEffectsIfDefeats(cardElement, userOrOpponent, nullifyCondition, defeatingCondition){
        const effects = JSON.parse(cardElement.dataset.effect || '[]');
        const status = JSON.parse(cardElement.dataset.status || '[]');
        const type = cardElement.dataset.type;

        if (!status.includes(nullifyCondition)) {
            effects.forEach(function (effect) {
                const zonesAffected = effect[1];
                if (effect[0] === defeatingCondition){
                    if (effect[3] === 'preventNull'|| effect[3] === 'additionalEffect0') {
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], preventionNullificationChangeSwapEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], preventionNullificationChangeSwapEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], preventionNullificationChangeSwapEffectsReApply[2], zonesAffected);
                        }
                    }
                    else if (effect[3] === 'replaceEffect' || effect[3] === 'nullifyActive'|| effect[3] === 'swapEffect') {
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], nullificationChangeSwapEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], nullificationChangeSwapEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], nullificationChangeSwapEffectsReApply[2], zonesAffected);
                        }
                    }
                    else if (effect[3] === 'preventTypeChange') {
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], preventionTypeChangeEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], preventionTypeChangeEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], preventionTypeChangeEffectsReApply[2], zonesAffected);
                        }
                    }
                    else if (effect[3] === 'modifyUnitType') {
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], typeChangeEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], typeChangeEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], typeChangeEffectsReApply[2], zonesAffected);
                        }
                    }
                    else if (effect[3] === 'preventIncrease' || effect[3] === 'preventDecrease') {
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], preventionStatChangeEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], preventionStatChangeEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], preventionStatChangeEffectsReApply[2], zonesAffected);
                        }
                    }
                    else { // ongoing-like effects
                        if (type === 'unit') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[0], statChangeEffectsReApply[0], zonesAffected);
                        } else if (type === 'land' || cardElement.dataset.name === 'Field') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[1], statChangeEffectsReApply[1], zonesAffected);
                        } else if (type === 'power-up') {
                            pushEffect(effect, type, userOrOpponent, ifDefeatsEffects[2], statChangeEffectsReApply[2], zonesAffected);
                        }
                    }
                }

            });
        }
        else {
            if (nullifyCondition === 'nullifyActive')
                console.log(`The defeating effect of ${cardElement.dataset.cardName} was nullified`);
            else
                console.log(`The effect of ${cardElement.dataset.cardName} on defeat was nullified`);
        }
    }

    function ifDefeatsCardEffects(zoneIndex, zoneWinner){

        let zone;
        let userOrOpponent = 1;

        if (zoneWinner === 'user')
            zone = userZones[zoneIndex];
        else {
            zone = opponentZones[zoneIndex];
            userOrOpponent = 2;
        }

        const cards = zone.querySelectorAll('.placed-card');
        cards.forEach(cardElement => handleCardEffectsIfDefeats(cardElement, userOrOpponent,
            'nullifyActive', 'if_defeats_unit'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'if_defeats_unit'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                ifDefeatsEffects[3].push(effect);
            }

        });


        console.log('Card effects to resolve when a unit defeats another:', ifDefeatsEffects);
        ifDefeatsEffects.forEach(effects => ResolveEffects(effects, zoneIndex));

        ifDefeatsEffects = [
            [],[],[],[],
        ];
    }

    function ifDefeatedCardEffects(zoneIndex, zoneWinner){

        let zone;
        let userOrOpponent = 2;

        if (zoneWinner === 'user')
            zone = opponentZones[zoneIndex];
        else {
            zone = userZones[zoneIndex];
            userOrOpponent = 1;
        }

        const cards = zone.querySelectorAll('.placed-card');
        cards.forEach(cardElement => handleCardEffectsIfDefeats(cardElement, userOrOpponent,
            'nullifyDefeat', 'if_defeated'));

        lastingCivilizationCards.forEach(function (cardEffect) {

            const effect = cardEffect;  // No need to parse, cardEffect is already an array

            if (effect[0] === 'if_defeated'){
                console.log(`Processing lasting civilization card effect:`, cardEffect);
                ifDefeatsEffects[3].push(effect);
            }

        });


        console.log('Card effects to resolve when a unit is defeated:', ifDefeatsEffects);
        ifDefeatsEffects.forEach(effects => ResolveEffects(effects, zoneIndex));

        ifDefeatsEffects = [
            [],[],[],[],
        ];
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
                const param2 = effect[6]; // can be 'non'
                const param3 = effect[7]; // optional name of card effect
                const param4 = effect[8];

                let opponentNumber=2;
                if (userOrOpponent === 2)
                    opponentNumber=1;

                applyEffectToZones(userZonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3, param4,typeOfSourceCard);
                applyEffectToZones(opposingZonesToBeApplied, currentZoneIndex, opponentNumber, effect, requirement, param1, param2, param3, param4,typeOfSourceCard);
                function applyEffectToZones(zonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3,param4,typeOfSourceCard) {

                    let [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps, opposingUnitStatus] = OpposingValues(currentZoneIndex, userOrOpponent);
                    let numberOfAllyPowerUps = AllyValues(currentZoneIndex, userOrOpponent);

                    zonesToBeApplied.forEach(function (zoneToApply) {
                        UpdateCombatForZone(zoneToApply, opposingCombatValue, opposingResourceValue, opposingUnitTypes, effect[5], param1, param2, param3, param4,numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard, opposingUnitStatus, userOrOpponent, effect[effect.length - 3]);
                    });
                }

            }
            else if (typeOfEffect === 'modifyResource'){

                const param2 = effect[6]; // can be 'non'
                const param3 = effect[7]; // optional name of card effect
                const param4 = effect[8];

                applyResourceEffectToZones(userZonesToBeApplied, currentZoneIndex, 1, effect, requirement, param1, param2, param3, param4,typeOfSourceCard);
                applyResourceEffectToZones(opposingZonesToBeApplied, currentZoneIndex, 2, effect, requirement, param1, param2, param3,param4, typeOfSourceCard);

                function applyResourceEffectToZones(zonesToBeApplied, currentZoneIndex, userOrOpponent, effect, requirement, param1, param2, param3, param4,typeOfSourceCard) {

                    let [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps, opposingUnitStatus] = OpposingValues(currentZoneIndex, userOrOpponent);
                    let numberOfAllyPowerUps = AllyValues(currentZoneIndex, userOrOpponent);

                    zonesToBeApplied.forEach(function (zoneToApply) {
                        ModifyResourceForZone(zoneToApply, opposingCombatValue, opposingResourceValue, opposingUnitTypes, effect[5], param1, param2, param3, param4,numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard, opposingUnitStatus, userOrOpponent, effect[effect.length - 3]);
                    });
                }

            }
            else if (typeOfEffect === 'modifyUnitType'){

                let param2 = effect[5];
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    ModifyUnitType(zoneToApply, param1, param2);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    ModifyUnitType(zoneToApply, param1, param2);
                });
            }
            else if (typeOfEffect === 'nullifyActive'){
                // param1 is type of card
                const affected = effect[5]; // faction
                const param2 = effect[6]; // confronting or not
                const param3 = effect[7];
                if (requirement === 'none' || (requirement === 'lowerRawResource' && opposingResourceValue<allyResourceValue)){
                    userZonesToBeApplied.forEach(function (zoneToApply) {
                        [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 1);
                        NullifyActive(zoneToApply, param1, affected, param2, param3, opposingUnitTypes);
                    });

                    opposingZonesToBeApplied.forEach(function (zoneToApply) {
                        [opposingCombatValue, opposingResourceValue, opposingUnitTypes, numberOfOpponentPowerUps] = OpposingValues(currentZoneIndex, 2);

                        NullifyActive(zoneToApply, param1, affected, param2, param3, opposingUnitTypes);
                    });
                }
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
                const param2 = effect[6];
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventDecrease(zoneToApply, param1, param2);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventDecrease(zoneToApply, param1, param2);
                });
            }
            else if (typeOfEffect === 'applyResourceConfrontation'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    applyResourceConfrontation(zoneToApply);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    applyResourceConfrontation(zoneToApply);
                });
            }
            else if (typeOfEffect === 'replaceEffect'){
                let opposingUnitEffect = OpposingEffect(currentZoneIndex, userOrOpponent); // of who activated the card
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    ReplaceEffect(zoneToApply, param1, opposingUnitEffect);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    ReplaceEffect(zoneToApply, param1, opposingUnitEffect);
                });
            }
            else if (typeOfEffect === 'additionalEffect' || typeOfEffect === 'additionalEffect0'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    AdditionalEffect(zoneToApply, param1, 1);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    AdditionalEffect(zoneToApply, param1, 2);
                });
            }
            else if (typeOfEffect === 'Arena'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventArena(zoneToApply);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventArena(zoneToApply);
                });
            }
            else if (typeOfEffect === 'Anubis'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventAnubis(zoneToApply);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventAnubis(zoneToApply);
                });
            }
            else if (typeOfEffect === 'applyRawForConfrontation'){
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    applyRawForConfrontation(zoneToApply);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    applyRawForConfrontation(zoneToApply);
                });
            }
            else if (typeOfEffect === 'prevent'){ // all other kind of prevents
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventOther(zoneToApply, param1);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventOther(zoneToApply, param1);
                });
            }
            else if (typeOfEffect === 'preventNull'){
                const param2 = effect[5];
                const param3 = effect[6];
                userZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventNullificationChange(zoneToApply, param1, param2, param3);
                });
                opposingZonesToBeApplied.forEach(function (zoneToApply) {
                    PreventNullificationChange(zoneToApply, param1, param2, param3);
                });
            }

            else if (typeOfEffect === 'preventTypeChange'){

            }

            else if (typeOfEffect === 'swapEffect'){
                for (let j = 0; j < userZonesToBeApplied.length; j++) {
                    let zone = userZonesToBeApplied[j];
                    let opposingZone = opposingZonesToBeApplied[j];

                    zone.querySelectorAll('.placed-card').forEach(card => {
                        let cardStatus = JSON.parse(card.dataset.status || '[]');
                        if (card.dataset.type === 'unit' && !cardStatus.includes('preventChange')) {

                            opposingZone.querySelectorAll('.placed-card').forEach(opposingCard => {
                                let opposingCardStatus = JSON.parse(opposingCard.dataset.status || '[]');
                                if (opposingCard.dataset.type === 'unit' && !opposingCardStatus.includes('preventChange')) {
                                    let currentEffect = JSON.parse(card.dataset.effect || '[]');
                                    let opposingCurrentEffect = JSON.parse(opposingCard.dataset.effect || '[]');

                                    card.dataset.effect = JSON.stringify(opposingCurrentEffect);
                                    opposingCard.dataset.effect = JSON.stringify(currentEffect);

                                    console.log('Effect of user\'s unit :', card.dataset.effect);
                                    console.log('Effect of opponent\'s unit :', opposingCard.dataset.effect);
                                }
                            });


                            cardStatus.push('swapedEffect');
                            card.dataset.status = JSON.stringify(cardStatus);


                        }
                    });
                }
            }

            else {
                console.log(`Effect not applied: ${effect[effect.length-3]}`);
            }
        }


    }

    function UpdateCombatForZone(zone, opposingCombatValue,opposingResourceValue, opposingUnitTypes, affected, param1, param2, param3, param4,numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard, opposingUnitStatus, userOrOpponent, effectApplied) {

        console.log(`Effect applied: ${effectApplied} to ${userOrOpponent === 1 ? 'user' : 'opponent'}\n
                    OpposingCombatValue: ${opposingCombatValue}\nOpposingResourceValue: ${opposingResourceValue}\n
                    Number of opponent power-ups: ${numberOfOpponentPowerUps}\nNumber of ally power-ups: ${numberOfAllyPowerUps}\n
                    Opponent unit's type(s): `, opposingUnitTypes);

        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (affected === 'none' || (cardFactions.includes(affected) && param2 !== 'non')||
                cardFactions.includes('all') || (!cardFactions.includes(affected) && param2 === 'non'))
                || (cardStatus.includes('nullifyActive') && affected === 'nullifyActive')) {

                let combatValue = parseInt(card.dataset.combat, 10);
                if (param1 === 'highestInZone'){ // highest combat
                    let additionalCombat = 0;
                    if (param2 === 'none'){ // for the bee insect
                        console.log(`Stinger effect activate!`);
                        if (parseInt(card.dataset.rawCombat, 10) > opposingCombatValue){
                            additionalCombat = parseInt(card.dataset.rawCombat, 10);
                        }
                        else {
                            additionalCombat = opposingCombatValue;
                        }
                        combatValue += additionalCombat;
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
                else if (param1 === 'differentType'){
                    let conditionFulfilled = true;
                    cardFactions.forEach(function (type) {
                        if (type === 'all'){
                            conditionFulfilled = false;
                        }
                    });
                    if (conditionFulfilled){
                        conditionFulfilled = false;
                        opposingUnitTypes.forEach(function (theirType) {
                            if (!cardFactions.includes(theirType)){
                                conditionFulfilled = true;
                            }
                        });
                        if (conditionFulfilled){
                            param2 = parseInt(param2, 10);
                            combatValue+=(param2);
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
                else if (param1 === 'sameUnitType'){
                    let aSameType = false;
                    opposingUnitTypes.forEach(function (type){
                        if (type === 'all'|| cardFactions.includes(type)){
                            aSameType = true;
                        }
                    });
                    if (aSameType){
                        param2 = parseInt(param2, 10);
                        combatValue += param2;
                        console.log(`Pact effect activate!`);
                    }
                    else {
                        console.log(`Pact effect did not activate (conditions not met)!`);
                    }
                }
                else if (param1 === 'highestResourceInZone'){
                    if (param2 === 'none'){
                        console.log(`Nommad effect activate!`);
                        if (parseInt(card.dataset.rawResource)>=opposingResourceValue)
                            combatValue += parseInt(card.dataset.rawResource, 10);
                        else {
                            combatValue += opposingResourceValue;
                        }
                    }
                    else{
                        console.log(`Fleur effect activate!`);
                        param2 = parseInt(param2, 10);
                        combatValue += param2;
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
                else if (param1 === 'Mesh') {
                    console.log(`Mesh effect activate!`);
                    combatValue += opposingResourceValue;

                    let effect = ['statChange','ally','none','modifyCombat',opposingResourceValue,'none','none','If this unit defeats an opponent\'s unit, ALL your units\' combat increase by the defeated unit\'s raw resource'];
                    statChangeEffectsReApply[0].push(effect);
                }
                else if (param1 === 'countPowerUp') { // counts on opponents
                    param2 = parseInt(param2, 10);
                    if (param3 === 'Olten'){
                        console.log(`Olten effect activate!`);
                        if (numberOfOpponentPowerUps >= 2)
                            combatValue+=(param2);
                    }
                    else if (param3 === 'Snow'){
                        console.log(`Snow effect activate!`);
                        if (numberOfOpponentPowerUps < 1)
                            combatValue+=(param2);
                    }
                    else {
                        console.log(`Count opponent power-up effect activate!`);
                        combatValue += (param2 * numberOfOpponentPowerUps);
                    }
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
                    else if (param3 === 'Radier' || param3 === 'Carvora'){
                        console.log(`Radier and Carvora effect activate!`);
                        if (numberOfAllyPowerUps >= 1)
                            combatValue+=(param2);
                    }
                    else if (param3 === 'Unity'){
                        console.log(`Unity effect activate!`);
                        if (numberOfAllyPowerUps < 1)
                            combatValue+=(param2);
                    }
                    else if (param3 === 'Glore'){
                        console.log(`Glore effect activate!`);
                        if (numberOfOpponentPowerUps < 1)
                            combatValue+=(param2);
                    }
                    else {
                        combatValue+=(numberOfAllyPowerUps*param2);
                    }
                }
                else if (param1 === 'countPowerUpZone'){
                    console.log(`Miël effect activate!`);
                    param2 = parseInt(param2, 10);
                    let numberOfPowerUpsInZone = numberOfOpponentPowerUps +numberOfAllyPowerUps;
                    combatValue+=(numberOfPowerUpsInZone*param2);
                }
                else if (param1 === 'countDefeated'){
                    let countType = 0;
                    Object.values(defeatedUnits).forEach(unitsArray => {
                        unitsArray.forEach(unit => {
                            let factions = JSON.parse(unit.dataset.faction || '[]');
                            if (factions.includes(param3) || param3 === 'all' || factions.includes('all')
                                || (param3 === 'non' && !factions.includes(param4)))
                                countType+=1;
                        });
                    });
                    param2 = parseInt(param2, 10);
                    combatValue+=(param2*countType);
                }
                else if (param2 === 'confronting'){
                    console.log(`Dweller and Cord effect activate!`);
                    if (opposingUnitTypes.includes('all') || opposingUnitTypes.includes(param3)
                        || (param3 === 'non' && !opposingUnitTypes.includes(param4))
                        || (param3 === 'higherResource' && opposingResourceValue>parseInt(card.dataset.rawResource, 10))
                        || (param3 === 'nullifyActive' && opposingUnitStatus.includes('nullifyActive'))){
                        param1 = parseInt(param1, 10);
                        combatValue+=(param1);
                    }

                }
                else if (param1 === 'Sauriël'){
                    if (opposingCombatValue > card.dataset.rawCombat){
                        console.log(`Sauriël effect activate!`);
                        param2 = parseInt(param2, 10);
                        combatValue+=(param2);
                        let saurielEffect = [['statChange','column','none','modifyCombat',3,'angel','none','Sauriël Effect', 'other unit', 1]];
                        statChangeEffectsReApply.push(saurielEffect);
                    }
                    else {
                        console.log(`Sauriël effect did not activate!`);
                    }
                }
                else { // normal case, param1 is an int
                    console.log(`Given combat modifier effect activate!`);
                    param1 = parseInt(param1, 10);
                    combatValue += param1;
                }

                console.log(`Applying: a modifying combat effect, with \nparam1: ${param1}\nparam2: ${param2} 
                    \nprevious combat: ${card.dataset.combat}\nnew combat: ${combatValue}
                    \naffected: ${affected} \nto card: ${card.dataset.cardName} \nstatus: `, cardStatus);

                if (
                    (combatValue>parseInt(card.dataset.combat) &&
                    (cardStatus.includes('preventIncreaseDescendant')  //prevents increase combat through these
                        || (cardStatus.includes('preventIncreaseLuna') && (typeOfSourceCard === 'land' || typeOfSourceCard === 'power-up'))
                        || (cardStatus.includes('preventIncreasePrayer') && (typeOfSourceCard === 'land'))
                        || (cardStatus.includes('preventIncreaseDuel') && (typeOfSourceCard === 'other unit' || typeOfSourceCard === 'power-up'))
                        || (cardStatus.includes('preventIncreaseResonance') && (typeOfSourceCard === 'unit'))
                        || (cardStatus.includes('preventArena') && !(typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit'))
                        || cardStatus.includes('preventAnubis')
                    ))

                    ||
                    (combatValue<parseInt(card.dataset.combat) &&
                        (cardStatus.includes('preventDecreaseCombat')
                            || (cardStatus.includes('preventArena') && !(typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit'))
                            || cardStatus.includes('preventAnubis')
                        ))
                ){

                    console.log(`The change of combat was prevented!`);

                }

                else if (combatValue !== parseInt(card.dataset.combat)){
                    if (cardStatus.includes('Michaël') && (typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit')){
                        let addingMore = combatValue - parseInt(card.dataset.combat, 10);
                        combatValue += addingMore;
                    }
                    if (cardStatus.includes('Urie') && typeOfSourceCard === 'other unit'){
                        let addingMore = combatValue - parseInt(card.dataset.combat, 10);
                        combatValue += addingMore;
                    }
                    if (cardStatus.includes('Kaminari') && typeOfSourceCard === 'power-up'){
                        let addingMore = combatValue - parseInt(card.dataset.combat, 10);
                        combatValue += addingMore;
                    }
                    if (cardStatus.includes('Awakening') && typeOfSourceCard === 'land'){
                        let addingMore = combatValue - parseInt(card.dataset.combat, 10);
                        combatValue += addingMore;
                    }
                    if (cardStatus.includes('Absolute') && (typeOfSourceCard === 'power-up'|| typeOfSourceCard === 'land')){
                        if (combatValue>parseInt(card.dataset.combat, 10)){
                            let addingMore = combatValue - parseInt(card.dataset.combat, 10);
                            combatValue += addingMore;
                        }
                    }

                    if (cardStatus.includes('Unexpected Outcome')){
                        let newValue = combatValue - parseInt(card.dataset.combat, 10);
                        combatValue = Math.abs(newValue) + parseInt(card.dataset.combat, 10);
                    }


                    if (cardStatus.includes('Howl') ){
                        let additionalResource = combatValue - parseInt(card.dataset.combat, 10);
                        card.dataset.resource = (parseInt(card.dataset.resource, 10)+additionalResource).toString();
                        combatValue = parseInt(card.dataset.combat, 10);
                    }
                    card.dataset.combat = combatValue.toString();
                    updateCardValues(card);
                }
                else {
                    console.log(`No change!`);
                }

            }
        });
    }
    function ModifyResourceForZone(zone, opposingCombatValue,opposingResourceValue, opposingUnitTypes, affected, param1, param2, param3,param4, numberOfAllyPowerUps, numberOfOpponentPowerUps, typeOfSourceCard, opposingUnitStatus, userOrOpponent, effectApplied){

        console.log(`Effect applied: ${effectApplied} to ${userOrOpponent === 1 ? 'user' : 'opponent'}\n
                    OpposingCombatValue: ${opposingCombatValue}\nOpposingResourceValue: ${opposingResourceValue}\n
                    Number of opponent power-ups: ${numberOfOpponentPowerUps}\nNumber of ally power-ups: ${numberOfAllyPowerUps}\n
                    Opponent unit's type(s): `, opposingUnitTypes);

        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (affected === 'none' || (cardFactions.includes(affected) && param2 !== 'non')||
                cardFactions.includes('all') || (!cardFactions.includes(affected) && param2 === 'non'))
                || (cardStatus.includes('nullifyActive') && affected === 'nullifyActive')) {

                let resourceValue = parseInt(card.dataset.resource, 10);
                if (param1 === 'opposingCombat'){
                    console.log(`Yfrit effect activate!`);
                    resourceValue+=opposingCombatValue;
                }
                else if (param1 === 'Organization'){
                    console.log(`Organization effect activate!`);
                    const rawCombat = parseInt(card.dataset.rawCombat, 10);
                    resourceValue+=rawCombat;
                }
                else if (param1 === 'highestCombat'){
                    let additionalResource = 0;
                    if (param2 === 'none'){ // for the bee insect
                        console.log(`Sky effect activate!`);
                        if (parseInt(card.dataset.rawCombat, 10) > opposingCombatValue){
                            additionalResource = parseInt(card.dataset.rawCombat, 10);
                        }
                        else {
                            additionalResource = opposingCombatValue;
                        }
                        resourceValue += additionalResource;
                    }
                }
                else if (param1 === 'countPowerUp'){
                    console.log(`Enchant effect activate!`);
                    param2 = parseInt(param2, 10);
                    resourceValue+=(numberOfOpponentPowerUps*param2);
                }
                else if (param1 === 'countPowerUpAlly'){
                    param2 = parseInt(param2, 10);
                    if (param3 === 'Ciël'){
                        console.log(`Ciël effect activate!`);
                        if (numberOfAllyPowerUps === 1)
                            resourceValue+=(param2);
                    }
                    else{
                        console.log(`Based on self power ups effect activate!`);
                        resourceValue+=(numberOfAllyPowerUps*param2);
                    }
                }
                else if (param1 === 'countPowerUpZone'){
                    console.log(`Fanaël effect activate!`);
                    param2 = parseInt(param2, 10);
                    let numberOfPowerUpsInZone = numberOfOpponentPowerUps +numberOfAllyPowerUps;
                    resourceValue+=(numberOfPowerUpsInZone*param2);
                }
                else if (param1 === 'Artemis'){
                    if (opposingResourceValue > card.dataset.rawResource){
                        console.log(`Artemis effect activate!`);
                        param2 = parseInt(param2, 10);
                        resourceValue+=(param2);
                        let artemisEffect = [['statChange','column','none','modifyResource',3,'angel','none','Artemis Effect','other unit',1]];
                        statChangeEffectsReApply.push(artemisEffect);
                    }
                    else {
                        console.log(`Artemis effect did not activate!`);
                    }
                }
                else if (param1 === 'resourceFromSelf'){
                    console.log(`Gust of Wind effect activate!`);
                    resourceValue+=parseInt(card.dataset.rawResource, 10);
                }
                else if (param1 === 'countDefeated'){
                    let countType = 0;
                    Object.values(defeatedUnits).forEach(unitsArray => {
                        unitsArray.forEach(unit => {
                            let factions = JSON.parse(unit.dataset.faction || '[]');
                            if (factions.includes(param3) || param3 === 'all' || factions.includes('all')
                                || (param3 === 'non' && !factions.includes(param4)))
                                countType+=1;
                        });
                    });
                    param2 = parseInt(param2, 10);
                    resourceValue+=(param2*countType);

                }
                else if (param2 === 'confronting'){
                    console.log(`Dweller and Cord effect activate for resource!`);
                    param1 = parseInt(param1, 10);
                    if (opposingUnitTypes.includes('all')|| opposingUnitTypes.includes(param3)
                        || (param3 === 'non' && !opposingUnitTypes.includes(param4))
                        || (param3 === 'higherResource' && opposingResourceValue>parseInt(card.dataset.rawResource, 10))
                        || (param3 === 'nullifyActive' && opposingUnitStatus.includes('nullifyActive'))){
                        resourceValue+=param1;
                    }
                    else if (param3 === 'Rex Venant'){
                        if ((opposingUnitTypes.includes('all')|| opposingUnitTypes.includes('undead'))&&(
                            opposingUnitStatus.includes('nullifyActive'))){
                            resourceValue+=param1;
                        }
                    }

                }
                else { // normal case, param1 is an int
                    console.log(`Given resource modifier effect activate!`);
                    param1 = parseInt(param1, 10);
                    resourceValue += param1;
                }

                console.log(`Applying: a modifying resource effect, with \nparam1: ${param1}\nparam2: ${param2} 
                    \nprevious resource: ${card.dataset.resource}\nnew resource: ${resourceValue}
                    \naffected: ${affected} \nto card: ${card.dataset.cardName} \nstatus: `, cardStatus);

                if (
                    (resourceValue>parseInt(card.dataset.resource) &&
                        (
                            (cardStatus.includes('preventIncreasePrayer') && (typeOfSourceCard === 'land'))
                            || cardStatus.includes('Fallen Nation')
                            || (cardStatus.includes('preventArena') && !(typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit'))
                            || cardStatus.includes('Anubis')
                        )
                    )

                    ||
                    (resourceValue<parseInt(card.dataset.resource) &&
                        (
                            cardStatus.includes('preventDecreaseResource')
                            || (cardStatus.includes('preventArena') && !(typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit'))
                            || cardStatus.includes('preventAnubis')
                        )
                    )
                ){

                    console.log(`The change of resource was prevented!`);
                }
                else if (resourceValue !== parseInt(card.dataset.resource)) {
                    if (cardStatus.includes('Lauriël') && (typeOfSourceCard === 'unit' || typeOfSourceCard === 'other unit')){
                        let addingMore = resourceValue - parseInt(card.dataset.resource, 10);
                        resourceValue += addingMore;
                    }
                    if (cardStatus.includes('Safira')){
                        let addingMore = resourceValue - parseInt(card.dataset.resource, 10);
                        resourceValue += addingMore;
                    }
                    if (cardStatus.includes('Urie') && typeOfSourceCard === 'other unit'){
                        let addingMore = resourceValue - parseInt(card.dataset.resource, 10);
                        resourceValue += addingMore;
                    }
                    if (cardStatus.includes('Wharp') ){
                        let additionalCombat = resourceValue - parseInt(card.dataset.resource, 10);
                        card.dataset.combat = (parseInt(card.dataset.combat, 10)+additionalCombat).toString();
                    }
                    if (cardStatus.includes('Awakening') && typeOfSourceCard === 'land'){
                        let addingMore = resourceValue - parseInt(card.dataset.resource, 10);
                        resourceValue += addingMore;
                    }

                    if (cardStatus.includes('Unexpected Outcome')){
                        let newValue = resourceValue - parseInt(card.dataset.resource, 10);
                        resourceValue = Math.abs(newValue) + parseInt(card.dataset.resource, 10);
                    }


                    if (cardStatus.includes('Howl') ){
                        let additionalCombat = resourceValue - parseInt(card.dataset.resource, 10);
                        card.dataset.combat = (parseInt(card.dataset.combat, 10)+additionalCombat).toString();
                        resourceValue = parseInt(card.dataset.resource, 10);
                    }
                    card.dataset.resource = resourceValue.toString();
                    updateCardValues(card);
                }
                else {
                    console.log(`No change!`);
                }

            }
        });
    }
    function ModifyUnitType(zone, param1, param2) {
        zone.querySelectorAll('.placed-card').forEach(card => {
            const cardStatus = JSON.parse(card.dataset.status || '[]');

            if (card.dataset.type === 'unit' && !cardStatus.includes('preventTypeChange')) {
                console.log(`Applying: a modifying type effect, with param1 ${param1} to ${card.dataset.cardName}`);

                let newType = [param1.toString()];
                if (param2 !== 'none')
                    newType.push(param2.toString())
                console.log('type(s) was', card.dataset.type, 'and has become', newType);

                card.dataset.faction = JSON.stringify(newType);
            }
        });
    }

    function NullifyActive(zone, param1, affected, param2, param3, opposingUnitTypes){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            const cardFactions = JSON.parse(card.dataset.faction || '[]');
            if (
                card.dataset.type === param1 &&
                (
                    affected === 'none'
                    || cardFactions.includes('all')
                    || cardFactions.includes(affected)
                )
                &&
                (
                    param2 === 'none' ||
                    (
                        param2 === 'confronting' && (opposingUnitTypes.includes(param3) || opposingUnitTypes.includes('all'))
                        || (param2 === 'non' && (cardFactions.includes(param3) || cardFactions.includes('all')))
                    )
                )
            ) {
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

            if (card.dataset.type === 'unit' &&
                (affected === 'none' || cardFactions.includes('all')
                    || cardFactions.includes(affected)) &&(param2 === 'none' || (param2 === 'confronting' &&
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
                else if (param1 === 'Resonance'){
                    cardStatus.push('preventIncreaseResonance');
                }
                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
        });
    }

    function PreventDecrease(zone, param1, param2){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit') {
                console.log(`Applying: a prevention decreasing effect to ${card.dataset.cardName}`);
                if (param1 === 'combat'){
                    cardStatus.push('preventDecreaseCombat');
                }
                if (param2 === 'resource'){
                    cardStatus.push('preventDecreaseResource');
                }

                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
        });
    }

    function applyResourceConfrontation(zone){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (!cardStatus.includes('preventApplyResourceConfrontation'))) {
                cardStatus.push('applyResourceConfrontation');
            }

            console.log('Modified status of card:', cardStatus);

            card.dataset.status = JSON.stringify(cardStatus);
        });
    }

    function applyRawForConfrontation(zone){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && (!cardStatus.includes('preventApplyRawForConfrontation'))) {
                cardStatus.push('applyRawForConfrontation');
            }

            console.log('Modified status of card:', cardStatus);

            card.dataset.status = JSON.stringify(cardStatus);
        });
    }

    function PreventArena(zone){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit') {
                console.log(`Applying: a prevention increasing effect of Arena to ${card.dataset.cardName}`);
                cardStatus.push('preventArena');

                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
        });
    }
    function PreventAnubis(zone){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit') {
                console.log(`Applying: a prevention increasing effect of Anubis to ${card.dataset.cardName}`);
                cardStatus.push('preventAnubis');

                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
        });
    }

    function ReplaceEffect(zone,param1, opposingEffect){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit' && !cardStatus.includes('preventChange')) {
                let currentEffect = JSON.parse(card.dataset.effect || '[]');
                if (param1 === 'Pandemic'){
                    let cardEffect = ['statChange','opposing','none','changeUnitType','undead','confronting','undead','ALL your units become undead and lose their other types if they are confronting undead units'];


                    currentEffect = currentEffect.map(effect => {
                        if (effect[0] === 'if_defeated'){
                            console.log(`Applying: Pandemic effect to ${card.dataset.cardName}`);
                            return cardEffect;  // Replace the entire effect with the new effect
                        }
                        return effect;  // Keep the existing effect if it doesn't match
                    });
                    card.dataset.effect = JSON.stringify(currentEffect);
                }
                else if (param1 === 'Ancient Seal'){
                    console.log(`Applying: Ancient Seal effect to ${card.dataset.cardName}`);
                    let cardEffect = [['statChange','column','none','modifyCombat',1,'none','confronting','ancient','ALL units here have their abilities replaced by "+1 combat when an opponent\'s unit here is an ancient"']];

                    card.dataset.effect = JSON.stringify(cardEffect);
                }
                else if (param1 === 'Mantis' || param1 === 'Assimilation'){
                    console.log(`Applying: Mantis and Assimilation effect to ${card.dataset.cardName}`);
                    card.dataset.effect = JSON.stringify(opposingEffect);
                }
                else if (param1 === 'Living Nightmare'){
                    console.log(`Applying: Living Nightmare effect to ${card.dataset.cardName}`);
                    card.dataset.effect = JSON.stringify(opposingEffect);
                }
                else if (param1 === 'Soul Exchange'){
                    console.log(`Applying: Soul Exchange effect to ${card.dataset.cardName}`);
                    let cardEffect = ['nullificationChangeSwap','opposing','none','modifyCombat',-1,'none','confronting','undead','This unit receives -1 combat when confronting an undead'];
                    card.dataset.effect = JSON.stringify(cardEffect);
                }
                cardStatus.push('changedEffect');
                card.dataset.status = JSON.stringify(cardStatus);
                console.log('Effect of unit :', currentEffect);


            }
        });
    }

    function AdditionalEffect(zone, param1, userOrOpponent){
        zone.querySelectorAll('.placed-card').forEach(card => {
            if (card.dataset.type === 'unit') {
                let currentEffect = JSON.parse(card.dataset.effect || '[]');
                let cardStatus = JSON.parse(card.dataset.status || '[]');
                if (param1 === 'For Glory' && !(cardStatus.includes('nullifyActive'))){
                    console.log(`Applying: For Glory effect to ${card.dataset.cardName}`);

                    let cardEffect1 = ['if_defeats_unit','ally','none','modifyCombat',1,'none','none','If this unit defeats an opponent\'s unit, ALL your other units receive +1 combat','civilization',userOrOpponent];
                    let cardEffect2 = ['if_defeats_unit','ally','none','modifyResource',1,'none','none','If this unit defeats an opponent\'s unit, ALL your other units receive +1 resource','civilization',userOrOpponent];

                    currentEffect.push(cardEffect1);
                    currentEffect.push(cardEffect2);

                    card.dataset.effect = JSON.stringify(currentEffect);
                }
                else if (param1 === 'Shrine' && !cardStatus.includes('nullifyDefeat')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeated'){
                            console.log(`Applying: Shrine effect to ${card.dataset.cardName}`);
                            effect.push('unit');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[1].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[0] = 'statChange';
                            effectCopy[effectCopy.length-2] = 'other unit';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
                else if (param1 === 'Death Experience' && !cardStatus.includes('nullifyDefeat')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeated'){
                            console.log(`Applying: Death Experience effect to ${card.dataset.cardName}`);
                            effect.push('unit');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[2].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[0] = 'statChange';
                            effectCopy[effectCopy.length-2] = 'other unit';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
                else if (param1 === 'Arise' && !cardStatus.includes('nullifyDefeat')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeated'){
                            console.log(`Applying: Arise effect to ${card.dataset.cardName}`);
                            effect.push('unit');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[3].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[effectCopy.length-2] = 'other unit';
                            effectCopy[0] = 'statChange';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
                else if (param1 === 'Amberon' && !cardStatus.includes('nullifyDefeat')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeats_unit'){
                            console.log(`Applying: Amberon effect to ${card.dataset.cardName}`);
                            effect.push('unit');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[1].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[effectCopy.length-2] = 'other unit';
                            effectCopy[0] = 'statChange';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
                else if (param1 === 'Empower' && !cardStatus.includes('nullifyActive')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeats_unit'){
                            console.log(`Applying: Empower effect to ${card.dataset.cardName}`);
                            effect.push('unit');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[3].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[effectCopy.length-2] = 'other unit';
                            effectCopy[0] = 'statChange';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
                else if (param1 === 'Kaminari' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Kaminari');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Lauriël' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Lauriël');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Michaël' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Michaël');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Absolute' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Absolute');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Wharp' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Wharp');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Safira' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Safira');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Howl' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Howl');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Urie' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Urie');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Awakening' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Awakening');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Unexpected Outcome' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('Unexpected Outcome');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'DNA Attack' && !cardStatus.includes('nullifyActive')){
                    cardStatus.push('DNA Attack');
                    card.dataset.status = JSON.stringify(cardStatus);
                }
                else if (param1 === 'Vion' && !cardStatus.includes('nullifyActive')){
                    let newEffects = [];
                    Object.values(defeatedUnits).forEach(unitsArray => {
                        unitsArray.forEach(unit => {
                            let factions = JSON.parse(unit.dataset.faction || '[]');
                            if (factions.includes('dragon') || factions.includes('android')
                                || factions.includes('all')){
                                let effects = JSON.parse(unit.dataset.effect || '[]');
                                effects.forEach(function (effect) {
                                    newEffects.push(effect);
                                });
                            }
                        });
                    });
                    card.dataset.effect = JSON.stringify(newEffects);
                }
                else if (param1 === 'Autumn' && !cardStatus.includes('nullifyActive')){
                    let newEffects = [];
                    Object.values(defeatedUnits).forEach(unitsArray => {
                        unitsArray.forEach(unit => {
                            let effects = JSON.parse(unit.dataset.effect || '[]');
                            effects.forEach(function (effect) {
                                newEffects.push(effect);
                            });
                        });
                    });
                    card.dataset.effect = JSON.stringify(newEffects);
                }


                console.log('Effect of unit :', currentEffect);


            }
            else if (card.dataset.type === 'land') {
                let currentEffect = JSON.parse(card.dataset.effect || '[]');
                let cardStatus = JSON.parse(card.dataset.status || '[]');
                if (param1 === 'Empower' && !cardStatus.includes('nullifyActive')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeats_unit'){
                            console.log(`Applying: Empower effect to ${card.dataset.cardName}`);
                            effect.push('land');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[3].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[0] = 'statChange';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
            }
            else if (card.dataset.type === 'power-up') {
                let currentEffect = JSON.parse(card.dataset.effect || '[]');
                let cardStatus = JSON.parse(card.dataset.status || '[]');
                if (param1 === 'Empower' && !cardStatus.includes('nullifyActive')){
                    currentEffect.forEach(function (effect) {
                        if (effect[0] === 'if_defeats_unit'){
                            console.log(`Applying: Empower effect to ${card.dataset.cardName}`);
                            effect.push('power-up');
                            effect.push(userOrOpponent);
                            ifDefeatsEffects[3].push(effect);
                            let effectCopy = JSON.parse(JSON.stringify(effect));
                            effectCopy[0] = 'statChange';
                            statChangeEffectsReApply[0].push(effectCopy);
                        }
                    })
                }
            }
        });
    }

    function PreventNullificationChange(zone, param1, param2, param3){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            let cardFactions = JSON.parse(card.dataset.faction || '[]');
            if (card.dataset.type === 'unit' && (param3 === 'none' || cardFactions.includes('all')
                || cardFactions.includes(param3))) {
                console.log(`Applying: a prevention null or change effect to ${card.dataset.cardName}`);

                if (param1 === 'nullify'){
                    cardStatus.push('preventNullifyActive');
                    if (param2 === 'nullifyDefeat'){
                        cardStatus.push('preventNullifyDefeat');
                    }
                }
                else if (param1 === 'nullifyDefeat'){
                    cardStatus.push('preventNullifyDefeat');
                }
                else if (param1 === 'Horus'){
                    cardStatus.push('preventNullifyActive');
                    cardStatus.push('preventNullifyDefeat');
                }
                else if (param1 === 'Faceless Judgement'){
                    cardStatus.push('preventNullifyActive');
                }
                else if (param1 === 'Void'){
                    let voidEffect = [['preventNullificationChangeSwap','column','none','preventNull','nullify','change','none','Void Effect', 'other unit', 1]];
                    preventionStatChangeEffectsReApply.push(voidEffect);
                }
                if (param2 === 'change'){
                    cardStatus.push('preventChange');
                }
                else if (param2 === 'changeDefeat'){
                    cardStatus.push('preventChange');
                }

                console.log('Modified status of card:', cardStatus);

                card.dataset.status = JSON.stringify(cardStatus);
            }
            else if (card.dataset.type === 'power-up'){
                if (param1 === 'Faceless Judgement'){
                    cardStatus.push('preventNullifyActive');
                }
            }
            else if (card.dataset.type === 'land'){
                if (param1 === 'Faceless Judgement'){
                    cardStatus.push('preventNullifyActive');
                }
            }
        });
    }

    function PreventOther(zone, param1){
        zone.querySelectorAll('.placed-card').forEach(card => {
            let cardStatus = JSON.parse(card.dataset.status || '[]');
            if (card.dataset.type === 'unit') {
                if (param1 === 'Alastor'){
                    cardStatus.push('preventApplyResourceConfrontation');
                }
                else if (param1 === 'Frontal Assault'){
                    cardStatus.push('preventApplyResourceConfrontation');
                    cardStatus.push('preventApplyRawForConfrontation');
                }
            }

            console.log('Modified status of card:', cardStatus);

            card.dataset.status = JSON.stringify(cardStatus);
        });
    }


    function OpposingValues(zoneIndex, userOrOpponent){
        let combat;
        let resource;
        let cardFactions;
        let powerUpCount = 0;
        let zone;
        let opposingUnitStatus;
        if (userOrOpponent === 1){
            zone = opponentZones[zoneIndex];
        }
        else {
            zone = userZones[zoneIndex];
        }
        zone.querySelectorAll('.placed-card').forEach(card => {

            if (card.dataset.type === 'unit') {
                combat = parseInt(card.dataset.rawCombat, 10);
                resource = parseInt(card.dataset.rawResource, 10);
                cardFactions = JSON.parse(card.dataset.faction || '[]');
                opposingUnitStatus = JSON.parse(card.dataset.status || '[]');

            }
            else if (card.dataset.type === 'power-up') {
                powerUpCount+=1;
            }

        });
        return [combat, resource, cardFactions, powerUpCount, opposingUnitStatus];
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

    function OpposingEffect(zoneIndex, userOrOpponent){
        let opposingEffect;
        let zone;
        if (userOrOpponent === 1){
            zone = opponentZones[zoneIndex];
        }
        else {
            zone = userZones[zoneIndex];
        }
        zone.querySelectorAll('.placed-card').forEach(card => {

            if (card.dataset.type === 'unit') {
                opposingEffect = JSON.parse(card.dataset.effect || '[]');
            }

        });
        return opposingEffect;
    }


    // When the user quits the page
    window.addEventListener('unload', function () {

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

    });


    startTurn();
});
