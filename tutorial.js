// Game state variables
let gameState = {
    playerResources: 0,
    aiResources: 0,
    currentTurn: 'player',
    playerHand: [],
    aiHand: [],
    playerZones: {
        'player-left': null,
        'player-center': null,
        'player-right': null
    },
    aiZones: {
        'ai-left': null,
        'ai-center': null,
        'ai-right': null
    },
    draggedCard: null,
    tutorialStep: 0,
    selectedTutorial: null, // Will store which tutorial is being played
    dragStartX: 0,
    dragStartY: 0,
    tutorialRewardsGiven: {}, // Track which tutorials have given rewards
    selectedTutorialStage: parseInt(localStorage.getItem('selectedTutorialStage')) || 0,
    tutorialDeck: null,
};

// Remove the global draggedCard variable since it's in gameState
let isDragging = false;
let startX = 0;
let startY = 0;
let originalParent = null;
let originalPosition = null;

// Add cooldown control
let canProgress = true;
const STEP_COOLDOWN = 1500; // 1.5 seconds in milliseconds

// Add this at the top with other game state variables
let confrontationComplete = false;

// Remove the tutorialConfigs object from here and update the reference
function getTutorialSteps() {
    const tutorialType = getTutorialType(gameState.selectedTutorialStage);
    return tutorialConfigs[tutorialType]?.steps || tutorialConfigs['units'].steps;
}

