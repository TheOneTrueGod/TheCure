class GameData {
    constructor() {
        this.currTime = 0;
        this.regions = {};
        this.gameLog = new GameLog();
        let patientZeroRegion = this.createRegion(100, 100, 140);
        this.createRegion(500, 100, 140);
        this.createRegion(100, 300, 140);
        this.createRegion(500, 300, 140);
        this.homeBase = this.createRegion(300, 200, 200, {regionType: GameRegion.REGION_TYPES.HOME_BASE});
        this.homeBase.playerUnits = 5;
        this.diseaseList = new DiseaseList();

        patientZeroRegion.addDisease(this.diseaseList.makeNewDisease(0), 1000);

        EventHandlerSingleton.addListener(EventHandler.EVENTS.NEW_PLAYER_ACTION, this.newPlayerActionListener.bind(this));
        this.playerActions = [];
    }

    getPlayerUnitsInBase() {
        return this.homeBase.playerUnits;
    }

    takePlayerUnitFromBase(num) {
        this.homeBase.playerUnits -= num ? num : 1;
        if (this.homeBase.playerUnits <= 0) {
            throw new Error("Can't have less than 0 units in base.");
        }
    }

    newPlayerActionListener(args) {
        this.playerActions.push(args.action);
        args.action.start(this.currTime);
        EventHandlerSingleton.throwEvent(EventHandler.EVENTS.PLAYER_ACTION_STARTED, {action: args.action});
        args.action.throwEvent(EventHandler.EVENTS.PLAYER_ACTION_STARTED, {action: args.action});
        args.action.sourceRegion.addActionWatched(args.action);
        if (args.action.sourceRegion !== args.action.targetRegion) {
            args.action.targetRegion.addActionWatched(args.action);
        }
    }

    createRegion(x, y, radius, options) {
        let RegionType = StandardRegion;
        if (options && options.regionType) {
            switch (options.regionType) {
                case GameRegion.REGION_TYPES.STANDARD:
                    RegionType = StandardRegion;
                    break;
                case GameRegion.REGION_TYPES.HOME_BASE:
                    RegionType = HomeBaseRegion;
                    break;
            }
        }

        let newRegion = new RegionType(
            REGION_INDEX ++,
            this,
            {x, y},
            radius,
            options,
        );

        this.regions[newRegion.id] = newRegion;
        return newRegion;
    }
}
