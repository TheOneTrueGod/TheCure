'use strict';

class GameplayLogComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const MAX_ENTRIES = 50;
        let gameLog = this.props.gameLog;
        let entries = [];
        let startEntry = Math.max(0, gameLog.log.length - MAX_ENTRIES);
        let endEntry = gameLog.log.length;
        for (let i = endEntry - 1; i >= startEntry; i--) {
            entries.push(React.createElement("div", {key: "log_" + i, className: 'logEntry'}, gameLog.log[i].text));
        }
        return React.createElement(
            'div',
            {
                style: {
                    border: '2px solid black',
                    height: '200px',
                    boxSizing: 'border-box',
                    ...this.props.style
                },
                className: this.props.className,
            },
            entries
        )
    }
}
