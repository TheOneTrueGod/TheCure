class GameLog {
    constructor() {
        EventHandlerSingleton.addListener(
            EventHandler.EVENTS.CREATE_GAME_LOG,
            this.createNewGameLog.bind(this)
        );
        this.log = [
            {
                type: GameLog.LOG_TYPES.INFO,
                text: "Welcome to The Cure.  You've been contracted to find a cure for the diseases ravaging the countryside."
            }
        ];
    }

    createNewGameLog(data) {
        this.log.push({text: data.logText, type: data.type});
    }
}

GameLog.LOG_TYPES = {
    PLAYER_ACTION: 'PLAYER_ACTION',
    INFO: 'INFO',
    NEGATIVE_EVENT: 'NEGATIVE_EVENT',
}