// Highlight control functions
function highlightElement(selector) {
    // Remove any existing highlights
    removeHighlights();
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        // Create highlight overlay
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        
        // Position the highlight over the element
        const rect = element.getBoundingClientRect();
        highlight.style.top = `${rect.top}px`;
        highlight.style.left = `${rect.left}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        
        document.body.appendChild(highlight);
    });
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.tutorial-highlight');
    highlights.forEach(highlight => highlight.remove());
}

// Add these helper functions for tutorial actions
function highlightCardStats() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const stats = card.querySelector('.card-stats');
        if (stats) {
            stats.classList.add('highlight-stats');
        }
    });
}

function showAttackPatterns() {
    const playerZones = document.querySelectorAll('.player-zone');
    const aiZones = document.querySelectorAll('.ai-zone');
    
    playerZones.forEach((zone, index) => {
        const arrow = document.createElement('div');
        arrow.className = 'attack-arrow';
        arrow.style.top = `${zone.offsetTop}px`;
        arrow.style.left = `${zone.offsetLeft + zone.offsetWidth/2}px`;
        document.body.appendChild(arrow);
    });
}

function removeZoneHighlights() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach(zone => zone.classList.remove('highlight'));
}

// Game loop control
function startGameLoop() {
    // Get the selected tutorial type from localStorage
    const selectedStage = parseInt(localStorage.getItem('selectedTutorialStage')) || 0;
    gameState.selectedTutorial = getTutorialType(selectedStage);
    
    // Load the appropriate tutorial configuration
    const tutorialConfig = tutorialConfigs[gameState.selectedTutorial];
    if (!tutorialConfig) {
        console.error('Tutorial configuration not found');
        return;
    }
    
    // Initialize the tutorial steps
    gameState.tutorialSteps = tutorialConfig.steps;
    showCurrentStep();
}

function showCurrentStep() {
    const currentStep = gameState.tutorialSteps[gameState.tutorialStep];
    if (!currentStep) return;

    // Update tutorial dialogue
    updateTutorialDialogue(currentStep.message);
    
    // Highlight relevant elements
    if (currentStep.highlight) {
        highlightElement(currentStep.highlight);
    }
    
    // Execute any tutorial-specific actions
    if (currentStep.action) {
        executeTutorialAction(currentStep.action);
    }
}

function executeTutorialAction(action) {
    const currentStep = gameState.tutorialSteps[gameState.tutorialStep];
    
    switch (action) {
        case 'showHand':
            renderPlayerHand();
            break;
        case 'highlightStats':
            if (currentStep.message.includes('combat value')) {
                highlightCombatStats();
            } else if (currentStep.message.includes('resource value')) {
                highlightResourceStats();
            }
            break;
        case 'enableDrag':
            const card = document.querySelector('.tutorial-card-container .card');
            if (card) {
                card.classList.add('draggable');
                enableDragAndDrop(card);
            }
            break;
        case 'showAttackPath':
            showAttackPatterns();
            break;
        case 'playAICard':
            playOpponentStarCard();
            break;
        case 'startConfrontation':
            confrontationComplete = false; // Reset the flag
            revealCardsAndCombat(0);
            break;
    }
}

function checkStepCompletion(action) {
    const currentStep = gameState.tutorialSteps[gameState.tutorialStep];
    if (currentStep.requiredAction === action) {
        if (action === 'viewCard') {
            // Auto-progress after showing stats for a moment
            setTimeout(() => {
                startProgressCooldown();
                nextTutorialStep();
            }, 2000);
        } else {
            startProgressCooldown();
            nextTutorialStep();
        }
    }
}

// Add step progression controls
function setupProgressControls() {
    document.addEventListener('click', handleProgressAttempt);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            handleProgressAttempt();
        }
    });
}

function handleProgressAttempt() {
    if (!canProgress) return;
    
    const currentStep = gameState.tutorialSteps[gameState.tutorialStep];
    if (!currentStep?.requiredAction) {
        // Only allow progress if we're not in confrontation or if confrontation is complete
        if (currentStep?.action === 'startConfrontation' && !confrontationComplete) {
            return;
        }
        startProgressCooldown();
        nextTutorialStep();
    }
}

function startProgressCooldown() {
    canProgress = false;
    setTimeout(() => {
        canProgress = true;
    }, STEP_COOLDOWN);
}

// Helper function to determine tutorial type from stage number
function getTutorialType(stageIndex) {
    const tutorialTypes = {
        0: 'units',
        1: 'lands',
        // Add more mappings as needed
    };
    return tutorialTypes[stageIndex] || 'units';
}

// Update the handleDragEnd function to include tutorial progression
function handleDragEnd(e) {
    if (!isDragging) return;
    
    const zone = getDropZone(e.clientX, e.clientY);
    if (zone && isValidZone(zone)) {
        placeCard(gameState.draggedCard, zone);
        checkStepCompletion('placeCard');
    } else {
        returnCardToHand();
    }

    isDragging = false;
    gameState.draggedCard.classList.remove('dragging');
    removeZoneHighlights();
}

// Add this function after the gameState declaration
function renderPlayerHand(card) {
    const cardContainer = document.querySelector('.tutorial-card-container');
    if (!cardContainer) return;
    
    // Clear existing content
    cardContainer.innerHTML = '';
    
    // Get the player's deck from localStorage
    const tutorialPlayerDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
    if (!tutorialPlayerDeck || !tutorialPlayerDeck.cards || !tutorialPlayerDeck.cards.length) {
        console.error('Player deck not found or empty');
        return;
    }

    // Only show card for units tutorial
    if (gameState.selectedTutorial === 'units') {
        const tutorialCard = tutorialPlayerDeck.cards[0];
        const cardElement = createCardElement(tutorialCard);
        cardContainer.appendChild(cardElement);
        cardContainer.style.display = 'block';
    } 
    else if (gameState.selectedTutorial === 'lands') {
        const tutorialCard = tutorialPlayerDeck.cards.find(card => card.id === 10);
        if (tutorialCard) {
            const cardElement = createCardElement(tutorialCard);
            cardContainer.appendChild(cardElement);
            cardContainer.style.display = 'block';
        }
    }
    else {
        cardContainer.style.display = 'none';
    }
}

// Add this helper function if not already present
function createCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'card draggable';
    card.draggable = true;
    
    // Store the complete card data
    card.dataset.cardId = cardData.id;
    card.dataset.cardData = JSON.stringify(cardData);
    
    // Set the card's background image
    card.style.backgroundImage = `url('${cardData.image}')`;
    
    // Add card name
    const nameElement = document.createElement('div');
    nameElement.className = 'card-name';
    nameElement.textContent = cardData.cardName;
    card.appendChild(nameElement);
    
    // Add stats container
    const statsContainer = document.createElement('div');
    statsContainer.className = 'card-stats';
    
    // Add resource value
    const resourceElement = document.createElement('div');
    resourceElement.className = 'resource-value';
    resourceElement.textContent = cardData.rawResource;
    statsContainer.appendChild(resourceElement);
    
    // Add combat value
    const combatElement = document.createElement('div');
    combatElement.className = 'combat-value';
    combatElement.textContent = cardData.rawCombat;
    statsContainer.appendChild(combatElement);
    
    card.appendChild(statsContainer);
    
    return card;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    initializeZones();
    setupDragAndDrop();
    startGameLoop();
    setupProgressControls();
    initializeTutorialCards();
    
    // Get tutorial steps from config
    gameState.tutorialSteps = getTutorialSteps();
});

// Add these functions after the tutorialConfigs declaration

function nextTutorialStep() {
    gameState.tutorialStep++;
    if (gameState.tutorialStep < gameState.tutorialSteps.length) {
        // Remove existing highlights and effects before showing next step
        removeHighlights();
        removeZoneHighlights();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const stats = card.querySelector('.card-stats');
            if (stats) {
                stats.classList.remove('highlight-stats');
            }
        });
        
        // Show the next step
        showCurrentStep();
    } else {
        // Tutorial complete
        completeTutorial();
    }
}

function completeTutorial() {
    // Remove all tutorial elements
    removeHighlights();
    removeZoneHighlights();
    
    // Show completion message
    updateTutorialDialogue("Tutorial Complete! Well done!");
    
    // Add a slight delay before redirecting
    setTimeout(() => {
        window.location.href = 'tutorial.html';
    }, 2000);
}

// Add function to enable drag and drop
function enableDragAndDrop(card) {
    card.classList.add('draggable');
    card.setAttribute('draggable', true);
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
}

// Add this helper function
function getTutorialCardData(element) {
    const cardId = parseInt(element.dataset.cardId);
    
    // Find the card in tutorialCards array
    const tutorialCard = window.tutorialCards.find(card => card.id === cardId);
    if (!tutorialCard) {
        console.error('No tutorial card found for ID:', cardId);
        return null;
    }
    
    return {
        id: tutorialCard.id,
        type: tutorialCard.type,
        name: tutorialCard.name,
        cardName: tutorialCard.cardName,
        image: tutorialCard.image,
        resource: tutorialCard.resource,
        combat: tutorialCard.combat,
        rawResource: tutorialCard.rawResource,
        rawCombat: tutorialCard.rawCombat,
        effect: tutorialCard.effect,
        faction: tutorialCard.faction,
        placement: tutorialCard.placement,
        status: tutorialCard.status
    };
}

function handleDragStart(e) {
    if (!e.target.classList.contains('draggable')) return;
    
    gameState.draggedCard = e.target;
    
    // Hide the card viewer/container
    const cardContainer = document.querySelector('.tutorial-card-container');
    if (cardContainer) {
        cardContainer.style.visibility = 'hidden';
    }
    
    // Setup drag effect
    e.target.classList.add('dragging');
    e.target.style.opacity = '0.4';
    
    // Get and store card data
    const cardData = getTutorialCardData(e.target);
    if (cardData) {
        try {
            const jsonData = JSON.stringify(cardData);
            e.dataTransfer.setData('application/json', jsonData);
            e.dataTransfer.setData('text/plain', jsonData);
            gameState.draggedCard.dataset.cardData = jsonData;
        } catch (error) {
            console.error('Error in drag start:', error);
        }
    }
    
    e.dataTransfer.effectAllowed = 'move';
}

// Update handleTouchStart to use the same card data
function handleTouchStart(e) {
    if (!e.target.classList.contains('draggable')) return;
    
    e.preventDefault();
    gameState.draggedCard = e.target;
    
    // Add dragging class and setup styling
    gameState.draggedCard.classList.add('dragging', 'dragging-source');
    
    const touch = e.touches[0];
    gameState.dragStartX = touch.clientX - gameState.draggedCard.offsetLeft;
    gameState.dragStartY = touch.clientY - gameState.draggedCard.offsetTop;
    
    // Set initial position
    gameState.draggedCard.style.position = 'fixed';
    gameState.draggedCard.style.zIndex = '1000';
    gameState.draggedCard.style.left = `${touch.clientX}px`;
    gameState.draggedCard.style.top = `${touch.clientY}px`;
    gameState.draggedCard.style.transform = 'translate(-50%, -50%)';
    
    // Get and store card data
    const cardData = getTutorialCardData(e.target);
    if (cardData) {
        gameState.draggedCard.dataset.cardData = JSON.stringify(cardData);
    }
}

function handleTouchMove(e) {
    if (!gameState.draggedCard) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    // Update position to follow finger exactly
    gameState.draggedCard.style.left = `${touch.clientX}px`;
    gameState.draggedCard.style.top = `${touch.clientY}px`;
    gameState.draggedCard.style.transform = 'translate(-50%, -50%)';
    
    // Check for potential drop zones
    const zones = document.querySelectorAll('.player-zone');
    zones.forEach(zone => {
        const rect = zone.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            zone.classList.add('highlight');
        } else {
            zone.classList.remove('highlight');
        }
    });
}

function handleTouchEnd(e) {
    if (!gameState.draggedCard) return;
    e.preventDefault();
    
    const touch = e.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dropZone && dropZone.closest('.player-zone')) {
        const zone = dropZone.closest('.player-zone');
        const cardData = JSON.parse(gameState.draggedCard.dataset.cardData || '{}');
        
        // Reset card styling
        gameState.draggedCard.style.position = '';
        gameState.draggedCard.style.zIndex = '';
        gameState.draggedCard.style.left = '';
        gameState.draggedCard.style.top = '';
        gameState.draggedCard.style.transform = '';
        gameState.draggedCard.classList.remove('dragging', 'dragging-source');
        
        handleDrop({ preventDefault: () => {}, currentTarget: zone });
    } else {
        // Reset card if not dropped in a valid zone
        gameState.draggedCard.style.position = '';
        gameState.draggedCard.style.zIndex = '';
        gameState.draggedCard.style.left = '';
        gameState.draggedCard.style.top = '';
        gameState.draggedCard.style.transform = '';
        gameState.draggedCard.classList.remove('dragging', 'dragging-source');
    }
    
    // Remove all highlights
    document.querySelectorAll('.zone').forEach(zone => {
        zone.classList.remove('highlight');
    });
    
    gameState.draggedCard = null;
}

// Update the initializeGame function
function initializeGame() {
    // Set up initial game state
    document.getElementById('player-resources').textContent = gameState.playerResources;
    document.getElementById('ai-resources').textContent = gameState.aiResources;
    document.getElementById('current-turn').textContent = 
        gameState.currentTurn === 'player' ? 'Your Turn' : 'AI Turn';

    // Initialize the tutorial card container if it's the units tutorial
    const selectedStage = parseInt(localStorage.getItem('selectedTutorialStage')) || 0;
    if (getTutorialType(selectedStage) === 'units') {
        // Get the player's deck from localStorage
        const tutorialPlayerDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
        if (!tutorialPlayerDeck || !tutorialPlayerDeck.cards || !tutorialPlayerDeck.cards.length) {
            console.error('Player deck not found or empty');
            return;
        }

        // Use the first card from the player's deck
        const tutorialCard = tutorialPlayerDeck.cards[0];
        
        // Initialize the tutorial card
        const cardContainer = document.querySelector('.tutorial-card-container');
        if (cardContainer) {
            cardContainer.innerHTML = '';
            const cardElement = createCardElement(tutorialCard);
            cardContainer.appendChild(cardElement);
            cardContainer.style.display = 'block';
        }
    }
    else if (getTutorialType(selectedStage) === 'lands') {
        // Get the player's deck from localStorage
        const tutorialPlayerDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
        if (!tutorialPlayerDeck || !tutorialPlayerDeck.cards || !tutorialPlayerDeck.cards.length) {
            console.error('Player deck not found or empty');
            return;
        }

        // Use the land card (id 10) from the deck
        const tutorialCard = tutorialPlayerDeck.cards.find(card => card.id === 10);
        
        // Initialize the tutorial card
        const cardContainer = document.querySelector('.tutorial-card-container');
        if (cardContainer) {
            cardContainer.innerHTML = '';
            const cardElement = createCardElement(tutorialCard);
            cardContainer.appendChild(cardElement);
            cardContainer.style.display = 'block';
        }
    }
}

// Add this function near the other UI update functions
function updateTutorialDialogue(message) {
    const dialogueElement = document.getElementById('tutorial-dialogue');
    if (dialogueElement) {
        dialogueElement.textContent = message;
    }
}

// Add these new functions for stat highlighting
function highlightCombatStats() {
    const combatValue = document.querySelector('.combat-value');
    if (combatValue) {
        combatValue.classList.add('highlight');
        setTimeout(() => {
            combatValue.classList.remove('highlight');
        }, STEP_COOLDOWN);
    }
}

function highlightResourceStats() {
    const resourceValue = document.querySelector('.resource-value');
    if (resourceValue) {
        resourceValue.classList.add('highlight');
        setTimeout(() => {
            resourceValue.classList.remove('highlight');
        }, STEP_COOLDOWN);
    }
}

// Update the drag and drop functionality
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.card.draggable');
    
    cards.forEach(card => {
        // Remove existing listeners first to prevent duplicates
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragend', handleDragEnd);
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
        
        // Add new listeners
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('touchstart', handleTouchStart);
        card.addEventListener('touchmove', handleTouchMove);
        card.addEventListener('touchend', handleTouchEnd);
    });

    const playerZones = document.querySelectorAll('.player-zone');
    playerZones.forEach(zone => {
        // Remove existing listeners
        zone.removeEventListener('dragover', handleDragOver);
        zone.removeEventListener('dragleave', handleDragLeave);
        zone.removeEventListener('drop', handleDrop);
        
        // Add new listeners
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    
    if (!zone.classList.contains('player-zone')) {
        e.dataTransfer.dropEffect = 'none';
        return;
    }
    
    let cardData;
    try {
        // Try both MIME types
        const jsonData = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        cardData = JSON.parse(jsonData);
    } catch (error) {
        if (gameState.draggedCard) {
            try {
                cardData = JSON.parse(gameState.draggedCard.dataset.cardData);
            } catch (innerError) {
                console.error('Error parsing card data from element:', innerError);
                cardData = { type: 'unit' };
            }
        } else {
            cardData = { type: 'unit' };
        }
    }
    
    const row = zone.querySelector(`.row[data-type="${cardData.type}"]`);
    if (row && row.children.length < 3) {
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('highlight');
    } else {
        e.dataTransfer.dropEffect = 'none';
        zone.classList.remove('highlight');
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('highlight');
}

function handleDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('highlight');
    
    if (!zone.classList.contains('player-zone')) {
        return;
    }
    
    // Get the dragged card data
    let cardData;
    try {
        cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch (error) {
        if (gameState.draggedCard && gameState.draggedCard.dataset.cardData) {
            try {
                cardData = JSON.parse(gameState.draggedCard.dataset.cardData);
            } catch (innerError) {
                console.error('Error parsing card data from element:', innerError);
                return;
            }
        } else {
            return;
        }
    }
    
    // Create and add the placed card
    const placedCard = document.createElement('div');
    placedCard.className = 'placed-card';
    placedCard.style.backgroundImage = `url('${cardData.image}')`;
    placedCard.dataset.cardId = cardData.id;
    
    // Add combat circle
    const combatCircle = document.createElement('div');
    combatCircle.className = 'combat-circle';
    combatCircle.textContent = cardData.rawCombat;
    placedCard.appendChild(combatCircle);
    
    // Add resource circle
    const resourceCircle = document.createElement('div');
    resourceCircle.className = 'resource-circle';
    resourceCircle.textContent = cardData.rawResource;
    placedCard.appendChild(resourceCircle);
    
    // Find or create the appropriate row and add the card
    let row = zone.querySelector(`.row[data-type="unit"]`);
    if (!row) {
        row = document.createElement('div');
        row.className = 'row';
        row.dataset.type = 'unit';
        zone.appendChild(row);
    }
    
    row.appendChild(placedCard);
    
    // Remove the original card
    if (gameState.draggedCard) {
        gameState.draggedCard.remove();
    }
    
    // Update game state
    const zoneId = zone.id;
    gameState.playerZones[zoneId] = cardData.id;
    
    // Check tutorial completion
    checkStepCompletion('placeCard');
}

function handleDragEnd(e) {
    if (gameState.draggedCard) {
        gameState.draggedCard.classList.remove('dragging');
        gameState.draggedCard.style.opacity = '';
    }
    
    // Remove all highlights
    document.querySelectorAll('.zone').forEach(zone => {
        zone.classList.remove('highlight');
    });
    
    gameState.draggedCard = null;
}

// Update zone initialization
function initializeZones() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach(zone => {
        // Create rows for different card types if they don't exist
        ['unit', 'power-up', 'land'].forEach(type => {
            if (!zone.querySelector(`.row[data-type="${type}"]`)) {
                const row = document.createElement('div');
                row.className = 'row';
                row.dataset.type = type;
                zone.appendChild(row);
            }
        });
    });
}

// Add this function to initialize everything properly
function initializeCardContainer() {
    const cardContainer = document.querySelector('.tutorial-card-container');
    if (!cardContainer) return;
    
    // Get the tutorial card data
    const tutorialPlayerDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
    if (!tutorialPlayerDeck || !tutorialPlayerDeck.cards || !tutorialPlayerDeck.cards.length) {
        console.error('Player deck not found or empty');
        return;
    }
    
    // Create and add the card
    const tutorialCard = tutorialPlayerDeck.cards[0];
    const cardElement = createCardElement(tutorialCard);
    cardContainer.innerHTML = '';
    cardContainer.appendChild(cardElement);
    
    // Set up drag and drop
    setupDragAndDrop();
}

// Call this in your initialization code
document.addEventListener('DOMContentLoaded', () => {
    initializeZones();
    initializeCardContainer();
    // ... rest of your initialization code
});

// Add this new function to handle playing the opponent's star card
function playOpponentStarCard() {
    // Get the AI deck data
    const tutorialAIDeck = JSON.parse(localStorage.getItem('tutorialAIDeck'));
    if (!tutorialAIDeck || !tutorialAIDeck.starCard) {
        console.error('AI deck or star card not found');
        return;
    }

    // Find which zone the player's card is in
    let playerZoneId = null;
    for (const [zoneId, cardId] of Object.entries(gameState.playerZones)) {
        if (cardId !== null) {
            playerZoneId = zoneId;
            break;
        }
    }

    if (!playerZoneId) {
        console.error('No player card found in zones');
        return;
    }

    // Map player zone to AI zone
    const zoneMap = {
        'player-left': 'ai-left',
        'player-center': 'ai-center',
        'player-right': 'ai-right'
    };

    const aiZoneId = zoneMap[playerZoneId];
    const aiZone = document.getElementById(aiZoneId);
    
    if (!aiZone) {
        console.error('AI zone not found');
        return;
    }

    // Create and add the AI card with a delay
    setTimeout(() => {
        const placedCard = document.createElement('div');
        placedCard.className = 'placed-card';
        placedCard.style.backgroundImage = `url('${tutorialAIDeck.starCard.image}')`;
        
        // Add combat circle
        const combatCircle = document.createElement('div');
        combatCircle.className = 'combat-circle';
        combatCircle.textContent = tutorialAIDeck.starCard.rawCombat;
        placedCard.appendChild(combatCircle);
        
        // Add resource circle
        const resourceCircle = document.createElement('div');
        resourceCircle.className = 'resource-circle';
        resourceCircle.textContent = tutorialAIDeck.starCard.rawResource;
        placedCard.appendChild(resourceCircle);
        
        // Find or create the unit row
        let row = aiZone.querySelector('.row[data-type="unit"]');
        if (!row) {
            row = document.createElement('div');
            row.className = 'row';
            row.dataset.type = 'unit';
            aiZone.appendChild(row);
        }
        
        // Add the card to the zone
        row.appendChild(placedCard);
        
        // Update game state
        gameState.aiZones[aiZoneId] = tutorialAIDeck.starCard.id;
    }, 1500); // Delay the card placement

    // Add a click handler to progress to the next step
    document.addEventListener('click', function progressHandler() {
        // Remove this event listener to prevent multiple triggers
        document.removeEventListener('click', progressHandler);
        nextTutorialStep();
    }, { once: true }); // Using once: true as an alternative way to ensure one-time execution
}

// Add this function to handle card revealing and combat in tutorial
function revealCardsAndCombat(zoneIndex = 0) {
    if (zoneIndex >= 3) {
        // All zones have been processed
        confrontationComplete = true;
        return;
    }

    // Get the current zone elements
    const playerZone = document.querySelector(`#player-${['left', 'center', 'right'][zoneIndex]}`);
    const aiZone = document.querySelector(`#ai-${['left', 'center', 'right'][zoneIndex]}`);

    // Check if there are cards in both zones
    const playerCards = playerZone.querySelectorAll('.placed-card');
    const aiCards = aiZone.querySelectorAll('.placed-card');

    if (playerCards.length === 0 || aiCards.length === 0) {
        // No cards in one or both zones, move to next zone
        revealCardsAndCombat(zoneIndex + 1);
        return;
    }

    // Check if all cards are already face up
    const allCardsRevealed = Array.from(aiCards).every(card => 
        card.dataset.isFaceDown === 'false' || !card.dataset.isFaceDown
    );

    if (allCardsRevealed) {
        // Cards are already revealed, proceed to combat after delay
        setTimeout(() => {
            resolveCombat(zoneIndex);
            // Move to next zone after combat
            setTimeout(() => {
                revealCardsAndCombat(zoneIndex + 1);
            }, 1500);
        }, 1500);
        return;
    }

    // Reveal cards in sequence
    const landCards = aiZone.querySelectorAll('.row[data-type="land"] .placed-card');
    const unitCards = aiZone.querySelectorAll('.row[data-type="unit"] .placed-card');
    const powerUpCards = aiZone.querySelectorAll('.row[data-type="power-up"] .placed-card');

    function flipCardsSequentially(cards, index, callback) {
        if (index >= cards.length) {
            if (callback) callback();
            return;
        }
        const card = cards[index];
        if (!card.dataset.realImage) {
            flipCardsSequentially(cards, index + 1, callback);
            return;
        }

        setTimeout(() => {
            card.style.backgroundImage = `url('${card.dataset.realImage}')`;
            card.style.backgroundSize = 'cover';
            card.dataset.isFaceDown = 'false';
            addCardNumbers(card);
            flipCardsSequentially(cards, index + 1, callback);
        }, 1000);
    }

    // Flip cards in sequence, then proceed to combat
    flipCardsSequentially(Array.from(unitCards), 0, () => {
        flipCardsSequentially(Array.from(landCards), 0, () => {
            flipCardsSequentially(Array.from(powerUpCards), 0, () => {
                setTimeout(() => {
                    resolveCombat(zoneIndex);
                    setTimeout(() => {
                        revealCardsAndCombat(zoneIndex + 1);
                    }, 1500);
                }, 1500);
            });
        });
    });
}

