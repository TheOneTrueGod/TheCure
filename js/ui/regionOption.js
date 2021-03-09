'use strict';

class RegionOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {optionsShowing: false};
  }

  render() {
    const size = 40;
    const halfSize = size / 2;
    const x = Math.cos(this.props.targetPos.angle) * (this.props.targetPos.dist);
    const y = Math.sin(this.props.targetPos.angle) * (this.props.targetPos.dist);
    return React.createElement(
      'div',
      {
          onClick: (e) => {
            this.props.action.params.isEnabled() && this.props.onClick && this.props.onClick(e);
          },
          className: ['regionOption', (this.props.visible ? 'regionVisible' : 'regionHidden')].join(' '),
          style: {
              width: `${size}px`,
              height: `${size}px`,
              top: `calc(50% - ${halfSize}px)`,
              left: `calc(50% - ${halfSize}px)`,
              transform: (this.props.visible ?
                  `translate(${x}px, ${y}px)` :
                  `translate(0px, 0px)`),
              zIndex: '1',
              visibility: this.props.action.params.isEnabled() ? null : 'hidden',
          },
      },
      React.createElement('img', { className: 'regionImage', src: this.props.image })
    );
  }
}

RegionOption.IMAGES = {
    PLACEHOLDER: '/assets/icons/questionmark.png',
    RUN: '/assets/icons/run.png',
    WALK: '/assets/icons/walk.png',
    MEDICINE: '/assets/icons/medicine-pills.png',
    TREATMENT_PLAN: '/assets/icons/doctor-face.svg',
};
