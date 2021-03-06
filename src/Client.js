/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const validate = new (require('./Private/validate'))();
const rateLimit = new (require('./Private/rateLimit'))();
const requests = new (require('./Private/requests'))();
const API = require('./API/index');
/**
 * Client class
 */
class Client {
  /**
   * @param {string} key API key [(?)](https://stavzdev.is-inside.me/cCMiZdoy.gif)
   * @param {ClientOptions} options Client options
   */
  constructor (key, options = {}) {
    this.key = validate.validateKey(key);
    this.options = validate.parseOptions(options);
    validate.validateOptions(this.options);
    // eslint-disable-next-line no-return-assign
    Object.keys(API).forEach((func) => Client.prototype[func] = function () {
      // eslint-disable-next-line prefer-rest-params
      return API[func].apply({ _makeRequest: this._makeRequest.bind(this, { ...(validate.cacheSuboptions(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : {}) }), ...this }, arguments);
    });
    rateLimit.init(this.getKeyInfo(), this.options.rateLimit);
    /**
     * All cache entries
     * @type {Map<string,object>}
     */
    this.cache = requests.cache;
  }

  async _makeRequest (options, url, useRateLimitManager = true) {
    if (!url) return;
    if (url !== '/key' && !options.noCacheCheck && requests.cache.has(url)) return requests.cache.get(url);
    if (useRateLimitManager) await rateLimit.rateLimitManager(this.options);
    return requests.request.call(this, url, options);
  }

  /**
   * Allows you to get statistics of player
   * @method
   * @name Client#getPlayer
   * @param {string} query Player nickname or UUID
   * @param {PlayerMethodOptions} [options={}] Method options
   * @return {Promise<Player>}
   * @example
   * // { guild: true } - fetch player's guild
   * hypixel.getPlayer('StavZDev', { guild: true }).then(player => {
   *   console.log(player.level); // 141
   *   console.log(player.rank); // 'MVP+'
   *   console.log(player.guild); // null (player is not in guild)
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get statistics of hypixel guild
   * @method
   * @name Client#getGuild
   * @param {id|name|player} searchParameter Search for guild by id, name or player (if player is in guild)
   * @param {string} query Guild ID, Guild name or player uuid/nickname
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<Guild>}
   * @example
   * hypixel.getGuild('name', 'The Foundation').then(guild => {
   *   console.log(guild.level); // 111
   *   console.log(guild.id); // '52e5719284ae51ed0c716c69'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you get player's list of friends
   * @method
   * @name Client#getFriends
   * @param {string} query Player nickname or UUID
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<Array<Friend>>}
   * @example
   * hypixel.getFriends('StavZDev').then(friends => {
   *   console.log(friends[0].friendSinceTimestamp); // 1528363745834
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get statistics of watchdog, the server anticheat
   * @method
   * @name Client#getWatchdogStats
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<WatchdogStats>}
   * @example
   * hypixel.getWatchdogStats().then(watchdog => {
   *   console.log(watchdog.byWatchdogTotal); // 5931897
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get all active boosters
   * @method
   * @name Client#getBoosters
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<Array<Booster>>}
   * @example
   * hypixel.getBoosters().then(boosters => {
   *   console.log(boosters[0].purchaser); // '978ddb705a8e43618e41749178c020b0'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get all skyblock profiles of player
   * @method
   * @name Client#getSkyblockProfiles
   * @param {string} query Player nickname or UUID
   * @param {SkyblockMethodOptions} [options={}] Method options
   * @return {Promise<Array<SkyblockProfile>>}
   * @example
   * hypixel.getSkyblockProfiles('StavZDev').then(profiles => {
   *   console.log(profiles[0].members[0].uuid); // '52d9a36f66ce4cdf9a56ad9724ae9fb4'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get a player's skyblock member data from all their profiles
   * @method
   * @name Client#getSkyblockMember
   * @param {string} query Player nickname or UUID
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<Map<string,SkyblockMember>>}
   * @example
   * hypixel.getSkyblockMember('StavZDev').then(member => {
   *   // 'Cucumber' - profile name
   *   console.log(member.get('Cucumber').uuid); // '52d9a36f66ce4cdf9a56ad9724ae9fb4'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Allows you to get the Hypixel API's Status and past Incidents, no key needed.
   * @method
   * @name Client#getAPIStatus
   * @return {Promise<APIStatus>}
   * @example
   * hypixel.getAPIStatus().then(status => {
   *   console.log(status.incidents[0].link); // 'https://status.hypixel.net/incidents/zdd5gppdtcc3'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Gets Key information
   * @method
   * @name Client#getKeyInfo
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<KeyInfo>}
   * @example
   * hypixel.getKeyInfo().then(keyInfo => {
   *   console.log(keyInfo.owner); // '52d9a36f66ce4cdf9a56ad9724ae9fb4'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Gets all leaderboards
   * @method
   * @name Client#getLeaderboards
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<{ ARENA: Leaderboard[], COPS_AND_CRIMS: Leaderboard[], WARLORDS: Leaderboard[], BLITZ_SURVIVAL_GAMES: Leaderboard[], UHC: Leaderboard[], WALLS: Leaderboard[], PROTOTYPE: Leaderboard[], PAINTBALL: Leaderboard[], SKYWARS: Leaderboard[], MURDER_MYSTERY: Leaderboard[], SMASH_HEROES: Leaderboard[], DUELS: Leaderboard[], SPEED_UHC: Leaderboard[], TNTGAMES: Leaderboard[], BEDWARS: Leaderboard[], TURBO_KART_RACERS: Leaderboard[], BUILD_BATTLE: Leaderboard[], ARCADE: Leaderboard[], SKYCLASH: Leaderboard[], QUAKECRAFT: Leaderboard[], CRAZY_WALLS: Leaderboard[], MEGA_WALLS: Leaderboard[], VAMPIREZ: Leaderboard[] }>}
   * @example
   * hypixel.getLeaderboards().then(leaderboards => {
   *   console.log(leaderboards.ARENA[0].name); // 'Wins'
   * }).catch(e => {
   *   console.log(e);
   * })
   */
  /**
   * Pings the minecraft server of hypixel (by default)
   * @method
   * @name Client#getPing
   * @param {string} [ip=mc.hypixel.net] Valid IP/Hostname address
   * @return {Promise<number>}
   * @example
   * hypixel.getPing().then(console.log).catch(console.log); // 100
   */
  /**
   * Allows you to get current player count
   * @method
   * @name Client#getOnline
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<number>}
   * @example
   * hypixel.getOnline().then(console.log).catch(console.log); // 121730
   */
  /**
   * Allows you to get recent games of a player
   * @method
   * @name Client#getRecentGames
   * @param {string} query Player nickname or UUID
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<RecentGame[]>}
   * @example
   * hypixel.getRecentGames().then(recentGames =>{
   *   console.log(recentGames[0].endedTimestamp); // 1609670588789
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get the status of a player
   * @method
   * @name Client#getStatus
   * @param {string} query Player nickname or UUID
   * @param {MethodOptions} [options={}] Method options
   * @return {Promise<Status>}
   * @example
   * hypixel.getStatus('Stavzdev').then(status =>{
   *   console.log(status.online); // true
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get skyblock auctions
   * @method
   * @name Client#getSkyblockAuctions
   * @param {string|number|number[]} page - "*", a page number, or an array with the start and the end page number ( automatically sorted )
   * @param {auctionsOptions} [options={}] Options
   * @return {Promise<{info:AuctionInfo,auctions:Auction[]}>}
   * @example
   * hypixel.getSkyblockAuctions(0).then(auctions =>{
   *   console.log(auctions[0].item); // Mythic Farmer Boots
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get player's skyblock auctions
   * @method
   * @name Client#getSkyblockAuctionsByPlayer
   * @param {string} query - player nickname or uuid
   * @param {boolean} [includeItemBytes=false] - include item bytes (optional)
   * @param {MethodOptions} [options={}] Options
   * @return {Promise<Auction[]>}
   * @example
   * hypixel.getSkyblockAuctionsByPlayer('hypixel').then(auctions =>{
   *   console.log(auctions[0].auctionId); // b0491da3e81c43c88fd287ea3b3eacc0
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get all ended auctions in around the last 60 seconds
   * @method
   * @name Client#getEndedSkyblockAuctions
   * @param {boolean} [includeItemBytes=false] - include item bytes (optional)
   * @param {MethodOptions} [options={}] Options
   * @return {Promise<{info:AuctionInfo,auctions:PartialAuction[]}>}
   * @example
   * hypixel.getEndedSkyblockAuctions().then(ended =>{
   *   console.log(ended.auctions[0].auctionId); // 0fe7fd132367474e86ff3022b4a84a13
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get list of products
   * @method
   * @name Client#getSkyblockBazaar
   * @param {MethodOptions} [options={}] Options
   * @return {Promise<Product[]>}
   * @example
   * hypixel.getSkyblockBazaar().then(products =>{
   *   console.log(products[0].productId); // INK_SACK:3
   * })
   * .catch(console.log);
   */
  /**
   * Allows you to get skyblock news
   * @method
   * @name Client#getSkyblockNews
   * @param {MethodOptions} [options={}] Options
   * @return {Promise<SkyblockNews[]>}
   * @example
   * hypixel.getSkyblockNews().then((news) => {
   *   console.log(news[0].link); // https://hypixel.net/threads/3749492/
   * })
   * .catch(console.log)
   */
  /**
   * Allows you to get player count along with the player count of each public game
   * @method
   * @name Client#getGameCounts
   * @param {MethodOptions} [options={}] Options
   * @return {Promise<GameCounts>}
   * @example
   * hypixel.getGameCounts().then((gameCounts) => {
   *   console.log(gameCounts.mainLobby.players);
   * })
   * .catch(console.log)
   */
  /**
   * Delete x (by default all) cache entries
   * @param {?number} amount Amount of cache to delete
   * @return {Promise<void|boolean[]>}
   */
  sweepCache (amount) {
    return requests.sweepCache(amount);
  }
}
/**
 * @typedef {object} ClientOptions
 * @prop {boolean} [cache=false] Enable/Disable request caching.
 * @prop {number} [cacheTime=60] Amount of time in seconds to cache the requests.
 * @prop {AUTO|HARD|NONE} [rateLimit='AUTO'] Rate limit mode.
 * @prop {number} [cacheSize=-1] The amount how many results will be cached. (`-1` for infinity)
 */
/**
 * @typedef {object} MethodOptions
 * @property {boolean} [noCacheCheck=false] Disable/Enable cache checking
 * @property {boolean} [noCaching=false] Disable/Enable writing to cache
 */
/**
 * @typedef {object} PlayerMethodOptions
 * @property {boolean} [noCacheCheck=false] Disable/Enable cache checking
 * @property {boolean} [noCaching=false] Disable/Enable writing to cache
 * @property {boolean} [guild=false] Disable/Enable request for player's guild
 */
/**
 * @typedef {object} SkyblockMethodOptions
 * @property {?boolean} [noCacheCheck=false] Disable/Enable cache checking
 * @property {?boolean} [noCaching=false] Disable/Enable writing to cache
 * @property {?boolean} [fetchPlayer=false] Disable/Enable player profile request for each member
 */
/**
 * @typedef {object} auctionsOptions
 * @property {boolean} [noCacheCheck=false] Disable/Enable cache checking
 * @property {boolean} [noCaching=false] Disable/Enable writing to cache
 * @property {boolean} [noInfo=false] If true, result doesn't show Auction Info
 * @property {boolean} [noAuctions=false] If true, result doesn't show auctions
 * @property {boolean} [raw=false] If true, result will not contain parsed auctions, but will present them as it is received. This can speed up performance in some cases.
 * @property {number} [retries=3] Number of times to retry fetching a page before abandoning
 * @property {number} [cooldown=100] Cooldown between each fetch, only works if race is unset or false;
 * @property {boolean} [race=false] Issues simultaneous requests to the API, instead of requesting then parsing one by one. Can largely increase speed at the cost of hogging bandwidth and memory
 * @property {boolean} [includeItemBytes=false] Whether to include item bytes in the result
 */
module.exports = Client;
