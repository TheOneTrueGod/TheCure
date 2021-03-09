'use strict';

class WorldRegionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.gameRegion = this.props.gameRegion;
    this.state = {optionsShowing: false, menuParams: [], subMenus: {}, menuShowing: null};
    this.menus = { MAIN: 'MAIN', DISEASES: 'DISEASES', CURES: 'CURES' };
  }

  componentWillReceiveProps(props) {
      if (this.props.selected && !props.selected) {
          this.setState({menuShowing: null, menuParams: []});
      }
  }

  isMenuShowing(key) {
      if (this.state.menuShowing === null && key === this.menus.MAIN) {
          return true;
      }
      return key === this.state.menuShowing;
  }

  componentDidMount() {
      this.state.subMenus[this.menus.MAIN] = this.getMenuItems();
      this.state.subMenus[this.menus.CURES] = this.getCureItems();
      this.state.subMenus[this.menus.DISEASES] = this.getDiseaseItems();
  }

  onOptionSelect(action, event) {
      if (!this.props.selected) {
          return true;
      }
      let mainAction = null;
      this.state.menuParams.push(action);

      if (this.state.menuParams.length > 0) {
          mainAction = this.state.menuParams[0];
      } else {
          mainAction = action;
      }
      let actionOptions = mainAction.getOptions();

      if (this.state.menuParams.length - 1 < actionOptions.length) {
          switch (actionOptions[this.state.menuParams.length - 1]) {
              case RegionAction.OPTIONS.CURE:
                  this.setState({ menuShowing: this.menus.CURES });
                  break;
              case RegionAction.OPTIONS.DISEASE:
                  this.setState({ menuShowing: this.menus.DISEASES });
                  break;
              default:
                throw new Error("Region Action Option Type not handled.");
          }
          return false;
      }

      this.props.selectSection && this.props.selectSection(null);
      event.stopPropagation();
      this.gameRegion.doAction(mainAction, this.state.menuParams.slice(1).map((regionActionOption) => {
          return regionActionOption.params.actionOption;
      }));
      this.setState({ menuParams: [], menuShowing: null });
      return false;
  }

  getCureItems() {
      let options = [];
      for (let i = 0; i < this.props.diseaseList.curesResearched.length; i++) {
        options.push(new RegionActionOption(
            this.props.diseaseList.curesResearched[i],
            {
                icon: RegionOption.IMAGES.PLACEHOLDER,
                isEnabled: () => true,
            }
        ));
      }

      for (let i = 0; i < this.props.diseaseList.curesNotResearched.length; i++) {
        options.push(new RegionActionOption(
            this.props.diseaseList.curesNotResearched[i],
            {
                icon: RegionOption.IMAGES.PLACEHOLDER,
                isEnabled: () => false,
            }
        ));
      }
      return options;
  }

  getDiseaseItems() {
      let options = [];
      for (let i = 0; i < this.props.diseaseList.diseases.length; i++) {
        options.push(new RegionActionOption(
            this.props.diseaseList.diseases[i],
            {
                icon: RegionOption.IMAGES.PLACEHOLDER,
                isEnabled: () => true,
            }
        ));
      }

      return options;
  }

  getMenuItems() {
      return this.gameRegion.getActions();
  }

  render() {
    let progressBars = [];
    for (let i = 0, len = this.gameRegion.actionsWatched.length; i < len; i ++) {
        progressBars.push(
            React.createElement(
                ProgressBar,
                {
                    key: i,
                    start: this.gameRegion.actionsWatched[i].startTime,
                    end: this.gameRegion.actionsWatched[i].startTime + this.gameRegion.actionsWatched[i].getDuration(),
                    curr: this.props.currTime, width: "100%",
                },
                null
            )
        );
    }

    let infectionDebugger = [];
    for (let key in this.gameRegion.diseasesInRegion) {
        infectionDebugger.push(
            React.createElement(
                ProgressBar,
                {
                    start: 0,
                    end: this.gameRegion.population,
                    curr: this.gameRegion.diseasesInRegion[key].numInfected,
                    color: 'red',
                    key,
                },
                null
            )
        );
    }

    return React.createElement(
      'div',
      {
        onClick: (e) => {
          this.props.selectSection && this.props.selectSection(this.props.regionId);
        },
        style: {
          position: "absolute",
          color: "white",
          left: this.gameRegion.position.x - this.gameRegion.radius / 2,
          top: this.gameRegion.position.y - this.gameRegion.radius / 2,
          width: this.gameRegion.radius,
          height: this.gameRegion.radius,
          background: "black",
          border: "1px solid green",
        }
      },
      React.createElement(
          'div',
          { className: 'leftRight' },
          React.createElement('div', {}, 'Pop: ' + this.gameRegion.population),
          React.createElement('div', {}, 'Medics: ' + this.gameRegion.playerUnits),
      ),
      React.createElement(
          'div',
          { className: 'leftRight' },
          infectionDebugger,
          progressBars || null,
      ),
      React.createElement(
          RadialMenuSelector,
          {
              visible: this.props.selected,
              menus: this.state.subMenus,
              menuShowing: this.state.menuShowing,
              menuParams: this.state.menuParams,
              onOptionSelect: this.onOptionSelect.bind(this),
              radius: this.gameRegion.radius / 2
          }
      )
    );
  }
}
