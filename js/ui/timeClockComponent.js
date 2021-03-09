'use strict';

class TimeClockComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let firstVisible = (this.props.timePct % 1) >= 0.25 && (this.props.timePct % 1) < 0.75;
        return React.createElement(
            'div',
            {
                style: {
                    width: this.props.width || '100%',
                    height: this.props.height || '100%',
                    border: '2px solid black',
                    borderRadius: '100%',
                    background: 'white',
                    overflow: 'hidden',
                    position: 'relative',
                    ...this.props.style,
                }
            },
            React.createElement(
                'div',
                {
                    style: {
                        transform: 'rotate(' + (360 * this.props.timePct + 270) % 360 + 'deg)',
                        transition: 'transform 0.5s',
                        width: '100%',
                        height: '10%',
                        backgroundImage: 'linear-gradient(to right, white, white 50%, black 50%, black)',
                        position: 'absolute',
                        top: '44%',
                        left: '0',
                        visibility: firstVisible ? 'hidden' : '',
                    }
                }
            ),
            React.createElement(
                'div',
                {
                    style: {
                        transform: 'rotate(' + (360 * this.props.timePct + 90) % 360 + 'deg)',
                        transition: 'transform 0.5s',
                        width: '100%',
                        height: '10%',
                        visibility: firstVisible ? '' : 'hidden',
                        backgroundImage: 'linear-gradient(to left, white, white 50%, black 50%, black)',
                        position: 'absolute',
                        top: '44%',
                        left: '0',
                    }
                }
            )
        );
    }
}
