'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _sister = require('sister');

var _sister2 = _interopRequireDefault(_sister);

var _loadYouTubeIframeAPI = require('./loadYouTubeIframeAPI');

var _loadYouTubeIframeAPI2 = _interopRequireDefault(_loadYouTubeIframeAPI);

var _YouTubePlayer = require('./YouTubePlayer');

var _YouTubePlayer2 = _interopRequireDefault(_YouTubePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef options
 * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
 * @param {Number} width
 * @param {Number} height
 * @param {String} videoId
 * @param {Object} playerVars
 * @param {Object} events
 */
var youtubeIframeAPI = void 0;

/**
 * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
 *
 * @param {HTMLElement|String} elementId Either the DOM element or the id of the HTML element where the API will insert an <iframe>.
 * @param {YouTubePlayer~options} options
 * @returns {Object}
 */

exports.default = function (elementId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var playerAPI = void 0;

  if (!youtubeIframeAPI) {
    youtubeIframeAPI = (0, _loadYouTubeIframeAPI2.default)();
  }

  playerAPI = {};

  var emitter = (0, _sister2.default)();

  if (options.events) {
    throw new Error('Event handlers cannot be overwritten.');
  }

  if ((0, _lodash2.default)(elementId) && !document.getElementById(elementId)) {
    throw new Error('Element "' + elementId + '" does not exist.');
  }

  options.events = _YouTubePlayer2.default.proxyEvents(emitter);

  var playerAPIReady = new Promise(function (resolve) {
    // eslint-disable-next-line promise/catch-or-return
    youtubeIframeAPI.then(function (YT) {
      return new YT.Player(elementId, options);
    })

    // eslint-disable-next-line promise/always-return
    .then(function (player) {
      emitter.on('ready', function () {
        resolve(player);
      });
    });
  });

  playerAPI = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady);
  playerAPI.on = emitter.on;
  playerAPI.off = emitter.off;

  return playerAPI;
};

module.exports = exports['default'];