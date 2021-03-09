class EventHandler {
    constructor() {
        this.handlers = {};
    }

    addListener(eventName, callback) {
        if (!eventName) {
            throw new Error("Can't listen on an empty eventName");
        }
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(callback);
    }

    throwEvent(eventName, args) {
        if (!this.handlers[eventName]) {
            return;
        }

        for (let i = 0, len = this.handlers[eventName].length; i < len; i++) {
            this.handlers[eventName][i](args);
        }
    }
}

EventHandler.EVENTS = {
    NEW_PLAYER_ACTION: 'NEW_PLAYER_ACTION',
    PLAYER_ACTION_STARTED: 'PLAYER_ACTION_STARTED',
    PLAYER_ACTION_COMPLETED: 'PLAYER_ACTION_COMPLETED',
    DISEASE_UPDATED: 'DISEASE_UPDATED',
    CREATE_GAME_LOG: 'CREATE_GAME_LOG',
};

const EventHandlerSingleton = new EventHandler();
