var REGION_INDEX = 0;
class GameRegion {
    constructor(id, gameData, position, radius, options) {
        this.id = id;
        this.diseaseIndex = 0;
        this.position = {x: position.x, y: position.y};
        this.radius = radius;
        this.connections = [];
        this.regionType = (options && options.regionType) || GameRegion.REGION_TYPES.STANDARD;
        this.actionsWatched = [];
        this.population = 100000;
        this.diseasesInRegion = {};
        this.playerUnits = DEBUG_MODE ? 1 : 0;
        this.gameData = gameData;
        EventHandlerSingleton.addListener(EventHandler.EVENTS.PLAYER_ACTION_STARTED, this.playerActionStarted.bind(this));
        EventHandlerSingleton.addListener(EventHandler.EVENTS.PLAYER_ACTION_COMPLETED, this.globalPlayerActionComplete.bind(this))
    }

    getDisplayName() {
        return "Region " + this.id;
    }

    addDisease(disease, number) {
        if (!this.diseasesInRegion[disease.index]) {
            this.diseasesInRegion[disease.index] = new DiseaseInRegion(this, disease);
            this.diseasesInRegion[disease.index].setInfected(number);
        } else {
            this.diseasesInRegion[disease.index].setInfected(this.diseasesInRegion[disease.index].numInfected + number);
        }
    }

    addActionWatched(action) {
        let listen = false;
        switch (action.name) {
            case GameRegion.REGION_ACTIONS.TRY_TO_CURE:
            case GameRegion.REGION_ACTIONS.MOVE_TO:
            case GameRegion.REGION_ACTIONS.SET_TREATMENT_PLAN:
            case GameRegion.REGION_ACTIONS.RETURN_HOME:
                listen = action.targetRegion === this;
                break;
            default:
                console.warn("No Watch behaviour for action: [" + action + "]");
        }
        if (listen) {
            action.addListener(EventHandler.EVENTS.PLAYER_ACTION_COMPLETED, this.playerActionCompleted.bind(this));
            this.actionsWatched.push(action);
        }
    }

    playerActionStarted(args) {
        if (args.action.sourceRegion === this) {
            this.playerUnits -= args.action.getPlayerUnitCost();
        }
    }

    globalPlayerActionComplete(args) {
        if (args.action.targetRegion === this) {
            this.playerUnits += args.action.getPlayerUnitCost();
        }
    }

    playerActionCompleted(args) {
        let actionIndex = this.actionsWatched.indexOf(args.action);
        if (actionIndex !== -1) {
            switch (args.action.name) {
                case (GameRegion.REGION_ACTIONS.TRY_TO_CURE):
                    if (args.action.optionList.length !== 2) {
                        throw new Error("Malformed PlayerAction.  TryToCure expects 2 options -- DISEASE and CURE");
                    }
                    let targetDiseaseIndex = args.action.optionList[0].index;
                    if (this.diseasesInRegion[targetDiseaseIndex]) {
                        this.diseasesInRegion[targetDiseaseIndex].tryToCure(args.action.optionList[1]);
                    }
            }
            this.actionsWatched.splice(actionIndex, 1);
        }
    }


    getActions() {
        let actions = [];
        return actions;
    }

    doAction(action, optionList) {
        EventHandlerSingleton.throwEvent(EventHandler.EVENTS.NEW_PLAYER_ACTION, {
            action: new PlayerAction(action, optionList)
        });
    }

    tick() {
        for (let key in this.diseasesInRegion) {
            this.diseasesInRegion[key].tick();
        }
    }

    kill(numPeople) {
        this.population = Math.max(0, this.population - numPeople);
    }
}

GameRegion.REGION_TYPES = {
    STANDARD: 'STANDARD',
    HOME_BASE: 'HOME_BASE',
};

GameRegion.REGION_ACTIONS = {
    MOVE_TO: 'MOVE_TO',
    TRY_TO_CURE: 'TRY_TO_CURE',
    RETURN_HOME: 'RETURN_HOME',
    SET_TREATMENT_PLAN: 'SET_TREATMENT_PLAN',
}
