class PlayerAction extends EventHandler {
    constructor(regionAction, optionList) {
        super();
        this.name = regionAction.params.action;
        this.sourceRegion = regionAction.params.sourceRegion;
        this.targetRegion = regionAction.params.targetRegion;
        this.duration = regionAction.params.time;
        this.unitCost = regionAction.params.unitCost
        this.startTime = undefined;
        this.optionList = optionList;
    }

    getOptions() {
        return [];
    }

    getDuration() {
        return DEBUG_MODE ? 1 : this.duration;
    }

    getPlayerUnitCost() {
        return this.unitCost;
    }

    start(startTime) {
        this.startTime = startTime;
    }

    isDone(currTick) {
        return currTick > this.startTime + this.getDuration();
    }
}
