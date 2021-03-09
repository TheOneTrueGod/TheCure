'use strict';

class DiseaseRegistryComponent extends React.Component {
    constructor(props) {
        super(props);
        EventHandlerSingleton.addListener(EventHandler.EVENTS.DISEASE_UPDATED, () => {
            this.setState(this.state);
        })
    }

    render() {
        let diseasesRendered = [];
        let diseaseList = this.props.diseaseList;
        for (let i = 0; i < diseaseList.diseases.length; i++) {
            let curesResearched = [];
            for (let j = 0; j < diseaseList.curesResearched.length; j++) {
                let cureEffects = diseaseList.diseases[i].getCureEffect(diseaseList.curesResearched[j].id);
                let cureEffectStyle = {
                    width: '25px',
                    height: '25px',
                    position: 'absolute',
                    bottom: 0,
                    border: '2px solid black',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                };
                let borderColor = diseaseList.diseases[i].getColor();
                if (diseaseList.diseases[i].treatmentCure === diseaseList.curesResearched[j]) {
                    borderColor = '#FF00FF';
                }
                curesResearched.push(React.createElement('div',
                    {
                        key: `cure-${j}`,
                        style: {
                            width: '50px',
                            height: '50px',
                            paddingBottom: '20px',
                            border: `4px solid ${borderColor}`,
                            borderRadius: '8px',
                            display: 'inline-block',
                            margin: '0 4px',
                            position: 'relative',
                        }
                    },
                    React.createElement('img', {src: diseaseList.curesResearched[j].getIcon(), style: {width: '100%', height: '100%'}}),
                    cureEffects.length > 0 &&
                        React.createElement('div', { style: { left: 0, ...cureEffectStyle } },
                            React.createElement('img', {src: cureEffects[0].getIcon(), style: {width: '100%', height: '100%'}}),
                        ),
                    cureEffects.length > 1 &&
                        React.createElement('div', { style: {right: 0, ...cureEffectStyle } },
                            React.createElement('img', {src: cureEffects[1].getIcon(), style: {width: '100%', height: '100%'}})
                        ),
                ));
            }
            diseasesRendered.push(React.createElement('div', { key: i },
                React.createElement('div',
                    {
                        style: {
                            key: 'disease',
                            width: '50px',
                            height: '50px',
                            border: `4px solid ${diseaseList.diseases[i].getColor()}`,
                            borderRadius: '8px',
                            float: 'left',
                            marginRight: '10px',
                        }
                    },
                    React.createElement('img', { src: diseaseList.diseases[i].getIcon(), style: {width: '100%', height: '100%'} }),
                ),
                curesResearched
            ));
        }

        return (
            React.createElement('div', {style: {marginTop: '8px'}, className: this.props.className}, diseasesRendered)
        );
    }
}