// Helper function to add card numbers (combat/resource values)
function addCardNumbers(card) {
    // Remove existing circles if any
    const existingCircles = card.querySelectorAll('.combat-circle, .resource-circle');
    existingCircles.forEach(circle => circle.remove());

    // Add combat circle
    const combatCircle = document.createElement('div');
    combatCircle.className = 'combat-circle';
    combatCircle.textContent = card.dataset.rawCombat;
    card.appendChild(combatCircle);

    // Add resource circle
    const resourceCircle = document.createElement('div');
    resourceCircle.className = 'resource-circle';
    resourceCircle.textContent = card.dataset.rawResource;
    card.appendChild(resourceCircle);
}

// Add these combat-related functions
function resolveCombat(zoneIndex) {
    const userZone = document.querySelector(`#player-${['left', 'center', 'right'][zoneIndex]}`);
    const opponentZone = document.querySelector(`#ai-${['left', 'center', 'right'][zoneIndex]}`);

    const userUnitCard = userZone.querySelector('.row[data-type="unit"] .placed-card');
    const opponentUnitCard = opponentZone.querySelector('.row[data-type="unit"] .placed-card');
    
    // Get base combat values
    let userUnitCombat = userUnitCard ? parseInt(userUnitCard.dataset.rawCombat || 0, 10) : 0;
    let opponentUnitCombat = opponentUnitCard ? parseInt(opponentUnitCard.dataset.rawCombat || 0, 10) : 0;

    let zoneWinner = null;

    // Determine winner and mark defeated units
    if (userUnitCombat > opponentUnitCombat) {
        // Player wins - grey out opponent's unit
        if (opponentUnitCard) {
            opponentUnitCard.style.filter = 'grayscale(100%)';
            opponentUnitCard.style.opacity = '0.7';
        }
        applyGlowToLand(opponentZone, 'user');
        zoneWinner = 'user';
    } else if (userUnitCombat < opponentUnitCombat) {
        // AI wins - grey out player's unit
        if (userUnitCard) {
            userUnitCard.style.filter = 'grayscale(100%)';
            userUnitCard.style.opacity = '0.7';
        }
        applyGlowToLand(userZone, 'ai');
        zoneWinner = 'ai';
    } else {
        // Tie - grey out both units
        if (userUnitCard) {
            userUnitCard.style.filter = 'grayscale(50%)';
            userUnitCard.style.opacity = '0.85';
        }
        if (opponentUnitCard) {
            opponentUnitCard.style.filter = 'grayscale(50%)';
            opponentUnitCard.style.opacity = '0.85';
        }
        zoneWinner = 'tie';
    }

    // Update resources based on winner
    calculateAndUpdateResourcePoints(userZone, opponentZone, zoneWinner);

    // After combat resolution, check if player won and handle rewards
    if (zoneIndex === 0) { // Check if this is the first zone
        setTimeout(() => {
            //checkTutorialCompletion(zoneWinner);
            checkTutorialCompletion('user');
        }, 1500);
    }
}

