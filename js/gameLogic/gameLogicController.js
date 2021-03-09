class GameLogicController {
  constructor() {
      this.ticksSinceLogic = 0;
  }

  tick(gameData, tickSpeed) {
    switch (tickSpeed) {
        case(TICK_SPEED.PAUSE):
            break;
        case(TICK_SPEED.ONE):
            this.ticksSinceLogic += 1;
            break;
        case(TICK_SPEED.TWO):
            this.ticksSinceLogic += 2;
            break;
        case(TICK_SPEED.FOUR):
            this.ticksSinceLogic += 4;
            break;
        case(TICK_SPEED.EIGHT):
            this.ticksSinceLogic += 8;
            break;
        case(TICK_SPEED.LUDACROUS):
            this.ticksSinceLogic += 100;
            break;
    }
    if (this.ticksSinceLogic < 50) {
        return;
    }
    this.ticksSinceLogic = 0;

    gameData.currTime += 1;
    let i = 0;
    while (i < gameData.playerActions.length) {
        if (gameData.playerActions[i].isDone(gameData.currTime)) {
            EventHandlerSingleton.throwEvent(EventHandler.EVENTS.PLAYER_ACTION_COMPLETED, {action: gameData.playerActions[i]});
            gameData.playerActions[i].throwEvent(EventHandler.EVENTS.PLAYER_ACTION_COMPLETED, {action: gameData.playerActions[i]});
            gameData.playerActions.splice(i, 1);
        } else {
            i ++;
        }
    }

    for (let key in gameData.regions) {
        gameData.regions[key].tick();
    }

    if (gameData.currTime % TICKS_PER_DAY === 0) {
        this.onDayEnd();
    }

    if (gameData.currTime % TICKS_PER_WEEK === 0) {
        this.onWeekEnd(gameData);
    }
  }

  onDayEnd() {
      const MAX_PEOPLE_VISITING_DOCTOR = 1000;
      for (let rKey in gameData.regions) {
          const region = gameData.regions[rKey];
          const diseases = region.diseasesInRegion;
          for (let i = 0; i < region.diseasesInRegion.length; i++) {
              const disease = region.diseasesInRegion[i];
              if (disease.treatmentPlan) {
                  region.diseasesInRegion[i].tryToCure(disease.treatmentPlan, MAX_PEOPLE_VISITING_DOCTOR);
              }
          }
      }
  }

  onWeekEnd(gameData) {
      let negativeEvents = [
          {name: NEGATIVE_EVENTS.SPREAD, amount: 0.25, weight: 3},
          {name: NEGATIVE_EVENTS.SPREAD, amount: 0.5, weight: 2},
          {name: NEGATIVE_EVENTS.SPREAD, amount: 1, weight: 1},
          {name: NEGATIVE_EVENTS.MIGRATE, weight: 4},
      ]
      let total = 0;
      for (let i = 0; i < negativeEvents.length; i++) {
          total += negativeEvents[i].weight;
      }
      let negativeEvent = null;
      let r = Math.random() * total;
      for (let i = 0; i < negativeEvents.length; i++) {
          r -= negativeEvents[i].weight;
          if (r <= 0) {
              negativeEvent = negativeEvents[i];
              break;
          }
      }

      let nothingHappened = false;
      let logText = '';
      switch (negativeEvent.name) {
          case NEGATIVE_EVENTS.SPREAD:
            let totalNewInfected = 0;
            for (let key in gameData.regions) {
                let diseasesInRegion = gameData.regions[key].diseasesInRegion;
                for (let dkey in diseasesInRegion) {
                    let sampleGroup = diseasesInRegion[dkey].getSampleGroup(diseasesInRegion[dkey].numInfected * negativeEvent.amount);
                    diseasesInRegion[dkey].setInfected(
                        diseasesInRegion[dkey].numInfected + sampleGroup.healthy
                    );
                    totalNewInfected += sampleGroup.healthy;
                }
            }
            if (totalNewInfected > 0) {
                logText = "A sudden breakout occured, resulting in " + totalNewInfected + " newly infected people!";
                EventHandlerSingleton.throwEvent(EventHandler.EVENTS.CREATE_GAME_LOG, {type: GameLog.LOG_TYPES.NEGATIVE_EVENT, logText});
            } else {
                nothingHappened = true;
            }
            break;
        case NEGATIVE_EVENTS.MIGRATE:
            nothingHappened = true;
            let validSourceRegions = [];
            for (let key in gameData.regions) {
                if (Object.keys(gameData.regions[key].diseasesInRegion).length > 0) {
                    validSourceRegions.push(key);
                }
            }
            if (!validSourceRegions.length) {
                break;
            }
            let regions = Object.keys(gameData.regions);
            let sourceRegion = gameData.regions[validSourceRegions[Math.floor(Math.random() * validSourceRegions.length)]];

            let validTargetRegions = [];
            for (let key in gameData.regions) {
                if (gameData.regions[key] !== sourceRegion && gameData.regions[key].regionType !== GameRegion.REGION_TYPES.HOME_BASE) {
                    validTargetRegions.push(key);
                }
            }
            if (!validTargetRegions.length) {
                break;
            }
            let targetRegion = gameData.regions[validTargetRegions[Math.floor(Math.random() * validTargetRegions.length)]];

            let diseasesInRegion = Object.keys(sourceRegion.diseasesInRegion);
            let disease = sourceRegion.diseasesInRegion[diseasesInRegion[Math.floor(Math.random() * diseasesInRegion.length)]].disease;

            nothingHappened = false;
            targetRegion.addDisease(disease, 1000);
            logText = `Travellers have brought ${disease.getDisplayName()} with them from ${sourceRegion.getDisplayName()} to ${targetRegion.getDisplayName()}.`;
            break;
      }
      if (nothingHappened) {
          logText = "A calm and quiet week passes by uneventfully.";
      }
      EventHandlerSingleton.throwEvent(EventHandler.EVENTS.CREATE_GAME_LOG, {type: GameLog.LOG_TYPES.NEGATIVE_EVENT, logText});
  }
}

const NEGATIVE_EVENTS = {
    SPREAD: 'SPREAD',
}
