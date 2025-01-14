// Game state variables
let gameState = {
    playerResources: 3,
    aiResources: 3,
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
    selectedTutorial: null // Will store which tutorial is being played
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
                message: "This is a basic unit card. Notice its raw combat value.",
                highlight: '.card',
                action: 'highlightStats',
                requiredAction: 'viewCard'
            },
            {
                message: "As well as its raw resource value.",
                highlight: '.card',
                action: 'highlightStats',
                requiredAction: 'viewCard'
            },
            {
                message: "Try placing this unit in one of your zones.",
                highlight: '.player-zone',
                action: 'enableDrag',
                requiredAction: 'placeCard'
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
            highlightCardStats();
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
        startProgressCooldown();
        nextTutorialStep();
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
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.cardId = card.id;
    cardElement.innerHTML = `
        <div class="card-content">
            <img src="${card.image}" alt="${card.name}" class="card-image">
            <div class="card-stats">
                <span class="attack">${card.attack}</span>
                <span class="defense">${card.defense}</span>
            </div>
            <div class="card-name">${card.name}</div>
        </div>
    `;
    return cardElement;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
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
    card.addEventListener('mousedown', handleDragStart);
    card.addEventListener('touchstart', handleTouchStart);
}

// Update handleDragStart
function handleDragStart(e) {
    if (!e.target.classList.contains('draggable')) return;
    
    gameState.draggedCard = e.target;
    isDragging = true;
    
    if (e.type === 'mousedown') {
        startX = e.clientX - gameState.draggedCard.offsetLeft;
        startY = e.clientY - gameState.draggedCard.offsetTop;
    }
    
    gameState.draggedCard.classList.add('dragging');
    gameState.draggedCard.style.position = 'fixed';
    
    // Store original position for returning if drop is invalid
    originalParent = gameState.draggedCard.parentNode;
    originalPosition = {
        left: gameState.draggedCard.style.left,
        top: gameState.draggedCard.style.top
    };
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
