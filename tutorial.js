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
    dragStartY: 0
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

// Tutorial configurations for different types
const tutorialConfigs = {
    'units': {
        steps: [
            {
                message: "Welcome to the Units tutorial! Let's learn about different unit types.",
                highlight: '.tutorial-card-container',
                action: 'showHand',
                requiredAction: null
            },
            {
                message: "This is a basic unit card.",
                highlight: '.card',
                action: 'showHand',
                requiredAction: null
            },
            {
                message: "Notice its raw combat value. This is what your unit uses to fight!",
                highlight: '.card',
                action: 'highlightStats',
                requiredAction: null
            },
            {
                message: "As well as its raw resource value, these are the resources you need to win the game!",
                highlight: '.card',
                action: 'highlightStats',
                requiredAction: null
            },
            {
                message: "Try placing this unit in one of your zones.",
                highlight: '.player-zone',
                action: 'enableDrag',
                requiredAction: 'placeCard'
            },
            {
                message: "Prepare for confrontation!",
                highlight: '.card',
                action: 'toBeDone',
                requiredAction: null
            },
            {
                message: "Uh oh, it seems like your opponent sees you as a joke...",
                highlight: '.card',
                action: 'toBeDone',
                requiredAction: null
            },
            {
                message: "You better leave them a lasting impression!",
                highlight: '.card',
                action: 'toBeDone',
                requiredAction: null
            }
        ]
    },
    'combat': {
        steps: [
            {
                message: "Welcome to combat training! Here you'll learn how battles work.",
                highlight: '.game-area',
                action: null,
                requiredAction: null
            },
            {
                message: "Place your unit card in a zone facing an enemy unit.",
                highlight: '.player-zone',
                action: 'enableDrag',
                requiredAction: 'placeCard'
            },
            {
                message: "Units attack the zone directly in front of them.",
                highlight: '.ai-zone',
                action: 'showAttackPath',
                requiredAction: null
            }
        ]
    }
    // Add more tutorial types as needed
};

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
    switch (action) {
        case 'showHand':
            renderPlayerHand();
            break;
        case 'highlightStats':
            const currentStep = gameState.tutorialSteps[gameState.tutorialStep];
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
function getTutorialType(stageNumber) {
    const tutorialTypes = {
        0: 'units',
        1: 'combat',
        // Add more mappings as needed
    };
    return tutorialTypes[stageNumber] || 'units';
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
    
    // Only show card for units tutorial
    if (gameState.selectedTutorial === 'units' && card) {
        const cardElement = createCardElement(card);
        cardContainer.appendChild(cardElement);
        cardContainer.style.display = 'block';
    } else {
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
    
    console.log('Created card element with data:', JSON.parse(card.dataset.cardData));
    return card;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    initializeZones();
    setupDragAndDrop();
    startGameLoop();
    setupProgressControls();
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
    console.log('Getting data for card ID:', cardId);
    
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
    console.log('Drag start:', e.target);
    
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
            console.log('Card data set:', cardData);
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
        console.log('Touch card data set:', cardData);
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
}

// Add this function near the other UI update functions
function updateTutorialDialogue(message) {
    const dialogueElement = document.getElementById('tutorial-dialogue');
    if (dialogueElement) {
        dialogueElement.textContent = message;
    }
}

// Update renderPlayerHand to use the player's deck card
function renderPlayerHand() {
    const cardContainer = document.querySelector('.tutorial-card-container');
    if (!cardContainer) return;
    
    // Clear existing content
    cardContainer.innerHTML = '';
    
    // Only show card for units tutorial
    if (gameState.selectedTutorial === 'units') {
        // Get the player's deck from localStorage
        const tutorialPlayerDeck = JSON.parse(localStorage.getItem('tutorialPlayerDeck'));
        if (!tutorialPlayerDeck || !tutorialPlayerDeck.cards || !tutorialPlayerDeck.cards.length) {
            console.error('Player deck not found or empty');
            return;
        }

        // Use the first card from the player's deck
        const tutorialCard = tutorialPlayerDeck.cards[0];
        const cardElement = createCardElement(tutorialCard);
        cardContainer.appendChild(cardElement);
        cardContainer.style.display = 'block';
    } else {
        cardContainer.style.display = 'none';
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
    console.log('Setting up drag and drop for cards:', cards.length);
    
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
        
        console.log('Card data:', card.dataset.cardData);
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
    console.log('Dragging over zone:', zone.id);
    
    if (!zone.classList.contains('player-zone')) {
        console.log('Not a player zone, preventing drop');
        e.dataTransfer.dropEffect = 'none';
        return;
    }
    
    let cardData;
    try {
        // Try both MIME types
        const jsonData = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        cardData = JSON.parse(jsonData);
        console.log('Successfully got card data in dragOver:', cardData);
    } catch (error) {
        console.log('Using fallback card data from gameState');
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
    console.log('Drop event on zone:', zone.id);
    zone.classList.remove('highlight');
    
    if (!zone.classList.contains('player-zone')) {
        console.log('Not a player zone, canceling drop');
        return;
    }
    
    // Get the dragged card data
    let cardData;
    try {
        cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
        console.log('Successfully parsed card data:', cardData);
    } catch (error) {
        console.log('Error getting card data from dataTransfer, trying element data');
        if (gameState.draggedCard && gameState.draggedCard.dataset.cardData) {
            try {
                cardData = JSON.parse(gameState.draggedCard.dataset.cardData);
                console.log('Successfully parsed card data from element:', cardData);
            } catch (innerError) {
                console.error('Error parsing card data from element:', innerError);
                return;
            }
        } else {
            console.log('No dragged card in gameState, canceling drop');
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
        console.log('Removing original card');
        gameState.draggedCard.remove();
    }
    
    // Update game state
    const zoneId = zone.id;
    gameState.playerZones[zoneId] = cardData.id;
    console.log('Updated game state:', gameState.playerZones);
    
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
    
    console.log('Card container initialized with card:', tutorialCard);
}

// Call this in your initialization code
document.addEventListener('DOMContentLoaded', () => {
    initializeZones();
    initializeCardContainer();
    // ... rest of your initialization code
});