function applyGlowToLand(zone, winner) {
    const landRow = zone.querySelector('.row[data-type="land"]');
    if (landRow) {
        // Remove any existing auras first
        landRow.classList.remove('aura-light-blue', 'aura-light-red');
        // Add the appropriate aura
        landRow.classList.add(winner === 'user' ? 'aura-light-blue' : 'aura-light-red');
    }
}

function calculateAndUpdateResourcePoints(userZone, opponentZone, zoneWinner) {
    const userUnitCard = userZone.querySelector('.row[data-type="unit"] .placed-card');
    const opponentUnitCard = opponentZone.querySelector('.row[data-type="unit"] .placed-card');

    // Get resource values
    const userResource = userUnitCard ? parseInt(userUnitCard.dataset.rawResource || 0, 10) : 0;
    const opponentResource = opponentUnitCard ? parseInt(opponentUnitCard.dataset.rawResource || 0, 10) : 0;

    // Update resources based on winner
    if (zoneWinner === 'user') {
        gameState.playerResources += userResource;
        updateResourceDisplay('player', gameState.playerResources);
    } else if (zoneWinner === 'ai') {
        gameState.aiResources += opponentResource;
        updateResourceDisplay('ai', gameState.aiResources);
    }
    // No resources awarded for ties
}

function updateResourceDisplay(player, value) {
    const element = document.getElementById(`${player}-resources`);
    if (element) {
        element.textContent = value;
    }
}

