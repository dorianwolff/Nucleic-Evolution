// Effect structure : timing, zones affected, condition/requirements, parameter, typeAffected, description
const cards = [
    { id: 1, name: 'Land Card', type: 'land', faction: ['insect'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 3, status: [], cardName: 'Wild Forest',
        effect: [['statChange','column','none','modifyCombat',1,'insect', 'none','+1 combat to ALL insects here'],
            ['statChange','column','none','modifyResource',2,'insect', 'none','+2 resource to ALL insects here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/049.png' },

    { id: 2, name: 'Land Card', type: 'land', faction: ['insect'], resource: 11, combat: 0,rawResource: 11, rawCombat: 0, placement: 3, status: [], cardName: 'World Tree',
        effect: [['statChange','column','none','modifyCombat','rawResourceFromSelf','none','none','ALL units here receive combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/050.png' },

    { id: 3, name: 'Land Card', type: 'land', faction: ['insect'], resource: 9, combat: 0,rawResource: 9, rawCombat: 0, placement: 2, status: [], cardName: 'Hive',
        effect: [['statChange','column','none','modifyCombat',2,'insect','none','+2 combat to ALL insects here'],
            ['statChange','column','none','modifyResource',1,'insect','none','+1 resource to ALL insects here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/051.png' },

    { id: 4, name: 'Land Card', type: 'land', faction: ['undead'], resource: 4, combat: 0,rawResource: 4, rawCombat: 0, placement: 3, status: [], cardName: 'Past\'s Remains',
        effect: [['typeChange','column','none','modifyUnitType','undead','none','none','ALL units here become undead and lose their other types']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/052.png' },

    { id: 5, name: 'Land Card', type: 'land', faction: ['undead'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 1, status: [], cardName: 'Spectre\'s Shrine',
        effect: [['if_defeated','column','none','additionalEffect','Shrine','none','none','If a unit which has an ability when it is defeated is defeated here, that ability is used an additional time (if possible)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/053.png' },

    { id: 6, name: 'Land Card', type: 'land', faction: ['undead'], resource: 6, combat: 0,rawResource: 6, rawCombat: 0, placement: 3, status: [], cardName: 'Graveyard',
        effect: [['statChange','column','none','modifyResource',3,'undead','none','+3 resource to ALL undead here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/054.png' },

    { id: 7, name: 'Land Card', type: 'land', faction: ['angel'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 3, status: [], cardName: 'Ceremony Hall',
        effect: [['statChange','column','none','modifyResource','countDefeated','angel',3,'angel','ALL angels here receive +3 resource for each defeated angel']], //changed effect - visuals
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/055.png' },

    { id: 8, name: 'Land Card', type: 'land', faction: ['angel'], resource: 12, combat: 0,rawResource: 12, rawCombat: 0, placement: 2, status: [], cardName: 'Oasis',
        effect: [['statChange','column','none','modifyCombat',1,'angel','none','+1 combat to ALL angels here'],
            ['statChange','column','none','modifyResource',1,'angel','none','+1 resource to ALL angels here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/056.png' },

    { id: 9, name: 'Land Card', type: 'land', faction: ['angel'], resource: 10, combat: 0,rawResource: 10, rawCombat: 0, placement: 2, status: [], cardName: 'Temple',
        effect: [['statChange','column','none','modifyCombat',3,'angel','none','+3 combat to ALL angels here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/057.png' },

    { id: 10, name: 'Land Card', type: 'land', faction: ['android'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 3, status: [], cardName: 'Hangar',
        effect: [['statChange', 'column','none','modifyCombat',2,'android','none','+2 combat to ALL androids here'],
            ['statChange','column','none','modifyResource',1,'android','none','+1 resource to ALL androids here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/058.png' },

    { id: 11, name: 'Land Card', type: 'land', faction: ['android'], resource: 5, combat: 0,rawResource: 5, rawCombat: 0, placement: 3, status: [], cardName: 'Arena',
        effect: [['preventStatChange','column','none','Arena','none','none','none','none','ALL units here cannot have their combat and resource values modified through non-unit abilities']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/059.png' },

    { id: 12, name: 'Land Card', type: 'land', faction: ['android'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 2, status: [], cardName: 'Carriers',
        effect: [['statChange','column','none','modifyCombat',1,'android','none','+1 combat to ALL androids here'],
            ['statChange','column','none','modifyResource',2,'android','none','+2 resource to ALL androids here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/060.png' },

    { id: 13, name: 'Land Card', type: 'land', faction: ['ancient'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 2, status: [], cardName: 'Ancient Times',
        effect: [['statChange','column','none','modifyResource',4,'ancient','none','+4 resource to ALL ancients here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/061.png' },

    { id: 14, name: 'Land Card', type: 'land', faction: ['ancient'], resource: 1, combat: 0,rawResource: 1, rawCombat: 0, placement: 1, status: [], cardName: 'Ancient Seal',
        effect: [['nullificationChangeSwap','column','none','replaceEffect','Ancient Seal','none','none','ALL units here have their abilities replaced by "+1 combat when an opponent\'s unit here is an ancient"']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/062.png' },

    { id: 15, name: 'Land Card', type: 'land', faction: ['ancient'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 3, status: [], cardName: 'Ancient Tomb',
        effect: [['statChange','column','none','modifyResource',1,'ancient','none','+1 resource to ALL ancients here'],
            ['statChange','column','none','modifyCombat',-1,'ancient','non','-1 combat to ALL non-ancients here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/063.png' },

    { id: 16, name: 'Land Card', type: 'land', faction: ['dragon'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 3, status: [], cardName: 'Seraphon',
        effect: [['statChange','column','none','modifyCombat',1,'dragon','none','+1 combat to ALL dragons here'],
            ['statChange','column','none','modifyResource',2,'dragon','none','+2 resource to ALL dragons here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/064.png' },

    { id: 17, name: 'Land Card', type: 'land', faction: ['dragon'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 1, status: [], cardName: 'Amberon',
        effect: [['if_defeated','column','none','additionalEffect','Amberon','none','none','If a unit is defeated here, if it has an ability when it defeats an enemy, that ability is used by that unit\'s possessor (if possible)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/065.png' },

    { id: 18, name: 'Land Card', type: 'land', faction: ['dragon'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 2, status: [], cardName: 'Aeron',
        effect: [['statChange','column','none','modifyCombat',2,'dragon','+2 combat to ALL dragons here'],
            ['statChange','column','none','modifyResource',1,'dragon','+1 resource to ALL dragons here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/066.png' },

    { id: 19, name: 'Land Card', type: 'land', faction: ['harpy'], resource: 9, combat: 0,rawResource: 9, rawCombat: 0, placement: 3, status: [], cardName: 'Harpy Nest',
        effect: [['statChange','column','none','modifyResource',3,'harpy','none','+3 resource to ALL harpies here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/067.png' },

    { id: 20, name: 'Land Card', type: 'land', faction: ['harpy'], resource: 6, combat: 0,rawResource: 6, rawCombat: 0, placement: 1, status: [], cardName: 'Skypia',
        effect: [['statChange','column','none','modifyResource',-2,'harpy','non','-2 resource to ALL non-harpies here']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/068.png' },

    { id: 21, name: 'Land Card', type: 'land', faction: ['harpy'], resource: 5, combat: 0,rawResource: 5, rawCombat: 0, placement: 2, status: [], cardName: 'Hunting Ground',
        effect: [['statChange','column','none','applyResourceConfrontation','none','none','none','ALL units here apply their resource instead of combat during confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/069.png' },

    { id: 22, name: 'Land Card', type: 'land', faction: ['basic'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 2, status: [], cardName: 'Observatory',
        effect: [['statChange','column','none','modifyCombat',2,'none','none','+2 combat to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/000.png' },

    { id: 23, name: 'Land Card', type: 'land', faction: ['basic'], resource: 6, combat: 0,rawResource: 6, rawCombat: 0, placement: 2, status: [], cardName: 'Toxic Forest',
        effect: [['statChange','column','none','modifyCombat',-1,'none','none','-1 combat ALL units here'],
            ['statChange','column','none','modifyResource',-1,'none','none','-1 resource to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/001.png' },

    { id: 24, name: 'Land Card', type: 'land', faction: ['basic'], resource: 4, combat: 0,rawResource: 4, rawCombat: 0, placement: 1, status: [], cardName: 'Desert',
        effect: [['statChange','column','none','modifyResource',-2,'none','none','-2 resource to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/002.png' },

    { id: 25, name: 'Land Card', type: 'land', faction: ['basic'], resource: 9, combat: 0,rawResource: 9, rawCombat: 0, placement: 3, status: [], cardName: 'Forgotten City',
        effect: [['statChange','column','none','modifyResource',2,'none','none','+2 resource to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/003.png' },

    { id: 26, name: 'Land Card', type: 'land', faction: ['basic'], resource: 3, combat: 0,rawResource: 3, rawCombat: 0, placement: 1, status: [], cardName: 'Forgotten Temple',
        effect: [['statChange','column','none','modifyResource',-1,'none','none','-1 resource to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/004.png' },

    { id: 27, name: 'Land Card', type: 'land', faction: ['basic'], resource: 10, combat: 0,rawResource: 10, rawCombat: 0, placement: 3, status: [], cardName: 'Fallen Nation',
        effect: [['preventStatChange','column','none','preventIncrease','Fallen Nation','none','none','The resource of ALL units here cannot increase']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/005.png' },

    { id: 28, name: 'Land Card', type: 'land', faction: ['basic'], resource: 7, combat: 0,rawResource: 7, rawCombat: 0, placement: 2, status: [], cardName: 'Silver Peak',
        effect: [['preventStatChange','column','none','preventDecrease','combat','none','none','The combat of ALL units here cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/006.png' },

    { id: 29, name: 'Land Card', type: 'land', faction: ['basic'], resource: 5, combat: 0,rawResource: 5, rawCombat: 0, placement: 1, status: [], cardName: 'Irruptive Site',
        effect: [['statChange','column','none','modifyCombat',-2,'none','none','-2 combat to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/007.png' },

    { id: 30, name: 'Land Card', type: 'land', faction: ['basic'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 2, status: [], cardName: 'Agitated Sea',
        effect: [['statChange','column','none','modifyCombat',-1,'none','none','-1 combat to ALL units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/008.png' },

    { id: 31, name: 'Land Card', type: 'land', faction: ['dinosaur'], resource: 8, combat: 0,rawResource: 8, rawCombat: 0, placement: 2, status: [], cardName: 'Jurassic',
        effect: [['statChange','column','none','modifyCombat',2,'dinosaur','none','+2 combat to ALL dinosaurs here']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/00.png' },

    { id: 32, name: 'Land Card', type: 'land', faction: ['dinosaur'], resource: 9, combat: 0,rawResource: 9, rawCombat: 0, placement: 3, status: [], cardName: 'Triassic',
        effect: [['statChange','column','none','modifyCombat',1,'dinosaur','none','+1 combat to ALL dinosaurs here'],
            ['statChange','column','none','modifyResource',1,'dinosaur','none','+1 resource to ALL dinosaurs here']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/01.png' },

    { id: 33, name: 'Land Card', type: 'land', faction: ['dinosaur'], resource: 6, combat: 0,rawResource: 6, rawCombat: 0, placement: 1, status: [], cardName: 'Cretaceous',// change while they are active
        effect: [['nullificationChangeSwap','column','none','nullifyActive','unit','none','none','Before confrontation, nullify the abilities of ALL units here']], //changed effect
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/02.png' },

    { id: 34, name: 'Land Card', type: 'land', faction: ['basic'], resource: 5, combat: 0,rawResource: 5, rawCombat: 0, placement: 1, status: [], cardName: 'War Zone',
        effect: [['if_defeated','all','none','modifyCombat',2,'none','none','If a unit is defeated here, ALL units receive +2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/03.png' },





    { id: 35, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 2, status: [], cardName: 'Mantis',
        effect: [['nullificationChangeSwap','ally','none','replaceEffect','Mantis','none','none','Before confrontation, replace this ability to all other units\' abilities in this zone (cannot copy abilities used before confrontation)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/000.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/070.png'},

    { id: 36, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 1, status: [], cardName: 'Vapor',
        effect: [['if_defeats_unit','all','none','modifyCombat','rawResourceFromSelf','none','If this unit defeats an opponent\'s unit, ALL units receive combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/001.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/071.png' },

    { id: 37, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 1,rawResource: 3, rawCombat: 1, placement: 2, status: [], cardName: 'Stinger',
        effect: [['statChange','ally','none','modifyCombat','highestInZone','none','none','Before confrontation, this unit receives combat equal to the unit\'s highest raw combat value in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/002.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/072.png' },

    { id: 38, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 2, combat: 7,rawResource: 2, rawCombat: 7, placement: 2, status: [], cardName: 'Centurion',
        effect: [['statChange','ally','none','modifyCombat','highestInZone','none',-2,'none','Before confrontation, if an opposing unit in this zone has lower raw combat, this unit receives -2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/003.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/074.png' },

    { id: 39, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 3,rawResource: 3, rawCombat: 3, placement: 3, status: [], cardName: 'Nommad',
        effect: [['statChange','ally','none','modifyCombat','highestResourceInZone','none','none','Before confrontation, this unit receives combat equal to the unit\'s highest raw resource value in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/004.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/073.png' },

    { id: 40, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 4, combat: 3,rawResource: 4, rawCombat: 3, placement: 3, status: [], cardName: 'Antique',
        effect: [['statChange','opposing','none','modifyCombat','minusRawResourceFromSelf','none','none','Before confrontation, ALL opposing units in this zone lose combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/005.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/075.png' },

    { id: 41, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 3, combat: 1,rawResource: 3, rawCombat: 1, placement: 2, status: [], cardName: 'Kaminari',
        effect: [['preventStatChange','ally','none','additionalEffect','Kaminari','none','none','All abilities of power ups modifying this unit\'s combat apply an additional time']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/006.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/076.png' },

    { id: 42, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 2, combat: 3,rawResource: 2, rawCombat: 3, placement: 2, status: [], cardName: 'Artemis',
        effect: [['statChange','ally','none','modifyResource','Artemis','angel',3,'Before confrontation, ALL angels receive +3 resource if this unit has less raw resource than an opposing unit in this zone']], //change so all angels in other zones + herself
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/007.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/078.png' },

    { id: 43, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 3, status: [], cardName: 'Lauriël',
        effect: [['preventStatChange','ally','none','additionalEffect','Lauriël','none','none','ALL unit abilities which modify resource are applied an additional time to this unit']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/008.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/077.png' },

    { id: 44, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 3, combat: 2,rawResource: 3, rawCombat: 2, placement: 2, status: [], cardName: 'Sauriël',
        effect: [['statChange','ally','none','modifyCombat','Sauriël','angel',3,'Before confrontation, ALL angels receive +3 combat if this unit has less raw combat than an opposing unit in this zone']], //change so all angels in other zones + herself
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/009.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/079.png' },

    { id: 45, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 5, combat: 3,rawResource: 5, rawCombat: 3, placement: 3, status: [], cardName: 'Michaël',
        effect: [['preventStatChange','ally','none','additionalEffect','Michaël','none','ALL unit abilities which modify combat are applied an additional time to this unit']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/010.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/080.png' },

    { id: 46, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 3, combat: 1,rawResource: 3, rawCombat: 1, placement: 1, status: [], cardName: 'Rachaël',
        effect: [['if_defeated','all','none','modifyCombat',3,'angel','none','If this unit is defeated, ALL angels receive +3 combat'],
            ['if_defeated','all','none','modifyResource',3,'angel','If this unit is defeated, ALL angels receive +3 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/011.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/081.png' },

    { id: 47, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 1, status: [], cardName: 'Nyx', //change visu full art
        effect: [['if_defeats_unit','all ally','none','modifyCombat',2,'none','none','If this unit defeats an opponent\'s unit, ALL your units receive +2 combat'],
            ['if_defeats_unit','all ally','none','modifyResource',1,'none','If this unit defeats an opponent\'s unit, ALL your units receive +1 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/012.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/082.png' },

    { id: 48, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 2, combat: 4,rawResource: 2, rawCombat: 4, placement: 1, status: [], cardName: 'Aurora',
        effect: [['if_defeats_unit','all ally','none','modifyCombat','Aurora','none','none','If this unit defeats an opponent\'s unit, ALL your units receive combat equal to that unit\'s raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/013.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/083.png' },

    { id: 49, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 3, combat: 4,rawResource: 3, rawCombat: 4, placement: 3, status: [], cardName: 'Laure',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpAlly','none',2,'This unit receives +2 combat for each power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/014.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/084.png' },

    { id: 50, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 1, combat: 6,rawResource: 1, rawCombat: 6, placement: 2, status: [], cardName: 'Abyss',
        effect: [['if_defeats_unit','all opposing','none','modifyCombat',-2,'none','none','If this unit defeats an opponent\'s unit, ALL opposing units receive -2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/015.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/085.png' },

    { id: 51, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 1, combat: 4,rawResource: 1, rawCombat: 4, placement: 2, status: [], cardName: 'Enma',
        effect: [['if_defeats_unit','all ally','none','preventDecrease','combat','none','resource','If this unit defeats an opponent\'s unit, ALL your units\' combat and resource cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/016.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/086.png' },

    { id: 52, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 2, combat: 6,rawResource: 2, rawCombat: 6, placement: 1, status: [], cardName: 'Void',
        effect: [['if_defeats_unit','ally','none','preventNull','Void','none','none','If this unit defeats an opponent\'s unit, the ability of ALL units cannot be nullified nor changed']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/017.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/087.png' },

    { id: 53, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 3, status: [], cardName: 'Yfrit',
        effect: [['if_defeats_unit','ally','none','modifyResource','opposingCombat','none','none','If this unit defeats an opponent\'s unit, this unit receives resource equal to that unit\'s raw combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/018.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/088.png' },

    { id: 54, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -1, combat: 6,rawResource: -1, rawCombat: 6, placement: 2, status: [], cardName: 'Seeker',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpAlly','none',-1,'This unit receives -1 combat for each power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/019.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/089.png' },

    { id: 55, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -1, combat: 6,rawResource: -1, rawCombat: 6, placement: 2, status: [], cardName: 'Dweller',
        effect: [['statChange','ally','none','modifyCombat',-3,'none','confronting','ancient','If an opposing unit in this zone is an ancient, this unit receives -3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/020.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/090.png' },

    { id: 56, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -1, combat: 3,rawResource: -1, rawCombat: 3, placement: 1, status: [], cardName: 'Envoy',
        effect: [['if_defeated','all other','none','swapEffects','none','none','none','If this unit is defeated, ALL of your units swap abilities with an opposing unit in their respective zones (applies after "before confrontation abilities)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/021.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/091.png' },

    { id: 57, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -1, combat: 4,rawResource: -1, rawCombat: 4, placement: 1, status: [], cardName: 'Harborer',
        effect: [['if_defeated','all ally','none','nullifyActive','unit','none','none','If this unit is defeated, nullify the abilities of ALL your units while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/022.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/092.png' },

    { id: 58, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -2, combat: 7,rawResource: -2, rawCombat: 7, placement: 2, status: [], cardName: 'Descendant',
        effect: [['preventStatChange','ally','none','preventIncrease','Descendant','none','none','This unit\'s combat cannot increase']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/023.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/093.png' },

    { id: 59, name: 'Unit Card', type: 'unit', faction: ['ancient'], resource: -3, combat: 9,rawResource: -3, rawCombat: 9, placement: 3, status: [], cardName: 'Absolute',
        effect: [['preventStatChange','opposing','none','additionalEffect','Absolute','none','none','ALL power up and land abilities which increase opposing unit\'s combat in this zone do so an additional time']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/024.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/094.png' },

    { id: 60, name: 'Unit Card', type: 'unit', faction: ['harpy','insect'], resource: 4, combat: 5,rawResource: 4, rawCombat: 5, placement: 3, status: [], cardName: 'Core',
        effect: [['nullificationChangeSwap','opposing','lowerRawResource','nullifyActive','unit','none','none','Before confrontation, if this unit has higher raw resource than an opposing unit in this zone, nullify its abilities while it is active']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/025.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/095.png' },

    { id: 61, name: 'Unit Card', type: 'unit', faction: ['ancient', 'angel'], resource: -2, combat: 6,rawResource: -2, rawCombat: 6, placement: 1, status: [], cardName: 'Misery',
        effect: [['if_defeated','all','none','nullifyActive','unit','ancient','none','If this unit is defeated, nullify the abilities of ALL ancients'],
            ['if_defeated','all','none','modifyCombat',2,'angel','none','If this unit is defeated, +2 combat to ALL angels']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/026.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/096.png' },

    { id: 62, name: 'Unit Card', type: 'unit', faction: ['ancient', 'dragon'], resource: -3, combat: 6,rawResource: -3, rawCombat: 6, placement: 1, status: [], cardName: 'Ymir',
        effect: [['if_defeats_unit','all','none','modifyResource',3,'dragon','none','If this unit defeats an opponent\'s unit, ALL dragons receive +3 resource'],
            ['if_defeats_unit','all','none','modifyResource',3,'ancient','none','If this unit defeats an opponent\'s unit, ALL ancients receive +3 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/027.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/097.png' },

    { id: 63, name: 'Unit Card', type: 'unit', faction: ['undead', 'harpy'], resource: 2, combat: 4,rawResource: 2, rawCombat: 4, placement: 2, status: [], cardName: 'Wharp',
        effect: [['preventStatChange','ally','none','additionalEffect','Wharp','none','none','Modifiers which affect this unit\'s resource also affect its combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/028.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/098.png' },

    { id: 64, name: 'Unit Card', type: 'unit', faction: ['undead', 'dragon'], resource: 0, combat: 5,rawResource: 0, rawCombat: 5, placement: 1, status: [], cardName: 'Wyrm',
        effect: [['if_defeats_unit','all','none','modifyUnitType','undead','dragon','none','If this unit defeats an enemy unit, ALL units become undead dragons and lose their other types']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/029.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/099.png' },

    { id: 65, name: 'Unit Card', type: 'unit', faction: ['undead', 'angel'], resource: -1, combat: 5,rawResource: -1, rawCombat: 5, placement: 1, status: [], cardName: 'Lenfal',
        effect: [['if_defeated','all opposing','none','modifyCombat',-1,'none','none','If this unit is defeated, ALL your opponent\'s units receive -1 combat'],
            ['if_defeated','all opposing','none','modifyResource',-2,'none','none','If this unit is defeated, ALL your opponent\'s units receive -2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/030.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/100.png' },

    { id: 66, name: 'Unit Card', type: 'unit', faction: ['ancient', 'undead'], resource: -2, combat: 8,rawResource: -2, rawCombat: 8, placement: 3, status: [], cardName: 'Lethalm',
        effect: [['statChange','ally','none','modifyCombat',-4,'none','confronting','non','undead','If an opposing unit in this zone is a non-undead, this unit receives -4 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/031.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/101.png' },

    { id: 67, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 2, combat: 6,rawResource: 2, rawCombat: 6, placement: 2, status: [], cardName: 'Harmony',
        effect: [['statChange','ally','none','modifyCombat',2,'none','confronting','undead','This unit receives +2 combat if an enemy unit in this zone is an undead']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/032.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/102.png' },

    { id: 68, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 3, status: [], cardName: 'Rhythm',
        effect: [['statChange','ally','none','modifyCombat','countDefeated','none',2,'undead','This unit receives +2 combat for ALL defeated undead']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/033.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/103.png' },

    { id: 69, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 2, status: [], cardName: 'Hymn',
        effect: [['nullificationChangeSwap','opposing','none','nullifyActive','undead','none','none','Before confrontation, nullify the abilities of ALL other undead units in this zone while they are active']], //changed effect
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/034.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/104.png' },

    { id: 70, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 2, combat: 1,rawResource: 2, rawCombat: 1, placement: 1, status: [], cardName: 'Cord',
        effect: [['if_defeated','all ally','none','modifyCombat',3,'undead','confronting','undead','If this unit is defeated, ALL your undead units confronting opposing undead units receive +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/035.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/105.png' },

    { id: 71, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 1, combat: 3,rawResource: 1, rawCombat: 3, placement: 1, status: [], cardName: 'Tune',
        effect: [['if_defeated','all ally','none','modifyResource',5,'undead','confronting','undead','If this unit is defeated, ALL your undead units confronting opposing undead units receive +5 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/036.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/106.png' },

    { id: 72, name: 'Unit Card', type: 'unit', faction: ['undead'], resource: 3, combat: 2,rawResource: 3, rawCombat: 2, placement: 1, status: [], cardName: 'Key',
        effect: [['if_defeated','all','none','modifyUnitType','undead','none','none','If this unit is defeated, ALL units become undead and lose their other unit types']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/037.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/107.png' },

    { id: 73, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 3, combat: 1,rawResource: 3, rawCombat: 1, placement: 2, status: [], cardName: 'Harp',
        effect: [['statChange','column','none','applyResourceConfrontation','none','none','none','Apply resource instead of combat for confrontation for ALL units in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/038.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/108.png' },

    { id: 74, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 5, combat: 3,rawResource: 5, rawCombat: 3, placement: 2, status: [], cardName: 'Zephyr',
        effect: [['preventStatChange','ally','none','preventDecrease','none','none','resource','This unit\'s resource cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/039.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/109.png' },

    { id: 75, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 5, combat: 1,rawResource: 5, rawCombat: 1, placement: 1, status: [], cardName: 'Fenyx',
        effect: [['if_defeated','all ally','none','applyResourceConfrontation','none','none','none','If this unit is defeated, apply resource for confrontation instead of combat for ALL future confrontations for your units only']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/040.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/110.png' },

    { id: 76, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 6, combat: 1,rawResource: 6, rawCombat: 1, placement: 3, status: [], cardName: 'Flamingo',
        effect: [['statChange','ally','none','modifyResource','countPowerUpAlly','none',1,'This unit receives +1 resource for each power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/041.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/111.png' },

    { id: 77, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 1, combat: 2,rawResource: 1, rawCombat: 2, placement: 1, status: [], cardName: 'Birb',
        effect: [['if_defeated','all','none','applyResourceConfrontation','none','none','none','If this unit is defeated, apply resource for confrontation instead of combat for ALL future confrontations for ALL units']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/042.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/112.png' },

    { id: 78, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 4, combat: 2,rawResource: 4, rawCombat: 2, placement: 3, status: [], cardName: 'Safira',
        effect: [['preventStatChange','column','none','additionalEffect','Safira','none','none','ALL resource modifiers for ALL units in this zone are applied an additional time while this unit is active']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/043.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/113.png' },

    { id: 79, name: 'Unit Card', type: 'unit', faction: ['harpy'], resource: 1, combat: 3,rawResource: 1, rawCombat: 3, placement: 2, status: [], cardName: 'Howl',
        effect: [['preventStatChange','column','none','additionalEffect','Howl','none','none','Modifiers affecting combat and resource are switched for ALL units in this zone while this unit is active']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/044.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/115.png' },

    { id: 80, name: 'Unit Card', type: 'unit', faction: ['harpy', 'angel'], resource: 3, combat: 2,rawResource: 3, rawCombat: 2, placement: 3, status: [], cardName: 'Sefra',
        effect: [['statChange','ally','none','modifyResource','countDefeated','none',2,'harpy',,'+2 resource for ALL defeated harpies'],
            ['statChange','ally','none','modifyCombat','countDefeated','none',3,'angel','+3 combat for ALL defeated angels']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/045.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/114.png' },

    { id: 81, name: 'Unit Card', type: 'unit', faction: ['ancient', 'harpy'], resource: 1, combat: 7,rawResource: 1, rawCombat: 7, placement: 2, status: [], cardName: 'Harvara',
        effect: [['statChange','ally','none','modifyCombat',-7,'none','confronting','higherResource','If an opposing unit in this zone has higher raw resource, this unit receives -7 combat'],
            ['statChange','ally','none','modifyResource',7,'none','confronting','higherResource','If an opposing unit in this zone has higher raw resource, this unit receives +7 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/046.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/116.png' },

    { id: 82, name: 'Unit Card', type: 'unit', faction: ['android', 'dragon'], resource: 0, combat: 5,rawResource: 0, rawCombat: 5, placement: 3, status: [], cardName: 'Vion',
        effect: [['preventNullificationChangeSwap','ally','none','additionalEffect0','Vion','dragon','android','This unit has the abilities of ALL defeated dragons and androids']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/047.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/117.png' },

    { id: 83, name: 'Unit Card', type: 'unit', faction: ['harpy', 'dragon'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 1, status: [], cardName: 'Myst',
        effect: [['if_defeats_unit','all','none','modifyCombat',-1,'dragon','non','If this unit defeats an opponent\'s unit, ALL non-dragon units receive -1 combat'],
            ['if_defeats_unit','all','none','modifyResource',-2,'harpy','non','If this unit defeats an opponent\'s unit, ALL non-harpy units receive -2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/048.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/118.png' },

    { id: 84, name: 'Unit Card', type: 'unit', faction: ['dragon','angel'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 1, status: [], cardName: 'Aries',
        effect: [['if_defeats_unit','all','none','modifyCombat',2,'angel','none','If this unit defeats an opponent\'s unit, ALL angels receive +2 combat'],
            ['if_defeats_unit','all','none','modifyCombat',2,'dragon','none','If this unit defeats an opponent\'s unit, ALL dragons receive +2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/009.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/106.png' },

    { id: 85, name: 'Unit Card', type: 'unit', faction: ['insect','angel'], resource: 2, combat: 2,rawResource: 2, rawCombat: 2, placement: 2, status: [], cardName: 'Luna',
        effect: [['preventStatChange','opposing','none','preventIncrease','Luna','none','none','Other units\' combat in this zone cannot increase through land and power up abilities.']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/010.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/114.png' },

    { id: 86, name: 'Unit Card', type: 'unit', faction: ['harpy','android'], resource: 0, combat: 5,rawResource: 0, rawCombat: 5, placement: 2, status: [], cardName: 'Sky',
        effect: [['statChange','ally','none','modifyResource','highestCombat','none','none','Before confrontation, this unit receives resource equal to the highest raw combat value in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/011.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/113.png' },

    { id: 87, name: 'Unit Card', type: 'unit', faction: ['angel','android'], resource: 3, combat: 3,rawResource: 3, rawCombat: 3, placement: 3, status: [], cardName: 'Autumn',
        effect: [['preventNullificationChangeSwap','ally','none','additionalEffect0','Autumn','none','none','This unit has the abilities of ALL defeated units']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/012.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/112.png' },

    { id: 88, name: 'Unit Card', type: 'unit', faction: ['ancient','android'], resource: -3, combat: 8,rawResource: -3, rawCombat: 8, placement: 3, status: [], cardName: 'Amadeus',
        effect: [['statChange','ally','none','modifyCombat',-3,'none','confronting','non','ancient','If an opposing unit in this zone is a non-ancient, this unit receives -3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/013.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/111.png' },

    { id: 89, name: 'Unit Card', type: 'unit', faction: ['android'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 3, status: [], cardName: 'Alastor',
        effect: [['preventTypeChange','ally','none','preventTypeChange','none','none','none','This unit\'s type cannot change'],
            ['preventStatChange','ally','none','prevent','Alastor','none','none','This unit uses its combat and cannot use its resource for confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/014.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/116.png' },

    { id: 90, name: 'Unit Card', type: 'unit', faction: ['android'], resource: 1, combat: 6,rawResource: 1, rawCombat: 6, placement: 2, status: [], cardName: 'Aristaeus',
        effect: [['statChange','ally','none','winIfTie','none','none','none','If this zone were to result in a tie, this unit\'s controller wins this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/015.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/117.png' },

    { id: 91, name: 'Unit Card', type: 'unit', faction: ['android'], resource: -4, combat: 6,rawResource: -4, rawCombat: 6, placement: 3, status: [], cardName: 'Helios',
        effect: [['statChange','column','none','applyRawForConfrontation','none','none','none','ALL units in this zone confront with their raw values']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/016.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/118.png' },

    { id: 92, name: 'Unit Card', type: 'unit', faction: ['android'], resource: 3, combat: 5,rawResource: 3, rawCombat: 5, placement: 2, status: [], cardName: 'Argus',
        effect: [['preventNullificationChangeSwap','ally','none','preventNull','nullify','change','none','This unit cannot have its abilities nullified nor changed']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/017.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/120.png' },

    { id: 93, name: 'Unit Card', type: 'unit', faction: ['android'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 2, status: [], cardName: 'Aether',
        effect: [['preventStatChange','ally','none','preventDecrease','combat','none','resource','This unit\'s combat and resource cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/018.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/121.png' },

    { id: 94, name: 'Unit Card', type: 'unit', faction: ['android'], resource: -1, combat: 5,rawResource: -1, rawCombat: 5, placement: 1, status: [], cardName: 'Cronus',
        effect: [['if_defeated','all other','none','applyRawForConfrontation','none','none','none','If this unit is defeated. ALL units confront with their raw values']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/019.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/119.png' },

    { id: 95, name: 'if_defeats_unit', type: 'unit', faction: ['insect', 'dragon'], resource: 3, combat: 4,rawResource: 3, rawCombat: 4, placement: 1, status: [], cardName: 'Libellule',
        effect: [['if_defeats_unit','all','none','nullifyActive','unit','none','confronting','insect','If this unit defeats an opponent\'s unit, ALL units confronting other insects have their abilities nullified while they are active'],
            ['if_defeats_unit','all','none','nullifyActive','unit','none','confronting','dragon','If this unit defeats an opponent\'s unit, ALL units confronting other dragons have their abilities nullified while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/020.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/105.png' },

    { id: 96, name: 'Unit Card', type: 'unit', faction: ['undead', 'android'], resource: 0, combat: 3,rawResource: 0, rawCombat: 3, placement: 1, status: [], cardName: 'Reaper',
        effect: [['if_defeated','all','none','modifyCombat',2,'android','none','If this unit is defeated, ALL androids receive +2 "combat'],
            ['if_defeated','all','none','modifyCombat',2,'undead','none','If this unit is defeated, ALL undeads receive +2 "combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/021.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/110.png' },

    { id: 97, name: 'Unit Card', type: 'unit', faction: ['undead', 'insect'], resource: 1, combat: 4,rawResource: 1, rawCombat: 4, placement: 2, status: [], cardName: 'Juice',
        effect: [['if_defeated','all','none','modifyResource',-3,'none','confronting','insect','If this unit is defeated, an opposing unit in this zone as well as ALL units confronting insects receive -3 resource'],
            ['if_defeated','all other','none','modifyResource',-3,'none','confronting','undead','If this unit is defeated, an opposing unit in this zone as well as ALL units confronting undeads receive -3 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/022.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/107.png' },

    { id: 98, name: 'Unit Card', type: 'unit', faction: ['insect', 'android'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 3, status: [], cardName: 'Prayer',
        effect: [['preventStatChange','opposing','none','preventIncrease','Prayer','none','none','Other units in this zone cannot increase their combat nor resource through land abilities']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/023.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/109.png' },

    { id: 99, name: 'Unit Card', type: 'unit', faction: ['ancient', 'insect'], resource: -2, combat: 8,rawResource: -2, rawCombat: 8, placement: 2, status: [], cardName: 'Cercle',
        effect: [['statChange','ally','none','modifyCombat','countDefeated','none',-2,'all','This unit receives -2 combat for ALL defeated units (this ability continues to apply after confrontation)'],
            ['statChange','ally','none','modifyResource','countDefeated','none',-3,'all','This unit receives -3 resource for ALL defeated units (this ability continues to apply after confrontation)']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/024.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/108.png' },

    { id: 100, name: 'Unit Card', type: 'unit', faction: ['insect', 'angel'], resource: 2, combat: 3,rawResource: 2, rawCombat: 3, placement: 3, status: [], cardName: 'Urie',
        effect: [['preventStatChange','ally','none','additionalEffect','Urie','none','none','ALL unit abilities which modify combat and resource if they are defeated, modify this unit\'s combat and resource an additional time']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/025.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/115.png' },

    { id: 101, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 2, status: [], cardName: 'Maevous',
        effect: [['statChange','ally','none','modifyCombat',2,'none','confronting','insect','This unit receives +2 combat if an opposing unit in this zone is an insect']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/026.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/131.png' },

    { id: 102, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 3,rawResource: 3, rawCombat: 3, placement: 3, status: [], cardName: 'Radier',
        effect: [['statChange','opposing','none','modifyCombat','countPowerUpAlly','none',-3,'Radier','ALL opposing units attached with a power up in this zone receive -3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/027.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/130.png' },

    { id: 103, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 5, combat: 5,rawResource: 5, rawCombat: 5, placement: 3, status: [], cardName: 'Toe',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpAlly','none',-1,'Toe','This unit receives -1 combat if it has exactly one power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/028.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/129.png' },

    { id: 104, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 7,rawResource: 3, rawCombat: 7, placement: 2, status: [], cardName: 'Syrium',
        effect: [['statChange','ally','none','modifyCombat',-3,'none','confronting','non','insect','This unit receives -3 combat if an opposing unit in this zone is a non-insect']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/029.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/127.png' },

    { id: 105, name: 'Unit Card', type: 'unit', faction: ['insect'], resource: 3, combat: 4,rawResource: 3, rawCombat: 4, placement: 3, status: [], cardName: 'Glore',
        effect: [['statChange','opposing','none','modifyCombat','countPowerUpAlly','none',-2,'Glore','ALL opposing units in this zone receive -2 combat if this unit does not have any power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/030.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/128.png' },

    { id: 106, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 5, combat: 6,rawResource: 5, rawCombat: 6, placement: 3, status: [], cardName: 'Carvora',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpAlly','none',-2,'Carvora','This unit receives -2 combat if it has any power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/031.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/126.png' },

    { id: 107, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 3, combat: 4,rawResource: 3, rawCombat: 4, placement: 2, status: [], cardName: 'Livyon',
        effect: [['preventStatChange','ally','none','preventDecrease','combat','none','none','This unit\'s combat cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/032.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/125.png' },

    { id: 108, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 1, status: [], cardName: 'Mantel',
        effect: [['statChange','ally','none','modifyCombat',2,'none','confronting','dragon','This unit receives +2 combat if an opposing unit in this zone is a dragon']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/033.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/122.png' },

    { id: 109, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 0, combat: 6,rawResource: 0, rawCombat: 6, placement: 2, status: [], cardName: 'Olten',
        effect: [['statChange','ally','none','modifyCombat','countPowerUp','none',1,'Olten','This unit receives +1 combat if an opposing unit in this zone has at least 2 power ups attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/034.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/124.png' },

    { id: 110, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 4, combat: 5,rawResource: 4, rawCombat: 5, placement: 2, status: [], cardName: 'Snow',
        effect: [['statChange','ally','none','modifyCombat','countPowerUp','none',1,'Snow','This unit receives +1 combat if an opposing unit in this zone has no power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/035.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/123.png' },

    { id: 111, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: -3, combat: 6,rawResource: -3, rawCombat: 6, placement: 1, status: [], cardName: 'Halivah',
        effect: [['if_defeats_unit','all ally','none','modifyResource',3,'none','none','If this unit defeats an opponent\'s unit, ALL your units receive +3 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/036.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/132.png' },

    { id: 112, name: 'Unit Card', type: 'unit', faction: ['dragon'], resource: 2, combat: 4,rawResource: 2, rawCombat: 4, placement: 1, status: [], cardName: 'Mesh',
        effect: [['if_defeats_unit','ally','none','modifyCombat','Mesh','none','none','If this unit defeats an opponent\'s unit, ALL your units\' combat increase by the defeated unit\'s raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/037.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/133.png' },

    { id: 113, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 4, combat: 4,rawResource: 4, rawCombat: 4, placement: 2, status: [], cardName: 'Fleur',
        effect: [['statChange','ally','none','modifyCombat','highestResourceInZone','none',2,'Before confrontation, if an opposing unit in this zone has lower raw resource, this unit receives +2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/038.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/134.png' },

    { id: 114, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 5, combat: 3,rawResource: 5, rawCombat: 3, placement: 3, status: [], cardName: 'Ciël',
        effect: [['statChange','ally','none','modifyResource','countPowerUpAlly','none',3,'Ciël','This unit receives +3 resource if this unit is has exactly 1 power up attached to it']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/039.png',

        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/135.png' },
    { id: 115, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 5, combat: 6,rawResource: 5, rawCombat: 6, placement: 3, status: [], cardName: 'Fanaël',
        effect: [['statChange','ally','none','modifyResource','countPowerUpZone','none',-1,'none','This unit receives -1 resource for each power up in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/040.png',

        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/136.png' },
    { id: 116, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 2, status: [], cardName: 'Artël',
        effect: [['statChange','ally','none','modifyCombat',2,'none','confronting','angel','This unit receives +2 combat if an opposing unit in this zone is an angel']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/041.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/137.png' },

    { id: 117, name: 'Unit Card', type: 'unit', faction: ['angel'], resource: 7, combat: 2,rawResource: 7, rawCombat: 2, placement: 2, status: [], cardName: 'Miël',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpZone','none',1,'none','This unit receives +1 combat for each power up in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/042.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/138.png' },

    { id: 118, name: 'Unit Card', type: 'unit', faction: ['deity'], resource: 0, combat: 7,rawResource: 0, rawCombat: 7, placement: 2, status: [], cardName: 'Anubis',
        effect: [['preventTypeChange','ally','none','preventTypeChange','none','none','none','This unit\'s type cannot be modified'],
            ['preventStatChange','ally','none','Anubis','none','none','none','This unit\'s resource and combat cannot be modified'],
            ['preventNullificationChangeSwap','ally','none','preventNull','nullify','none','none','This unit\'s ability cannot be nullified']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/043.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/139.png' },

    { id: 119, name: 'Unit Card', type: 'unit', faction: ['deity'], resource: 0, combat: 7,rawResource: 0, rawCombat: 7, placement: 2, status: [], cardName: 'Seth',
        effect: [['statChange','ally','none','modifyCombat',3,'none','confronting','deity','If an opposing unit in this zone is a deity, this unit receives +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/044.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/140.png' },

    { id: 120, name: 'Unit Card', type: 'unit', faction: ['deity'], resource: 0, combat: 7,rawResource: 0, rawCombat: 7, placement: 3, status: [], cardName: 'Osiris',
        effect: [['statChange','ally','none','modifyCombat','countDefeated','none',1,'all','This unit receives +1 combat for each defeated unit']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/045.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/141.png' },

    { id: 121, name: 'Unit Card', type: 'unit', faction: ['deity'], resource: 0, combat: 7,rawResource: 0, rawCombat: 7, placement: 1, status: [], cardName: 'Horus',
        effect: [['preventNullificationChangeSwap','column','none','preventNull','Horus','none','none','While this unit is active, ALL units cannot have their abilities nullified (this ability continues to apply after confrontation)']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/046.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/142.png' },

    { id: 122, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 5, combat: 2,rawResource: 5, rawCombat: 2, placement: 1, status: [], cardName: 'Diplo Dokus',
        effect: [['if_defeated','all','none','nullifyActive','unit','none','confronting','dinosaur','If this unit is defeated, nullify the abilities of ALL units confronting dinosaurs while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/047.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/143.png' },

    { id: 123, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 2, combat: 4,rawResource: 2, rawCombat: 4, placement: 3, status: [], cardName: 'Velocy Raptor',
        effect: [['statChange','ally','none','modifyCombat',3,'none','confronting','nullifyActive','If an opposing unit in this zone has its abilities nullified, this unit receives +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/048.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/144.png' },

    { id: 124, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 3, combat: 3,rawResource: 3, rawCombat: 3, placement: 1, status: [], cardName: 'Tricey Ratops',
        effect: [['if_defeated','all other','none','nullifyActive','power-up','none','none','none','If this unit is defeated, nullify the abilities of ALL power ups in other zones']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/049.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/145.png' },

    { id: 125, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 1, combat: 5,rawResource: 1, rawCombat: 5, placement: 1, status: [], cardName: 'Allo Sorus', // typo here
        effect: [['if_defeats_unit','all','none','nullifyActive','unit','none','non','dinosaur','If this unit defeats an opponent\'s unit, nullify the abilities of ALL non-dinosaur units while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/050.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/146.png' },

    { id: 126, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 3, combat: 4,rawResource: 3, rawCombat: 4, placement: 2, status: [], cardName: 'Ptero Dactilus',
        effect: [['if_defeats_unit','all','none','modifyCombat',2,'dinosaur','confronting','nullifyActive','If this unit defeats an opponent\'s unit which had its abilities nullified while it was active, ALL dinosaurs receive +2 combat'],
            ['if_defeats_unit','all','none','modifyResource',3,'dinosaur','confronting','nullifyActive','If this unit defeats an opponent\'s unit which had its abilities nullified while it was active, ALL dinosaurs receive +2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/051.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/147.png' },

    { id: 127, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 2, combat: 6,rawResource: 2, rawCombat: 6, placement: 1, status: [], cardName: 'Tyrano Saurus',
        effect: [['if_defeats_unit','all','none','nullifyActive','land','none','none','If this unit defeats an opponent\'s unit, nullify the abilities of ALL lands']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/052.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/148.png' },

    { id: 128, name: 'Unit Card', type: 'unit', faction: ['dinosaur'], resource: 2, combat: 5,rawResource: 2, rawCombat: 5, placement: 3, status: [], cardName: 'Spyno Saurus',
        effect: [['nullificationChangeSwap','column','none','nullifyActive','power-up','none','none','The abilities of ALL power ups in this zone are nullified while this unit is active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/053.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/149.png' },

    { id: 129, name: 'Unit Card', type: 'unit', faction: ['undead', 'dinosaur'], resource: 0, combat: 6,rawResource: 0, rawCombat: 6, placement: 3, status: [], cardName: 'Rex Venant',
        effect: [['if_defeats_unit','ally','none','modifyResource',10,'none','confronting','Rex Venant','If this unit defeats an opponent unit which was an undead and had its abilities nullified while it was active, this unit receives +10 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/054.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/150.png' },

    { id: 130, name: 'Unit Card', type: 'unit', faction: ['harpy', 'dinosaur'], resource: 5, combat: 2,rawResource: 5, rawCombat: 2, placement: 2, status: [], cardName: 'Arpo Saurus',
        effect: [['nullificationChangeSwap','opposing','lowerRawResource','nullifyActive','unit','none','none','All opposing units with less raw resource than this unit in this zone have their abilities nullified while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/055.png',
        fullArtImage: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/151.png' },








    { id: 131, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Evolution Pill',
        effect: [['statChange','ally','none','modifyCombat',3,'none','none','+3 combat to the attached unit']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/119.png' },

    { id: 132, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Host',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['if_defeats_unit','ally','none','modifyResource','opposingCombat','none','none','If the attached unit defeats an enemy unit, it receives resource equal to that unit\'s raw combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/120.png' },

    { id: 133, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Mutation',
        effect: [['statChange','ally','none','modifyResource',1,'none','none','+1 resource'],
            ['typeChange', 'ally','none','modifyUnitType','all','none','none','The attached unit has ALL unit types']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/121.png' },

    { id: 134, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Hallucinogens',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['statChange', 'ally','none','modifyCombat','differentType','none',3,'+3 combat if an opposing unit in this zone is of a different unit type']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/122.png' },

    { id: 135, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'DNA Attack',
        effect: [['statChange','opposing','none','modifyCombat',2,'none','none','+2 combat'],
            ['preventNullificationChangeSwap','opposing','none','additionalEffect0','DNA Attack','none','none','The opposing unit is unaffected by other power ups']], // change to while active
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/123.png' },

    { id: 136, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Virus',
        effect: [['if_defeated','opposing','none','modifyResource',-6,'none','none','If the attached unit is defeated an opponent\'s unit in this zone receives -6 resources']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/124.png' },

    { id: 137, name: 'Power-Up Card', type: 'power-up', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Survival Instinct',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',2,'insect','none','+2 combat if the attached unit is an insect']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/125.png' },

    { id: 138, name: 'Power-Up Card', type: 'power-up', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Upgrade',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',2,'android','none','+2 combat if the attached unit is an android']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/126.png' },

    { id: 139, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Grimoire',
        effect: [['statChange','ally','none','modifyCombat','countPowerUpAlly','none',2,'The attached unit receives +2 combat for each power up attached to it (this one included)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/127.png' },

    { id: 140, name: 'Power-Up Card', type: 'power-up', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Decay',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',3,'none','confronting','undead','If an enemy unit in this zone is an undead, the attached unit receives +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/082.png' },

    { id: 141, name: 'Power-Up Card', type: 'power-up', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Death Experience',
        effect: [['statChange','ally','none','modifyCombat',-1,'none','none','-1 combat'],
            ['if_defeated','ally','none','additionalEffect','Death Experience','none','none','If the attached unit is defeated and has an ability which is used upon defeat, that ability is used an additional time (if possible)']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/083.png' },

    { id: 142, name: 'Power-Up Card', type: 'power-up', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Awakening',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['preventStatChange', 'ally','none','additionalEffect','Awakening','none','none','Land abilities which affect the combat and resources of the attached unit are applied an additional time']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/084.png' },

    { id: 143, name: 'Power-Up Card', type: 'power-up', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Transhumanism',
        effect: [['preventStatChange','ally','none','preventDecrease','combat','none','resource','The attached unit cannot have its combat or resource reduced']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/085.png' },

    { id: 144, name: 'Power-Up Card', type: 'power-up', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Aerodynamics',
        effect: [['statChange','ally','none','modifyResource',2,'none','none','+2 resource'],
            ['statChange', 'ally','none','applyResourceConfrontation','none','none','none','The attached unit uses its resource instead of its combat for confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/086.png' },

    { id: 145, name: 'Power-Up Card', type: 'power-up', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Eagle Eye',
        effect: [['statChange','ally','none','modifyResource',5,'none','none','+5 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/087.png' },

    { id: 146, name: 'Power-Up Card', type: 'power-up', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Knowledge',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['if_defeats_unit','ally','none','modifyResource',2,'none','none','If the attached unit defeats an opponent\'s unit, +2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/088.png' },

    { id: 147, name: 'Power-Up Card', type: 'power-up', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Overwhelming Power',
        effect: [['statChange','ally','none','modifyCombat',5,'none','none','The attached unit receives +5 combat and -10 resource'],
            ['statChange','ally','none','modifyResource',-10,'none','none','The attached unit receives +5 combat and -10 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/089.png' },

    { id: 148, name: 'Power-Up Card', type: 'power-up', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Divine Blessing',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',1,'angel','none','+1 combat if the attached unit is an angel'],
            ['statChange','ally','none','modifyResource',1,'angel','none','+1 resource if the attached unit is an angel']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/090.png' },

    { id: 149, name: 'Power-Up Card', type: 'power-up', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Blind Faith',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['preventNullificationChangeSwap','ally','none','preventNull','nullify','nullifyDefeat','none','The attached unit\'s abilities cannot be nullified']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/091.png' },

    { id: 150, name: 'Power-Up Card', type: 'power-up', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Unexpected Outcome',
        effect: [['preventStatChange','ally','none','additionalEffect','Unexpected Outcome','none','none','Any abilities which would reduce the attached unit\'s combat and resource increase them by the same amount instead']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/092.png' },

    { id: 151, name: 'Power-Up Card', type: 'power-up', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Depth\'s Call',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['nullificationChangeSwap','ally','none','nullifyActive','unit','none','none','Nullify the abilities of the unit it is attached to']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/093.png' },

    { id: 152, name: 'Power-Up Card', type: 'power-up', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Grief',
        effect: [['if_defeats_unit','opposing','none','nullifyDefeat','unit','none','none','If the attached unit defeats an opposing unit, nullify its abilities upon defeat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/094.png' },

    { id: 153, name: 'Power-Up Card', type: 'power-up', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Merit',
        effect: [['statChange','ally','none','modifyCombat','rawResourceFromSelf','none','none','The attached unit receives combat equal to its raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/095.png' },

    { id: 154, name: 'Power-Up Card', type: 'power-up', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Acceptance',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',2,'dragon','none','+2 combat if the attached unit is a dragon']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/096.png' },

    { id: 155, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Pact',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['statChange','ally','none','modifyCombat','sameUnitType','none',4,'The attached unit receives +4 combat if an opponent\'s unit in this zone is of the same unit type as the attached unit']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/097.png' },

    { id: 156, name: 'Power-Up Card', type: 'power-up', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Intimidation',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['preventStatChange','ally','none','preventDecrease','combat','none','none','The attached unit\'s combat cannot decrease']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/098.png' },

    { id: 157, name: 'Power-Up Card', type: 'power-up', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Fruit of Evolution',
        effect: [['statChange','ally','none','modifyResource',1,'none','none','+1 resource'],
            ['statChange','ally','none','modifyCombat','countDefeated','none',2,'all','The attached unit receives +2 combat for every defeated unit']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/099.png' },

    { id: 158, name: 'Power-Up Card', type: 'power-up', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Enchant',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyResource','countPowerUp','none',2,'The attached unit receives +2 resource for each opposing power up in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/100.png' },

    { id: 159, name: 'Power-Up Card', type: 'power-up', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Originate',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['if_defeats_unit','all ally','none','modifyCombat',1,'none','none','If the attached unit defeats an enemy unit, +1 combat to ALL your units']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/101.png' },

    { id: 160, name: 'Power-Up Card', type: 'power-up', faction: ['deity'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Lost Arts',
        effect: [['statChange','opposing','none','nullifyDefeat','Lost Arts','none','none','While the attached unit is active, nullify the abilities of units upon defeat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/102.png' },

    { id: 161, name: 'Power-Up Card', type: 'power-up', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Acceleration',
        effect: [['nullificationChangeSwap','opposing','none','nullifyActive','unit','none','none','Opposing units in this zone have their abilities nullified while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/103.png' },

    { id: 162, name: 'Power-Up Card', type: 'power-up', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Dive',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',3,'none','confronting','nullifyActive','If an opposing unit in this zone has its abilities nullified, the attached unit receives +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/104.png' },

    { id: 163, name: 'Power-Up Card', type: 'power-up', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Birth',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['statChange','ally','none','modifyCombat','lowestInZone','none',4,'+4 combat if an opposing unit in this zone has higher raw combat than the attached unit']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/20.png' },

    { id: 164, name: 'Power-Up Card', type: 'power-up', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'World View',
        effect: [['if_defeated','all','none','modifyCombat',2,'angel','none','If the attached unit is defeated ALL angels receive +2 combat'],
            ['if_defeated','all','none','modifyResource',2,'angel','none','If the attached unit is defeated ALL angels receive +2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/21.png' },

    { id: 165, name: 'Power-Up Card', type: 'power-up', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Lost Echo',
        effect: [['statChange','ally','none','modifyCombat',-2,'none','none','-2 combat'],
            ['preventStatChange','ally','none','preventNull','nullifyDefeat','changeDefeat','none','The attached unit\'s abilities cannot be nullified nor changed upon defeat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/22.png' },

    { id: 166, name: 'Power-Up Card', type: 'power-up', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Beyond Fear',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['if_defeated', 'opposing','lessCombat','nullifyActive','unit','none','none','If an opposing unit in this zone has less raw combat than the attached unit, nullify that opposing unit\'s ability upon defeat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/23.png' },

    { id: 167, name: 'Power-Up Card', type: 'power-up', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Awareness',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['statChange', 'ally','none','modifyCombat',3,'nullifyActive','none','+3 combat if the attached unit has its abilities nullified']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/24.png' },

    { id: 168, name: 'Power-Up Card', type: 'power-up', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Assimilation',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['nullificationChangeSwap','ally','none','replaceEffect','Assimilation','none','none','Before confrontation, replace the attached unit\'s ability with an opposing unit\'s ability with the highest combat. The ability cannot be used before confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/25.png' },

    { id: 169, name: 'Power-Up Card', type: 'power-up', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Necrosis',
        effect: [['statChange','opposing','none','modifyCombat',-2,'undead','Necrosis','ALL opposing undead units receive -2 combat while the attached unit is active'],
            ['statChange','opposing','none','modifyResource',-2,'undead','Necrosis','ALL opposing undead units receive -2 resource while the attached unit is active']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/26.png' },

    { id: 170, name: 'Power-Up Card', type: 'power-up', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Plague',
        effect: [['if_defeats_unit','all opposing','undead','modifyCombat',-3,'none','none','If the attached unit defeats an opposing undead unit, ALL opposing units receive -3 combat'],
            ['if_defeats_unit','all opposing','undead','modifyResource',-3,'none','none','If the attached unit defeats an opposing undead unit, ALL opposing units receive -3 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/27.png' },

    { id: 171, name: 'Power-Up Card', type: 'power-up', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Viaticum',
        effect: [['if_defeated','all opposing','none','modifyUnitType','undead','none','none','If the attached unit is defeated, ALL opposing units become undead and lose their other unit types']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/28.png' },

    { id: 172, name: 'Power-Up Card', type: 'power-up', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Aerial Conflict',
        effect: [['statChange','ally','none','modifyResource',2,'none','none','+2 resource'],
            ['statChange', 'opposing','none','applyResourceConfrontation','none','none','none','Opposing units in this zone use their resource instead of combat for confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/29.png' },

    { id: 173, name: 'Power-Up Card', type: 'power-up', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Speed of Sound',
        effect: [['statChange','ally','none','modifyResource',2,'none','none','+2 resource'],
            ['preventNullificationChangeSwap','ally','none','preventNull','nullify','change','none','The attached unit\'s abilities cannot be nullified nor changed while it is active']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/30.png' },

    { id: 174, name: 'Power-Up Card', type: 'power-up', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Scrap Constitution',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat'],
            ['statChange','ally','none','modifyCombat','countDefeated','android',1,'non','android','If the attached unit is an android, +1 combat for each non-android defeated'],
            ['statChange','ally','none','modifyResource','countDefeated','android',2,'non','android','If the attached unit is an android, +2 resource for each non-android defeated']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/31.png' },

    { id: 175, name: 'Power-Up Card', type: 'power-up', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Self Destruct',
        effect: [['if_defeated','all','none','modifyCombat',2,'android','none','If the attached unit is defeated ALL androids receive +2 combat'],
            ['if_defeated','all','none','modifyResource',1,'android','none','If the attached unit is defeated ALL androids receive +1 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/32.png' },

    { id: 176, name: 'Power-Up Card', type: 'power-up', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Artificial Domain',
        effect: [['statChange','column','none','applyRawForConfrontation','none','none','none','ALL units in this zone confront with their raw values']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/33.png' },

    { id: 177, name: 'Power-Up Card', type: 'power-up', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Final Effort',
        effect: [['if_defeated','all','none','modifyCombat',-2,'nullifyActive','none','If the attached unit is defeated ALL units with their abilities nullified receive -2 combat'],
            ['if_defeated','all','none','modifyResource',-1,'nullifyActive','none','If the attached unit is defeated ALL units with their abilities nullified receive -1 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/34.png' },

    { id: 178, name: 'Power-Up Card', type: 'power-up', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Recycle',
        effect: [['if_defeats_unit','ally','none','modifyResource',6,'none','confronting','nullifyActive','If the attached unit defeats an opposing unit with its abilities nullified, it receives +6 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/35.png' },

    { id: 179, name: 'Power-Up Card', type: 'power-up', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Natural Habitat',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat'],
            ['statChange','ally','none','modifyCombat',2,'none','none','If the attached unit is a dinosaur, +2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/36.png' },

    { id: 180, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Immunity',
        effect: [['preventNullificationChangeSwap','ally','none','preventNull','nullify','change','none','The attached unit\'s abilities cannot be nullified nor changed while it is active']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/37.png' },

    { id: 181, name: 'Power-Up Card', type: 'power-up', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Frontal Assault',
        effect: [['preventStatChange','ally','none','prevent','Frontal Assault','none','none','The attached unit confronts ignoring abilities making it confront using its raw values or resource instead of its modified combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/38.png' },









    { id: 182, name: 'Civilization Card', type: 'civilization', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'United Front',
        effect: [['statChange','ALL androids confronting non-android units receive +1 combat'],
            ['preventStatChange','ALL androids confronting non-android units cannot have their combat reduced']], // TODO
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/14.png' },
    { id: 183, name: 'Civilization Card', type: 'civilization', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Hijack',
        effect: [['preventStatChange','ALL non-android units confronting android units cannot have their combat modified through power up abilities']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/15.png' },

    { id: 184, name: 'Civilization Card', type: 'civilization', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Swarm',
        effect: [['statChange','ally','none','modifyCombat',2,'none','none','+2 combat and -4 resource to ALL of your units'],
            ['statChange','ally','none','modifyResource',-4,'none','none','+2 combat and -4 resource to ALL of your units']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/130.png' },

    { id: 185, name: 'Civilization Card', type: 'civilization', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Harvest',
        effect: [['statChange','column','none','modifyCombat','rawResourceFromSelf','none','none','ALL units receive combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/131.png' },

    { id: 186, name: 'Civilization Card', type: 'civilization', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Annihilation',
        effect: [['statChange','column','none','nullifyDefeat','non','android','confronting','android','ALL non-android units confronting android units cannot use their abilities upon defeat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/16.png' },

    { id: 187, name: 'Civilization Card', type: 'civilization', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Insight',
        effect: [['statChange','column','none','modifyCombat',3,'nullifyActive','none','ALL units with their abilities nullified receive +3 combat'],
            ['statChange','column','none','modifyResource',-2,'nullifyActive','none','ALL units with their abilities nullified receive -2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/133.png' },

    { id: 188, name: 'Field', type: 'civilization', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Revelation',
        effect: [['statChange','column','none','modifyCombat','Revelation','none','none','Play on a zone as a land : units here lose combat equal to their raw combat']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/134.png' },

    { id: 189, name: 'Civilization Card', type: 'civilization', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Arise',
        effect: [['statChange','column','none','additionalEffect','Arise','none','none','ALL unit abilities which are used if they are defeated will be used an additional time (if possible)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/135.png' },

    { id: 190, name: 'Civilization Card', type: 'civilization', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Hunt',
        effect: [['statChange','ally','none','modifyResource',2,'none','none','+2 resource to ALL of your units']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/136.png' },

    { id: 191, name: 'Civilization Card', type: 'civilization', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Realization',
        effect: [['preventNullificationChangeSwap','column','none','preventNull','nullify','nullifyDefeat','dinosaur','ALL dinosaurs cannot have their abilities nullified but their abilities can still be replaced']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/17.png' },

    { id: 192, name: 'Civilization Card', type: 'civilization', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Maneuvers',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','ALL your units receive +1 combat'],
            ['statChange','ally','none','modifyResource',-2,'none','none','ALL your units receive -2 resource.'],
            ['statChange','opposing','none','modifyCombat',-1,'none','none','ALL opposing units receive -1 combat'],
            ['statChange','opposing','none','modifyResource',2,'none','none','ALL opposing units receive +2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/061.png' },

    { id: 193, name: 'Civilization Card', type: 'civilization', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'For Glory',
        effect: [['statChange','column','none','additionalEffect','For Glory','none','none','ALL units receive : if this unit defeats an opponent\'s unit, ALL your other units receive +1 combat and +1 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/059.png' },

    { id: 194, name: 'Civilization Card', type: 'civilization', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Sacrifice',
        effect: [['typeChange','column','none','modifyUnitType','undead','none','none','ALL units become undead and lose their other types']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/056.png' },

    { id: 195, name: 'Field', type: 'civilization', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Gust of Wind',
        effect: [['statChange','column','none','modifyResource','resourceFromSelf','none','none','Play on a zone as a land : ALL units here receive resources equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/057.png' },

    { id: 196, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Duel',
        effect: [['preventStatChange','column','none','preventIncrease','Duel','none','none','Play on a zone as a land : ALL units\' combat here cannot increase through power up abilities and other units\' abilities']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/062.png' },

    { id: 197, name: 'Field', type: 'civilization', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Invasion',
        effect: [['nullificationChangeSwap','column','none','swapEffect','none','none','none','Play on a zone as a land : before confrontation, ALL your units here swap their abilities with an opposing unit in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/063.png' },

    { id: 198, name: 'Field', type: 'civilization', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Night Call',
        effect: [['statChange','column','none','applyResourceConfrontation','none','none','none','Play on a zone as a land : ALL units here apply their resource instead of combat for confrontation']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/064.png' },

    { id: 199, name: 'Civilization Card', type: 'civilization', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Feast',
        effect: [['statChange','ally','none','modifyResource',1,'none','none','ALL your units receive +1 resource'],
            ['preventStatChange','ally','none','preventDecrease','none','none','resource','ALL your units cannot have their resource reduced']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/065.png' },

    { id: 200, name: 'Civilization Card', type: 'civilization', faction: ['harpy'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Jokes on You',
        effect: [['statChange','opposing','none','modifyResource','countPowerUp','none',-2,'ALL opposing units receive -2 resource for each power up attached to them']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/066.png' },

    { id: 201, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Dare',
        effect: [['statChange','ally','none','modifyCombat',-3,'none','none','Play on a zone as a land : -3 combat to ALL your units here.'],
            ['statChange','ally','none','modifyResource',-2,'none','none','Play on a zone as a land : -2 resource to ALL your units here.'],
            ['if_defeats_unit','column','none','modifyResource',10,'none','none','If a unit defeats an opposing unit in this zone, that unit receives +10 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/067.png' },

    { id: 202, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Confine',
        effect: [['statChange','opposing','none','modifyResource',-2,'none','none','ALL opposing units receive resource -2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/068.png' },

    { id: 203, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Resonance',
        effect: [['preventStatChange','column','none','preventIncrease','Resonance','none','none','ALL units\' combat cannot increase through their own unit abilities']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/069.png' },

    { id: 204, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Genesis',
        effect: [['statChange','column','none','modifyCombat','lowestInZone','none',3,'ALL units with lower raw combat than an opposing unit in their respective zones receive +3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/070.png' },

    { id: 205, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Divide and Conquer',
        effect: [['statChange','ally','none','modifyCombat',1,'none','none','+1 combat to ALL your units']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/071.png' },

    { id: 206, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Restraint',
        effect: [['statChange','opposing','none','modifyCombat',-3,'none','none','Play on a zone as a land : -3 combat to ALL opposing units here']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/072.png' },

    { id: 207, name: 'Civilization Card', type: 'civilization', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Empower',
        effect: [['if_defeats_unit','column','none','additionalEffect','Empower','none','none','ALL abilities which are used when a unit defeats an opponent\'s unit will be used an additional time (if possible)']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/058.png' },

    { id: 208, name: 'Civilization Card', type: 'civilization', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Unity',
        effect: [['statChange','column','none','modifyCombat','countPowerUpAlly','none',3,'Unity','+3 combat to ALL units without any power up attached to them']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/074.png' },

    { id: 209, name: 'Civilization Card', type: 'civilization', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Duty',
        effect: [['statChange','column','none','modifyCombat',2,'angel','none','+2 combat to ALL angels.'],
            ['preventNullificationChangeSwap', 'column','none','preventNull','nullify','nullifyDefeat','angel','Their abilities cannot be nullified']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/075.png' },

    { id: 210, name: 'Field', type: 'civilization', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Rampage',
        effect: [['statChange','column','none','modifyCombat','countPowerUp','none',2,'Play on a zone as a land : ALL units receive +2 combat for each opposing power up in this zone']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/076.png' },

    { id: 211, name: 'Field', type: 'civilization', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Coalition',
        effect: [['statChange','column','none','modifyCombat',-4,'nullifyActive','none','Play on a zone as a land : ALL units with their abilities nullified receive -4 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/077.png' },

    { id: 212, name: 'Field', type: 'civilization', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'From Above',
        effect: [['nullificationChangeSwap','opposing','none','nullifyActive','unit','none','none','Play on a zone as a land : ALL opposing units here have their abilities nullified while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/078.png' },

    { id: 213, name: 'Civilization Card', type: 'civilization', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Blind Anger',
        effect: [['statChange','ally','none','modifyCombat',2,'none','confronting','nullifyActive','ALL your units confronting units with their abilities nullified receive +2 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/079.png' },

    { id: 214, name: 'Civilization Card', type: 'civilization', faction: ['dinosaur'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Triumph over Evolution',
        effect: [['statChange','column','none','modifyResource',-4,'nullifyActive','none','All units with their abilities nullified receive -4 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/080.png' },

    { id: 215, name: 'Civilization Card', type: 'civilization', faction: ['deity'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Faceless Judgement',
        effect: [['preventNullificationChangeSwap','column','none','preventNull','Faceless Judgement','none','none','All units, lands and power ups cannot have their abilities nullified while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/081.png' },

    { id: 216, name: 'Field', type: 'civilization', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Infestation',
        effect: [['statChange','opposing','none','modifyCombat','minusRawResourceFromSelf','none','none','Play on a zone as a land: ALL opposing units here lose combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/04.png' },

    { id: 217, name: 'Field', type: 'civilization', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Sprout',
        effect: [['statChange','ally','none','modifyCombat','rawResourceFromSelf','none','none','Play on a zone as a land: ALL your units here receive combat equal to their raw resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/05.png' },

    { id: 218, name: 'Civilization Card', type: 'civilization', faction: ['insect'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Organization',
        effect: [['statChange','column','none','modifyResource','Organization','none','none','ALL units receive resource equal to their raw combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/06.png' },

    { id: 219, name: 'Field', type: 'civilization', faction: ['dragon'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 2, status: [], cardName: 'Magical Absorbance',
        effect: [['preventNullificationChangeSwap','column','none','preventNull','nullify','change','none','Play on a zone as a land : ALL units here cannot have their abilities nullified nor changed while they are active']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/07.png' },

    { id: 220, name: 'Field', type: 'civilization', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 3, status: [], cardName: 'Plea',
        effect: [['statChange','column','none','modifyCombat','countPowerUpAlly','none',4,'Toe','Play on a zone as a land : ALL units here with exactly 1 power up attached receive +4 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/08.png' },

    { id: 221, name: 'Civilization Card', type: 'civilization', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Evolving Calamity',
        effect: [['statChange','ally','none','modifyCombat',1,'nullifyActive','none','ALL your units with their abilities nullified or changed receive +1 combat'],
            ['statChange','ally','none','modifyResource',2,'nullifyActive','none','ALL your units with their abilities nullified or changed receive +2 resource']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/09.png' },

    { id: 222, name: 'Civilization Card', type: 'civilization', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Living Nightmare',
        effect: [['statChange','ally','none','modifyResource',-2,'none','none','ALL your units receive -2 resource.'],
            ['nullificationChangeSwap','ally','none','replaceEffect','Living Nightmare','none','none','Replace the ability of ALL your units with an opposing unit\'s ability in their respective zone']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/10.png' },

    { id: 223, name: 'Civilization Card', type: 'civilization', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Soul Exchange',
        effect: [['nullificationChangeSwap','opposing','none','replaceEffect','Soul Exchange','none','none','Replace the ability of ALL opposing undead units by "this unit receives -1 combat when confronting an undead"']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/11.png' },

    { id: 224, name: 'Civilization Card', type: 'civilization', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Flesh Rot',
        effect: [['statChange','opposing','none','modifyCombat',-3,'undead','none','ALL opposing undead units receive -3 combat']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/12.png' },

    { id: 225, name: 'Civilization Card', type: 'civilization', faction: ['undead'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Pandemic',
        effect: [['statChange','opposing','none','replaceEffect','Pandemic','none','none','Change the abilities of ALL opposing units which are used if they are defeated to "ALL your units become undead and lose their other types" if they are confronting undead units']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/13.png' },




    /*
    { id: 237, name: 'Civilization Card', type: 'civilization', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Mechanization',
        effect: [['statChange','ally','none','modifyResource',1,'none','none','ALL your units receive +1 resource'],
            ['quick-use','Attach an opponent\'s power up from one unit to another one of their units']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/060.png' },

{ id: 236, name: 'Field', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Frost',
        effect: [['before_anything','Play on a zone as a land: confrontation in this zone will be the last to take place']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/18.png' },

        { id: 235, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Transplant',
        effect: [['quick-use','Attach one of your power ups from one of your units to another one of your units, twice']],
        image: 'Individual_Cards/Nucleic_Evolution_3_pngs/fronts/19.png' },

        { id: 234, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Nature\'s Judgement',
        effect: [['quick-use','Remove a civilization card played on a zone as a land']],
        image: 'Individual_Cards/Nucleic_Evolution_2_pngs/fronts/073.png' },

        { id: 233, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Tale',
        effect: [['quick-use','Chose one of your units without any power ups attached. Attach exactly two power ups from your other units to that unit']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/137.png' },
    { id: 232, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Nature\'s Will',
        effect: [['quick-use','Look at an opponent\'s land, then swap two of their lands']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/138.png' },
    { id: 231, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Hardships',
        effect: [['quick-use','Look at an opponent\'s power up, then attach one of their power ups to one of their other units']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/139.png' },
    { id: 230, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Fall',
        effect: [['quick-use','Swap two of an opponent\'s units (they conserve any power up)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/140.png' },
    { id: 229, name: 'Civilization Card', type: 'civilization', faction: ['basic'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Defiance',
        effect: [['quick-use','Look at an opponent\'s unit, then swap two of your units (they conserve any power up)']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/141.png' },

        { id: 228, name: 'Civilization Card', type: 'civilization', faction: ['android'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Face-Off',
        effect: [['quick-use','Select a zone. Confrontation in that zone is applied immediately']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/132.png' },

        { id: 227, name: 'Civilization Card', type: 'civilization', faction: ['ancient'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Formation',
        effect: [['quick-use','Choose an opposing unit with at least one power up. Attach all of that opponent\'s power ups from other zones to that unit']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/128.png' },

    { id: 226, name: 'Civilization Card', type: 'civilization', faction: ['angel'], resource: 0, combat: 0,rawResource: 0, rawCombat: 0, placement: 1, status: [], cardName: 'Assemble',
        effect: [['quick-use','Copy your opponent\'s last \'Civilization\' card effect']],
        image: 'Individual_Cards/Nucleic_Evolution_1_pngs/fronts/129.png' },

     */
];

// 333 cards counted

window.cards = cards;
