//var styles = require('./main.css');

module.exports = function () {
  var element = document.createElement('h1');

  element.innerHTML = "Hello world 34";
  element.className = 'pure-button';

  return element;
};