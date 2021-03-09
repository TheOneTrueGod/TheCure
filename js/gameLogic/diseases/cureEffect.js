class CureEffect {
    constructor(options) {
        this.options = {
            icon: CureEffect.IMAGES.PLACEHOLDER,
            ...options
        };
    }

    doEffect(diseaseInRegion, sampleGroup) {
        let logText = "";
        let startingHealthy = sampleGroup.healthy;
        let startingInfected = sampleGroup.infected;
        if (this.options.killPercent) {
            let healthyToKill = randomRound(sampleGroup.healthy * this.options.killPercent);
            let infectedToKill = randomRound(sampleGroup.infected * this.options.killPercent);
            sampleGroup.healthy -= healthyToKill;
            sampleGroup.infected -= infectedToKill;
            diseaseInRegion.setInfected(diseaseInRegion.numInfected - infectedToKill);
            diseaseInRegion.kill(healthyToKill + infectedToKill);
            logText += `${healthyToKill + infectedToKill} out of ${startingHealthy + startingInfected} people were killed`;
        }

        if (this.options.curePercent) {
            let numToCure = randomRound(sampleGroup.infected * this.options.curePercent);
            sampleGroup.infected -= numToCure;
            sampleGroup.healthy += numToCure;
            diseaseInRegion.setInfected(diseaseInRegion.numInfected - numToCure);
            logText += `${numToCure} out of ${startingInfected} infected people were cured`;
        }

        return logText;
    }

    static getRandomCureEffect(positive, strength, variance) {
        if (strength === undefined) { strength = 2.5; }
        if (variance === undefined) { variance = 2.5; }
        let effectStrength = Math.min(5, Math.max(0, randomRound((Math.random() - 0.5) * variance + strength)));
        return positive ?
            CureEffect.getRandomPositiveCureEffect(effectStrength) :
            CureEffect.getRandomNegativeCureEffect(effectStrength)
    }

    static getRandomPositiveCureEffect(strength) {
        let possibleEffects = CureEffect.effects.positive[strength];
        let effectIndex = Math.floor(Math.random() * possibleEffects.length);
        return new CureEffect(possibleEffects[effectIndex]);
    }

    static getRandomNegativeCureEffect(strength) {
        let possibleEffects = CureEffect.effects.negative[strength];
        let effectIndex = Math.floor(Math.random() * possibleEffects.length);
        return new CureEffect(possibleEffects[effectIndex]);
    }

    determineIcon() {
        if (this.options.curePercent) {
            if (this.options.curePercent <= 0.2) {
                this.icon = CureEffect.IMAGES.CURE_20;
            } else if (this.options.curePercent <= 0.4) {
                this.icon = CureEffect.IMAGES.CURE_40;
            } else if (this.options.curePercent <= 0.6) {
                this.icon = CureEffect.IMAGES.CURE_60;
            } else if (this.options.curePercent <= 0.8) {
                this.icon = CureEffect.IMAGES.CURE_80;
            } else {
                this.icon = CureEffect.IMAGES.CURE_100;
            }
        } else if (this.options.killPercent) {
            if (this.options.killPercent <= 0.2) {
                this.icon = CureEffect.IMAGES.DEATH_20;
            } else if (this.options.killPercent <= 0.4) {
                this.icon = CureEffect.IMAGES.DEATH_40;
            } else if (this.options.killPercent <= 0.6) {
                this.icon = CureEffect.IMAGES.DEATH_60;
            } else if (this.options.killPercent <= 0.8) {
                this.icon = CureEffect.IMAGES.DEATH_80;
            } else {
                this.icon = CureEffect.IMAGES.DEATH_100;
            }
        } else {
            this.icon = CureEffect.IMAGES.PLACEHOLDER;
        }
    }

    getIcon() {
        if (!this.icon) {
            this.determineIcon();
        }

        return this.icon;
    }
}

CureEffect.IMAGES = {
    PLACEHOLDER: '/assets/icons/questionmark.png',
    CURE_20: '/assets/icons/cure_rank_0.svg',
    CURE_40: '/assets/icons/cure_rank_1.svg',
    CURE_60: '/assets/icons/cure_rank_2.svg',
    CURE_80: '/assets/icons/cure_rank_3.svg',
    CURE_100: '/assets/icons/cure_rank_4.svg',

    DEATH_20: '/assets/icons/death_rank_0.svg',
    DEATH_40: '/assets/icons/death_rank_1.svg',
    DEATH_60: '/assets/icons/death_rank_2.svg',
    DEATH_80: '/assets/icons/death_rank_3.svg',
    DEATH_100: '/assets/icons/death_rank_4.svg',
};

// Ideas for cure effects;
// Negative
// Infect more people (only affects those exposed)
// Mutation; disease kills faster
// Mutation; disease spreads faster
// Cure Taint;  This cure will forever spread the disease
// Cure Taint;  This cure will
// The medic administering the cure dies

// Neutral
// No effect
// Cure the people, and then over the next X time expose more people to it
// Mutation;  Cure.  The disease becomes a new disease.
// Kill everyone it is applied to
// Immunize only people who don't have the disease.  Kill some of them
// A combination of a positive and a negative effect

// Positive
// Cure the disease
// Mutation; reduce its spreadability
// Mutation; reduce its lethality
// Cure and Immunize people against the disease
// Cure taint:  cure does a new thing for all other diseases, and is more likely to become positive.


CureEffect.effects = {
    'positive': {
        0: [
            { name: 'Cure 1', curePercent: 0.2, },
        ],
        1: [
            { name: 'Cure 2', curePercent: 0.4, },
        ],
        2: [
            { name: 'Cure 3', curePercent: 0.6, },
        ],
        3: [
            { name: 'Cure 4', curePercent: 0.8, },
        ],
        4: [
            { name: 'Cure 5', curePercent: 0.9, },
        ],
        5: [
            { name: 'Cure 5', curePercent: 1.0, },
        ],
    },
    'negative': {
        0: [
            { name: 'Kill 1', killPercent: 0.2, },
        ],
        1: [
            { name: 'Kill 2', killPercent: 0.4, },
        ],
        2: [
            { name: 'Kill 3', killPercent: 0.6, },
        ],
        3: [
            { name: 'Kill 4', killPercent: 0.8, },
        ],
        4: [
            { name: 'Kill 5', killPercent: 0.9, },
        ],
        5: [
            { name: 'Kill 5', killPercent: 1.0, },
        ],
    }
}

let UnknownCure = new CureEffect();
