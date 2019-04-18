/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player State Class for server update information
**/

module.exports = class PlayerState {
  constructor() {
    this.id = 0;
    this.position = {
      x: 0,
      y: 0
    };
  }
};
