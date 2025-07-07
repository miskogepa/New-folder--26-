/**
 * Async Handler - Higher Order Function
 * Omogućava elegantno rukovanje greškama u asinhronim Express rutama
 * Umesto try/catch u svakoj ruti, automatski hvata greške i prosleđuje ih error handleru
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
