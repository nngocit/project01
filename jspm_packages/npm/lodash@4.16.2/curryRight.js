/* */ 
var createWrap = require('./_createWrap');
var CURRY_RIGHT_FLAG = 16;
function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
}
curryRight.placeholder = {};
module.exports = curryRight;
