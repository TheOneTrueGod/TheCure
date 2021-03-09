class Cure {
    constructor(id, options) {
        this.id = id;
        this.options = {
            icon: Cure.IMAGES.PLACEHOLDER,
            ...options
        };
    }

    getDisplayName() {
        return this.id;
    }

    getIcon() {
        return this.options.icon;
    }
}

Cure.IMAGES = {
    PLACEHOLDER: '/assets/icons/questionmark.png',
};
