const DEBUG_MODE = 1;
const domContainer = document.querySelector('#gameContainer');
ReactDOM.render(React.createElement(
  MainGameContainer, {
    width: 860,
    height: 400,
    logicController: new GameLogicController(),
    gameData: new GameData(),
  }),
  domContainer
);

/* TODO
 - Add hotkeys for time rate
 - Improve the graphics on level 3
 - Tooltips
 Gameplay
 - More disease events
    - Introduce a new disease at certain weeks / if the player is doing well
- Introduce the player-created disease
 - Let players do research in their home base
   - Increase detectability
   - Increase number of people affected by any given cure attempt
   - Increase number of people that each medic can see to.
 - Let players set the treatment option for each disease.
   - Every day, doctors will treat infected people with the selected treatment.\
   - Advanced treatments require manufacturing
 - Give the players an "immunization" option that will target healthy people.
 - More cures
 - Make diseases kill people based on their stats
*/