function checkTutorialCompletion() {
    const selectedStage = parseInt(localStorage.getItem('selectedTutorialStage')) || 0;
    const stageConfig = stages[selectedStage];
    
    if (!stageConfig) {
        console.error('Stage configuration not found');
        return;
    }

    // Check if this stage was already completed
    const wasCompleted = localStorage.getItem(`tutorial_${selectedStage}_completed`) === 'true';
    
    // Store completion data
    localStorage.setItem(`tutorial_${selectedStage}_completed`, 'true');
    localStorage.setItem('lastCompletedTutorial', JSON.stringify({
        stage: selectedStage,
        justCompleted: true,
        rewards: stageConfig.rewards
    }));
    
    // Update progress only if this is the first time completing this stage
    if (!wasCompleted) {
        // Get profile data
        let profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        
        // Calculate progress increment (1/total stages)
        const progressIncrement = (1 / stages.length) * 100;
        
        // Update tutorial progress in profile
        profileData.tutorialProgress = (profileData.tutorialProgress || 0) + progressIncrement;
        
        // Update current stage progress
        const currentProgress = parseInt(localStorage.getItem('tutorialProgress')) || 0;
        if (selectedStage >= currentProgress) {
            localStorage.setItem('tutorialProgress', (selectedStage + 1).toString());
        }
        
        // Save updated profile data
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }

    // Handle rewards
    handleTutorialRewards(stageConfig.rewards);
}

