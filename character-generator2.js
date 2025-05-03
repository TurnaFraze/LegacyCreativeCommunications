document.addEventListener('DOMContentLoaded', function() {
    const classHitDie = {
        'Barbarian': 12,
        'Fighter': 10,
        'Paladin': 10,
        'Ranger': 10,
        'Bard': 8,
        'Cleric': 8,
        'Druid': 8,
        'Monk': 8,
        'Rogue': 8,
        'Warlock': 8,
        'Wizard': 6,
        'Sorcerer': 6
    };

    const classSavingThrows = {
        'Barbarian': ['Strength', 'Constitution'],
        'Bard': ['Dexterity', 'Charisma'],
        'Cleric': ['Wisdom', 'Charisma'],
        'Druid': ['Intelligence', 'Wisdom'],
        'Fighter': ['Strength', 'Constitution'],
        'Monk': ['Strength', 'Dexterity'],
        'Paladin': ['Wisdom', 'Charisma'],
        'Ranger': ['Strength', 'Dexterity'],
        'Rogue': ['Dexterity', 'Intelligence'],
        'Sorcerer': ['Constitution', 'Charisma'],
        'Warlock': ['Wisdom', 'Charisma'],
        'Wizard': ['Intelligence', 'Wisdom']
    };

    function getAbilityTotalsScenario() {
        const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
        return rolls.sort((a, b) => b - a).slice(0, 3).reduce((sum, num) => sum + num, 0);
    }

    function mapTotalsToStatsScenario(totals) {
        return {
            'Strength': getAbilityTotalsScenario(),
            'Dexterity': getAbilityTotalsScenario(),
            'Constitution': getAbilityTotalsScenario(),
            'Intelligence': getAbilityTotalsScenario(),
            'Wisdom': getAbilityTotalsScenario(),
            'Charisma': getAbilityTotalsScenario()
        };
    }

    function applyRaceBonuses(stats, race) {
        const newStats = { ...stats };
        switch (race) {
            case 'Dwarf':
                newStats.Constitution += 2;
                break;
            case 'Elf':
                newStats.Dexterity += 2;
                break;
            case 'Halfling':
                newStats.Dexterity += 2;
                break;
            case 'Human':
                Object.keys(newStats).forEach(stat => newStats[stat] += 1);
                break;
            case 'Dragonborn':
                newStats.Strength += 2;
                newStats.Charisma += 1;
                break;
            case 'Gnome':
                newStats.Intelligence += 2;
                break;
            case 'Half-Elf':
                newStats.Charisma += 2;
                // Player should choose two other abilities to increase by 1
                break;
            case 'Half-Orc':
                newStats.Strength += 2;
                newStats.Constitution += 1;
                break;
            case 'Tiefling':
                newStats.Charisma += 2;
                newStats.Intelligence += 1;
                break;
        }
        return newStats;
    }

    function fillCharacterSheet(characterData) {
        const {
            race,
            class: characterClass,
            background,
            stats,
            modifiers,
            hp,
            passivePerception
        } = characterData;

        // Basic Information
        document.querySelector('[name="classlevel"]').value = `${characterClass} 1`;
        document.querySelector('[name="background"]').value = background;
        document.querySelector('[name="race"]').value = race;
        document.querySelector('[name="alignment"]').value = ""; // Let user choose
        document.querySelector('[name="experiencepoints"]').value = "0";
        document.querySelector('[name="playername"]').value = "TurnaFraze";

        // Ability Scores and Modifiers
        const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
        abilities.forEach(ability => {
            document.querySelector(`[name="${ability}score"]`).value = stats[ability];
            document.querySelector(`[name="${ability}mod"]`).value = modifiers[ability];
        });

        // Skills
        const skillMap = {
            'acrobatics': 'Dexterity',
            'animal-handling': 'Wisdom',
            'arcana': 'Intelligence',
            'athletics': 'Strength',
            'deception': 'Charisma',
            'history': 'Intelligence',
            'insight': 'Wisdom',
            'intimidation': 'Charisma',
            'investigation': 'Intelligence',
            'medicine': 'Wisdom',
            'nature': 'Intelligence',
            'perception': 'Wisdom',
            'performance': 'Charisma',
            'persuasion': 'Charisma',
            'religion': 'Intelligence',
            'sleight-of-hand': 'Dexterity',
            'stealth': 'Dexterity',
            'survival': 'Wisdom'
        };

        // Background skill proficiencies
        const backgroundSkills = {
            'Acolyte': ['insight', 'religion'],
            'Charlatan': ['deception', 'sleight-of-hand'],
            'Criminal': ['deception', 'stealth'],
            'Entertainer': ['acrobatics', 'performance'],
            'Folk Hero': ['animal-handling', 'survival'],
            'Guild Artisan': ['insight', 'persuasion'],
            'Hermit': ['medicine', 'religion'],
            'Noble': ['history', 'persuasion'],
            'Outlander': ['athletics', 'survival'],
            'Sage': ['arcana', 'history'],
            'Sailor': ['athletics', 'perception'],
            'Soldier': ['athletics', 'intimidation'],
            'Urchin': ['sleight-of-hand', 'stealth']
        };

        // Fill skills
        Object.entries(skillMap).forEach(([skill, ability]) => {
            const isProficient = backgroundSkills[background]?.includes(skill) || false;
            const mod = parseInt(modifiers[ability].replace('+', ''));
            const skillMod = mod + (isProficient ? 2 : 0);
            const skillValue = (skillMod >= 0 ? '+' : '') + skillMod;

            document.querySelector(`[name="${skill}-prof"]`).checked = isProficient;
            document.querySelector(`[name="${skill}"]`).value = skillValue;
        });

        // Combat Stats
        const dexMod = parseInt(modifiers['Dexterity'].replace('+', ''));
        document.querySelector('[name="initiative"]').value = modifiers['Dexterity'];
        document.querySelector('[name="armor-class"]').value = 10 + dexMod;
        document.querySelector('[name="hp"]').value = hp;
        
        // Base speed by race
        const raceSpeeds = {
            'Dwarf': 25,
            'Halfling': 25,
            'Gnome': 25,
            default: 30
        };
        document.querySelector('[name="speed"]').value = raceSpeeds[race] || raceSpeeds.default;
    }

    // Saving Throws (outside fillCharacterSheet to ensure it runs)
    const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
    
    document.getElementById('generate-btn').addEventListener('click', function() {
        const formElements = document.getElementById('char-form').elements;
        const totals = getAbilityTotalsScenario();
        const baseStats = mapTotalsToStatsScenario(totals);
        const race = formElements['race'].value;
        const characterClass = formElements['class'].value;
        const background = formElements['background'].value;

        const finalStats = applyRaceBonuses(baseStats, race);
        const modifiers = {};
        for (const ab of Object.keys(finalStats)) {
            const mod = Math.floor((finalStats[ab] - 10) / 2);
            modifiers[ab] = (mod >= 0 ? "+" : "") + mod;
        }

        // Calculate derived stats
        const conMod = parseInt(modifiers.Constitution.replace('+', ''));
        const hitDie = classHitDie[characterClass] || 8;
        const hp = hitDie + conMod;
        const wisMod = parseInt(modifiers.Wisdom.replace('+', ''));
        const passivePerception = 10 + wisMod;

        // Fill the character sheet
        fillCharacterSheet({
            race,
            class: characterClass,
            background,
            stats: finalStats,
            modifiers,
            hp,
            passivePerception
        });

        // Calculate and fill saving throws
        abilities.forEach(ability => {
            const isProficient = classSavingThrows[characterClass]?.includes(ability) || false;
            const modValue = parseInt(modifiers[ability].replace('+', ''));
            const saveBonus = modValue + (isProficient ? 2 : 0);
            const saveValue = (saveBonus >= 0 ? '+' : '') + saveBonus;
            
            const saveName = ability.toLowerCase();
            const profCheckbox = document.querySelector(`[name="${saveName}-save-prof"]`);
            const saveInput = document.querySelector(`[name="${saveName}-save"]`);
            
            if (profCheckbox) profCheckbox.checked = isProficient;
            if (saveInput) saveInput.value = saveValue;
        });
    });
});