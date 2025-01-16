const stages = [
    { // Units
        x: 900, y: 400, 
        label: "Units", 
        rewards: {
            cards: [8, 10, 11]
        }
    },
    { // Lands
        x: 1200, y: 600, 
        label: "Lands", 
        rewards: {
            cards: [12, 13]
        }
    },
    { // Power-Ups
        x: 1500, y: 300, 
        label: "Power-Ups", 
        rewards: {
            cards: [15, 19]
        }
    },
    { // Civilisations
        x: 1800, y: 700, 
        label: "Civilisations",
        rewards: {
            cards: [2, 3]
        }
    },
    { // Combat basics
        x: 2100, y: 200, 
        label: "Combat basics",
        rewards: {
            coins: 10
        }
    },
    { // Effects
        x: 2400, y: 500, 
        label: "Effects",
        rewards: {
            cards: [5, 6]
        }
    },
    { // Deck Building
        x: 2600, y: 800, 
        label: "Deck Building",
        rewards: {
            cards: [0, 4]
        }
    },
    { // Strategy Basics
        x: 2800, y: 300, 
        label: "Strategy Basics",
        rewards: {
            coins: 10
        }
    },
    { // Advanced Tactics
        x: 3000, y: 600, 
        label: "Advanced Tactics",
        rewards: {
            cards: [20, 21]
        }
    },
    { // Final Challenge
        x: 3200, y: 400, 
        label: "Final Challenge",
        rewards: {
            cards: [7, 23, 22, 14, 16],
            coins: 50
        }
    }
]; 

// Add the tutorial configurations
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
            },
            {
                message: "You better leave them a lasting impression!",
                highlight: '.card',
                action: 'startConfrontation',
                requiredAction: null
            }
        ]
    },
    'lands': {
        steps: [
            {
                message: "Welcome to the lands tutorial! Here you'll learn how to use the lands to your advantage.",
                highlight: '.tutorial-card-container',
                action: 'showHand',
                requiredAction: null
            },
            {
                message: "This is a land card. It provides resources when placed.",
                highlight: '.tutorial-card-container',
                action: 'showHand',
                requiredAction: null
            },
            {
                message: "Place your land card in any zone.",
                highlight: '.player-zone',
                action: 'enableDrag',
                requiredAction: 'placeCard'
            },
            {
                message: "Great! Land cards generate resources each turn.",
                highlight: '.player-resources',
                action: 'updateResources',
                requiredAction: null
            },
            {
                message: "Your opponent has placed their card.",
                highlight: '.ai-zone',
                action: 'playAICard',
                requiredAction: null
            },
            {
                message: "Let's see how the resources affect the battle!",
                highlight: '.card',
                action: 'startConfrontation',
                requiredAction: null
            }
        ]
    }
    // Add more tutorial types here as needed
}; 