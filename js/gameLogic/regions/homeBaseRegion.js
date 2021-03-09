class HomeBaseRegion extends GameRegion {
    getActions() {
        let actions = [];
        actions.push(new RegionAction(
            GameRegion.REGION_ACTIONS.SET_TREATMENT_PLAN,
            {
                options: [RegionAction.OPTIONS.DISEASE, RegionAction.OPTIONS.CURE],
                sourceRegion: this,
                targetRegion: this,
                time: 20,
                unitCost: 1,
                icon: RegionOption.IMAGES.TREATMENT_PLAN,
                isEnabled: () => this.playerUnits > 0,
            }
        ));
        return actions;
    }
}