// Add this helper function to handle rewards
function handleTutorialRewards(rewards) {
    let profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    profileData.decks = profileData.decks || {};
    profileData.decks.tutorial = profileData.decks.tutorial || {
        name: "Tutorial Deck",
        cards: [],
        starCard: tutorialCards.find(card => card.id === 9)
    };

    if (rewards) {
        if (rewards.cards && rewards.cards.length > 0) {
            rewards.cards.forEach(cardId => {
                const cardData = tutorialCards.find(card => card.id === cardId);
                if (cardData) {
                    if (!profileData.cards?.some(c => c.id === cardId)) {
                        profileData.cards = profileData.cards || [];
                        profileData.cards.push(cardData);
                    }
                    if (!profileData.decks.tutorial.cards.some(c => c.id === cardId)) {
                        profileData.decks.tutorial.cards.push(cardData);
                    }
                }
            });
        }

        if (rewards.coins) {
            profileData.coins = (profileData.coins || 0) + rewards.coins;
        }
    }

    localStorage.setItem('profileData', JSON.stringify(profileData));
}

function showRewardAnimations(rewards) {
    console.log("Showing reward animations for:", rewards); // Debug log
    
    // Coin reward animation
    if (rewards.coins) {
        const coinReward = document.createElement('div');
        coinReward.className = 'coin-gain';
        coinReward.textContent = `+${rewards.coins}`;
        document.body.appendChild(coinReward);
        
        // Position near resource counter
        const resourceCounter = document.querySelector('.resource-counter.player-resources');
        if (resourceCounter) {
            const rect = resourceCounter.getBoundingClientRect();
            coinReward.style.left = `${rect.left}px`;
            coinReward.style.top = `${rect.top}px`;
        }
        
        // Update player's coins
        const currentCoins = parseInt(localStorage.getItem('playerCoins') || '0');
        localStorage.setItem('playerCoins', (currentCoins + rewards.coins).toString());
    }
    
    // Card rewards animation
    if (rewards.cards && rewards.cards.length > 0) {
        rewards.cards.forEach((cardFile, index) => {
            setTimeout(() => {
                // Add card to player's collection
                const playerCards = JSON.parse(localStorage.getItem('playerCards') || '[]');
                if (!playerCards.includes(cardFile)) {
                    playerCards.push(cardFile);
                    localStorage.setItem('playerCards', JSON.stringify(playerCards));
                }
                
                // Show card gain animation
                const cardReward = document.createElement('div');
                cardReward.className = 'card-reward-animation';
                cardReward.style.backgroundImage = `url('Individual_Cards/Tutorial/fronts/${cardFile}')`;
                document.body.appendChild(cardReward);
                
                // Add animation class after a small delay
                setTimeout(() => {
                    cardReward.classList.add('card-gained');
                }, 100);
            }, index * 1000); // Stagger card animations
        });
    }
}

