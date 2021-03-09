class DiseaseList {
    constructor() {
        this.diseases = [];
        this.curesResearched = [
            new Cure("Apply Leeches", {icon: '/assets/icons/leeching-worm.svg'}),
            new Cure("Bloodletting", {icon: '/assets/icons/blood.svg'})
        ];
        this.curesNotResearched = [

        ]
    }

    makeNewDisease(difficulty) {
        let color = DiseaseList.DISEASE_COLORS[this.diseases.length];
        let icon = DiseaseList.DISEASE_ICONS[Math.floor(Math.random() * DiseaseList.DISEASE_ICONS.length)];
        let newDisease = new Disease(this.diseases.length, color, icon);
        this.diseases.push(newDisease);
        return newDisease;
    }
}

DiseaseList.DISEASE_COLORS = [
    '#0000BB',
    '#00BB00',
    '#BB0000',
]

DiseaseList.DISEASE_ICONS = [
    '/assets/icons/parmecia.svg',
    '/assets/icons/tick.svg',
    '/assets/icons/tumor.svg',
    '/assets/icons/virus.svg',
];
