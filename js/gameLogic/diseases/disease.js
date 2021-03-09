class Disease {
    constructor(index, color, icon) {
        this.index = index;
        this.color = color;
        this.icon = icon;
        this.cureEffects = {}
        this.treatmentPlan = null
        EventHandlerSingleton.addListener(EventHandler.EVENTS.PLAYER_ACTION_COMPLETED, (args) => { this.setTreatmentPlanEventComplete(args) });
    }

    setTreatmentPlanEventComplete(args) {
        if (
            args.action.name !== GameRegion.REGION_ACTIONS.SET_TREATMENT_PLAN ||
            args.action.optionList[0] !== this
        ) {
            return true;
        }
        this.treatmentCure = args.action.optionList[1];
    }

    getDisplayName() {
        return "Disease " + this.index;
    }

    getCureEffect(cureID) {
        if (this.cureEffects[cureID]) {
            return this.cureEffects[cureID];
        }
        return [UnknownCure, UnknownCure];
    }

    getIcon() {
        return this.icon;
    }

    getColor() {
        return this.color;
    }

    setIndex(index) {
        this.index = index;
    }

    getDetectability() {
        return 0.2;
    }

    getInfectionDelay() {
        return 3;
    }

    getDeathDelay() {
        return 3;
    }

    getImmunizationDelay() {
        return 3;
    }

    generateCureEffects(cure) {
        this.cureEffects[cure.id] = [
            CureEffect.getRandomCureEffect(false),
            CureEffect.getRandomCureEffect(true),
        ];
        EventHandlerSingleton.throwEvent(EventHandler.EVENTS.DISEASE_UPDATED, {disease: this});
    }


    applyCure(diseaseInRegion, cure, targetPop, currInfected, population, populationImmune) {
        if (!this.cureEffects[cure.id]) {
            this.generateCureEffects(cure);
        }
        let sampleGroup = diseaseInRegion.getSampleGroup(targetPop);
        let effects = this.getCureEffect(cure.id);
        let logText = `You finished your trial run of ${cure.getDisplayName()} for ${diseaseInRegion.disease.getDisplayName()} in ${diseaseInRegion.region.getDisplayName()}`;
        let effect1Text = effects[0].doEffect(diseaseInRegion, sampleGroup);
        let effect2Text = effects[1].doEffect(diseaseInRegion, sampleGroup);

        if (effect1Text) {
            logText += ". " + effect1Text;
        }

        if (effect2Text) {
            if (effect1Text) {
                logText += ", and ";
            } else {
                logText += ". ";
            }
            logText += effect2Text;
        }

        logText += ".";

        EventHandlerSingleton.throwEvent(EventHandler.EVENTS.CREATE_GAME_LOG, {type: GameLog.LOG_TYPES.PLAYER_ACTION, logText});
    }

    getNewInfected(currInfected, population, populationImmune) {
        return Math.floor(currInfected * 0.01);
    }

    getNewDead(currInfected) {
        if (currInfected) {
            return 1;
        }
        return 0;
    }

    getNewImmunized(currInfected) {
        return 0;
    }
}
