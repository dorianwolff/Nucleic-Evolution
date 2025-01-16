// Effect structure : timing, zones affected, condition/requirements, parameter, typeAffected, description
const tutorialCards = [
    { id: 0, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 1, status: [], cardName: 'Nocturn',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/00.png' },

    { id: 1, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 5, combat: 3,rawResource: 5, rawCombat: 3, placement: 1, status: [], cardName: 'Slyde',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/01.png' },

    { id: 2, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 4, combat: 4,rawResource: 4, rawCombat: 4, placement: 1, status: [], cardName: 'Shogun',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/02.png' },

    { id: 3, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 6, combat: 2,rawResource: 6, rawCombat: 2, placement: 1, status: [], cardName: 'Paladin',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/03.png' },
    
    { id: 4, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 4, combat: 4,rawResource: 4, rawCombat: 4, placement: 1, status: [], cardName: 'Advent',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/04.png' },
    
    { id: 5, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 7, combat: 1,rawResource: 7, rawCombat: 1, placement: 1, status: [], cardName: 'Sylph',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/05.png' },

    { id: 6, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 6, combat: 2,rawResource: 6, rawCombat: 2, placement: 1, status: [], cardName: 'Castor',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/06.png' },
    
    { id: 7, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: -6, combat: 8,rawResource: -6, rawCombat: 8, placement: 1, status: [], cardName: 'Skull King',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/07.png' },

    { id: 8, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 5, combat: 3,rawResource: 5, rawCombat: 3, placement: 1, status: [], cardName: 'Trainee',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/08.png' },

    { id: 9, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 1, status: [], cardName: 'Apprentice',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/09.png' },

    { id: 10, name: 'Land Card', type: 'land', faction: ['basic'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 1, status: [], cardName: 'Sky Mount',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/10.png' },
    
    { id: 11, name: 'Land Card', type: 'land', faction: ['basic'], resource: 11, combat: 0,rawResource: 11, rawCombat: 0, placement: 1, status: [], cardName: 'Buisness District',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/11.png' },

    { id: 12, name: 'Power-Up Card', type: 'power up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Staff',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/12.png' },
    
    { id: 13, name: 'Power-Up Card', type: 'power up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Katana',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/13.png' },

    { id: 14, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Assassination',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/14.png' },
    
    { id: 15, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Leap',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/15.png' },

    { id: 16, name: 'Land Card', type: 'land', faction: ['basic'], resource: 9, combat: 0,rawResource: 9, rawCombat: 0, placement: 1, status: [], cardName: 'Wanderer\'s Route',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/16.png' },

    { id: 17, name: 'Power-Up Card', type: 'power up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Powerful Stick',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/17.png' },

    { id: 18, name: 'Power-Up Card', type: 'power up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Average Sword',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/18.png' },

    { id: 19, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'A New Dawn',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/19.png' },

    { id: 20, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'War Pluder',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/20.png' },

    { id: 21, name: 'Land Card', type: 'land', faction: ['basic'], resource: 10, combat: 0,rawResource: 10, rawCombat: 0, placement: 1, status: [], cardName: 'Forsaken Village',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/21.png' },

    { id: 22, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 4, combat: 1,rawResource: 4, rawCombat: 1, placement: 1, status: [], cardName: 'Fierce Retainer',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/22.png' },
    
    { id: 23, name: 'Unit Card', type: 'unit', faction: ['basic'], resource: 2, combat: 2,rawResource: 2, rawCombat: 2, placement: 1, status: [], cardName: 'Skeleton Soldier',
        effect: [['None']],
        image: 'Individual_Cards/Tutorial/fronts/23.png' },
];

window.tutorialCards = tutorialCards;
