class RegionActionOption {
    constructor(actionOption, params) {
        this.params = {
            actionOption: actionOption,
            isEnabled: () => true,
            ...params,
        }
    }

    getIcon() {
        return this.params.actionOption.getIcon();
    }
}
