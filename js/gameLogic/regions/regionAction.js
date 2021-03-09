class RegionAction {
    constructor(name, params) {
        this.params = {
            action: name,
            options: [],
            sourceRegion: this,
            targetRegion: this,
            time: 20,
            unitCost: 1,
            icon: RegionOption.IMAGES.PLACEHOLDER,
            isEnabled: () => false,
            ...params
        }
    }

    getOptions() {
        return this.params.options;
    }

    getIcon() {
        return this.params.icon;
    }
}


RegionAction.OPTIONS = {
    CURE: 'CURE',
    DISEASE: 'DISEASE',
}