// Add this function to initialize the tutorial cards
function initializeTutorialCards() {
    const stage = stages[gameState.selectedTutorialStage];
    if (!stage) return;

    const tutorialCardContainer = document.querySelector('.tutorial-card-container');
    if (!tutorialCardContainer) return;

    // Clear existing cards
    tutorialCardContainer.innerHTML = '';

    // Get the tutorial deck
    const tutorialDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
    if (!tutorialDeck || !tutorialDeck.cards) return;

    // For each tutorial stage, define which cards should be shown
    const stageCards = {
        0: [tutorialDeck.cards[0]], // Units tutorial - show starter unit
        1: [tutorialDeck.cards.find(card => card.type === 'land')], // Lands tutorial
        2: [tutorialDeck.cards.find(card => card.type === 'powerup')], // Power-ups tutorial
        // Add more stage-specific card configurations
    };

    // Get the cards for the current stage
    const cardsToShow = stageCards[gameState.selectedTutorialStage] || [tutorialDeck.cards[0]];

    // Create and display the cards
    cardsToShow.forEach(card => {
        if (!card) return;
        
        const cardElement = document.createElement('div');
        cardElement.className = 'tutorial-card';
        cardElement.style.backgroundImage = `url('${card.image}')`;
        cardElement.draggable = true;
        
        // Add drag event listeners
        cardElement.addEventListener('dragstart', handleDragStart);
        cardElement.addEventListener('dragend', handleDragEnd);
        
        tutorialCardContainer.appendChild(cardElement);
    });
}
