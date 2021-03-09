class StandardRegion extends GameRegion {
    getActions() {
        let actions = [];

        actions.push(new RegionAction(
            GameRegion.REGION_ACTIONS.TRY_TO_CURE,
            {
                options: [RegionAction.OPTIONS.DISEASE, RegionAction.OPTIONS.CURE],
                sourceRegion: this,
                targetRegion: this,
                time: 20,
                unitCost: 1,
                icon: RegionOption.IMAGES.MEDICINE,
                isEnabled: () => this.playerUnits > 0,
            }
        ));

        actions.push(new RegionAction(
            GameRegion.REGION_ACTIONS.MOVE_TO,
            {
                options: [],
                sourceRegion: this,
                targetRegion: this.gameData.homeBase,
                time: 5,
                unitCost: 1,
                icon: RegionOption.IMAGES.WALK,
                isEnabled: () => this.playerUnits > 0 ,
            }
        ));

        actions.push(new RegionAction(
            GameRegion.REGION_ACTIONS.MOVE_TO,
            {
                options: [],
                sourceRegion: this.gameData.homeBase,
                targetRegion: this,
                time: 5,
                unitCost: 1,
                icon: RegionOption.IMAGES.RUN,
                isEnabled: () => this.gameData.homeBase.playerUnits > 0
            }
        ));
        return actions;
    }
}
