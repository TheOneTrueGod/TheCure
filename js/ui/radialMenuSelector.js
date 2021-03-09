'use strict';

class RadialMenuSelector extends React.Component {
    // props: visible, menus, menuShowing, onOptionSelect, radius
    constructor(props) {
        super(props);
    }

    isMenuShowing(key) {
        if (!this.props.visible) {
            return false;
        }
        if (this.props.menuShowing === null && key === 'MAIN') {
            return true;
        }
        return key === this.props.menuShowing;
    }

    render() {
        let actionNum = 0;
        let options = [];
        for (let key in this.props.menus) {
            let numActions = this.props.menus[key].length;
            options = options.concat(this.props.menus[key].map(action => {
                actionNum += 1;
                const angle = Math.PI * 2 * ((actionNum - 1) / (numActions));
                let clickHandler = () => {};
                if (this.isMenuShowing(key)) {
                    clickHandler = (e) => { this.props.onOptionSelect(action, e); };
                }

                return React.createElement(
                    RegionOption,
                    {
                        onClick: clickHandler,
                        key: "action_" + actionNum,
                        image: action.getIcon(),
                        targetPos: {angle, dist: this.props.radius + 20},
                        visible: this.isMenuShowing(key),
                        action,
                    },
                );
            }));
        }

        let params = [];
        let paramCount = this.props.menuParams.length;
        for (let i = 0; i < paramCount; i++) {
            const angle = Math.PI * 2 * (i / paramCount);
            params.push(
                React.createElement(RegionOption, {
                    onClick: () => { },
                    key: "selected_action_" + i,
                    image: this.props.menuParams[i].getIcon(),
                    targetPos: {angle, dist: 20 * (paramCount - 1)},
                    visible: true,
                    action: this.props.menuParams[i],
                })
            );
        }

        return React.createElement('div', {}, options, params);
    }
}
