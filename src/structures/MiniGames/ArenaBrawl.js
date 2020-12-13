const divide = require('../../utils/divide');
class ArenaBrawl {
  constructor (data) {
    /**
     * Coins
     * @type {number}
     */
    this.coins = data.coins || 0;
    /**
     * @type {{'1v1':{kills:number,deaths:number,KDRatio:number,wins:number,losses:number,WLRatio:number},'2v2':{kills:number,deaths:number,KDRatio:number,wins:number,losses:number,WLRatio:number},'4v4':{kills:number,deaths:number,KDRatio:number,wins:number,losses:number,WLRatio:number}}}
     */
    this.mode = {
      '1v1': generateModeStats(data, '1v1'),
      '2v2': generateModeStats(data, '2v2'),
      '4v4': generateModeStats(data, '4v4')
    };
  }
}
function generateModeStats (data, mode) {
  return {
    kills: data[`kills_${mode}`],
    deaths: data[`deaths_${mode}`],
    KDRatio: divide(data[`kills_${mode}`], data[`deaths_${mode}`]),
    wins: data[`wins_${mode}`],
    losses: data[`losses_${mode}`],
    WLRatio: divide(data[`wins_${mode}`], data[`losses_${mode}`])
  };
}
module.exports = ArenaBrawl;
