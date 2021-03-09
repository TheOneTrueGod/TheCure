const PEOPLE_TO_CURE = 1000;
class DiseaseInRegion {
    constructor(region, disease) {
        this.region = region;
        this.disease = disease;
        this.numInfected = 0;
        this.timeSinceInfect = 0;
        this.timeSinceDeaths = 0;
        this.timeSinceImmunized = 0;
        this.immunized = 0;
    }

    getDoctorsVisitSample() {
        const MAX_PEOPLE_VISITING_DOCTOR = 1000;
        const PERCENT_INFECTED_VISITING_DOCTOR = 0.1;

        let detectability = this.disease.getDetectability();



        return {
            healthyGroup: {
                healthy: 0,
                infected: 0,
                dead: 0,
            },
            sickGroup: {
                healthy: 0,
                infected: 0,
                dead: 0,
            }
        }
    }

    getSampleGroup(maxPeople) {
        let totalPop = this.region.population;
        let infectedPercent = this.numInfected / Math.max(totalPop, 1);
        let detectability = this.disease.getDetectability();
        maxPeople = Math.min(totalPop, maxPeople);

        let infectedSelected = randomRound(infectedPercent * maxPeople);
        infectedSelected = Math.min(infectedSelected, this.numInfected);

        return {
            healthy: randomRound((maxPeople - infectedSelected) * (1 - detectability)),
            infected: infectedSelected,
            dead: 0,
        };
    }

    tryToCure(cure, numPeople) {
        this.disease.applyCure(this, cure, numPeople || PEOPLE_TO_CURE, this.numInfected, this.region.population, this.immunized);
    }

    setInfected(number) {
        this.numInfected = Math.max(Math.min(number, this.region.population), 0);
    }

    kill(number) {
        this.region.kill(number);
    }

    tick() {
        this.timeSinceInfect += 1;
        this.timeSinceDeaths += 1;

        if (this.timeSinceInfect >= this.disease.getInfectionDelay()) {
            this.timeSinceInfect = 0;
            this.setInfected(
                this.numInfected +
                this.disease.getNewInfected(this.numInfected, this.region.population, this.immunized)
            );
        }

        if (this.timeSinceDeaths >= this.disease.getDeathDelay()) {
            this.timeSinceDeaths = 0;
            let newDead = Math.min(
                this.disease.getNewDead(this.numInfected),
                this.numInfected,
                this.region.population,
            );

            this.region.kill(newDead);
            this.setInfected(this.numInfected - newDead);
        }

        if (this.timeSinceImmunized >= this.disease.getImmunizationDelay()) {
            //TODO: Immunize people automatically
        }
    }
}
