'use strict';

const TICK_SPEED = {
    PAUSE: 'PAUSE',
    ONE: 'ONE',
    TWO: 'TWO',
    FOUR: 'FOUR',
    EIGHT: 'EIGHT',
    LUDACROUS: 'LUDACROUS',
}

class MainGameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      selectedRegion: null,
      tickSpeed: TICK_SPEED.ONE,
      previousTickSpeed: TICK_SPEED.ONE,
    };
  }

  componentDidMount() {
    let timer = setInterval(this.tick.bind(this), 20);
    this.setState({timer});
  }

  componentWillUnmount() {
    if (this.state.timer) {
      this.clearInterval(this.state.timer);
      this.state.timer = null;
    }
  }

  tick() {
    this.props.logicController.tick(this.props.gameData, this.state.tickSpeed);
    this.forceUpdate();
  }

  setTickSpeed(speed) {
      let previousTickSpeed = speed === TICK_SPEED.PAUSE ? this.state.previousTickSpeed :  this.state.tickSpeed;
      this.setState({tickSpeed: speed, previousTickSpeed});
  }

  render() {
    let regions = [];
    for (let key in this.props.gameData.regions) {
      regions.push(
        React.createElement(
          WorldRegionComponent,
          {
            selectSection: (selectedRegion) => {
                this.setState({selectedRegion});
            },
            selected: this.state.selectedRegion === key,
            gameRegion: this.props.gameData.regions[key],
            diseaseList: this.props.gameData.diseaseList,
            currTime: this.props.gameData.currTime,
            regionId: key,
            key: key,
          }
        )
      );
    }

    let timePct = (this.props.gameData.currTime % TICKS_PER_DAY + 1) / TICKS_PER_DAY;
    let day = (Math.floor(this.props.gameData.currTime / TICKS_PER_DAY)) % DAYS_PER_WEEK + 1
    let week = Math.floor(this.props.gameData.currTime / TICKS_PER_DAY / DAYS_PER_WEEK) + 1;
    return (
        React.createElement(
            'div',
            {},
            React.createElement('div', {
                style: {
                    width: this.props.width,
                }
            },
                React.createElement('div', {className: 'topBar'},
                    React.createElement(TimeClockComponent, {timePct, width: '30px', height: '30px', style: {float: 'left'}}),
                    React.createElement('div', {style: {float: 'left', marginTop: '8px', marginLeft: '8px'}}, `Day: ${day}, Week: ${week}`),
                    React.createElement('div', {className: 'speedControls'},
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.PAUSE ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.PAUSE); },
                        }, 'Pause'),
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.ONE ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.ONE); },
                        }, '1x'),
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.TWO ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.TWO); },
                        }, '2x'),
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.FOUR ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.FOUR); },
                        }, '4x'),
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.EIGHT ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.EIGHT); },
                        }, '8x'),
                        React.createElement('div', {
                            className: 'speedControlButton' + (this.state.tickSpeed === TICK_SPEED.LUDACROUS ? ' selected' : ''),
                            onClick: () => { this.setTickSpeed(TICK_SPEED.LUDACROUS); },
                        }, 'debug'),
                    ),
                ),
                React.createElement(
                    'div',
                    {
                        onClick: () => this.setState({ liked: true }),
                        className: "worldContainer",
                        style: {
                            width: '600px',
                            height: this.props.height,
                            background: "red",
                            display: 'inline-block',
                        }
                    },
                    regions,
                ),
                React.createElement(GameplayLogComponent, {
                    className: 'logContainer',
                    gameLog: this.props.gameData.gameLog,
                    style: {
                        width: 'calc(100% - 600px)',
                        height: this.props.height,
                        display: 'inline-block',
                    }
                }),
            ),
            React.createElement(
                'div',
                {style: {position: 'relative'}},
                React.createElement(
                    DiseaseRegistryComponent,
                    {className: 'leftRight', diseaseList: this.props.gameData.diseaseList}
                ),
            ),
        )
    );
  }
}
