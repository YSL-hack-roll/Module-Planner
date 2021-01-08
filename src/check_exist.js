function checkExist(selector, callback) {
  var checkExistTimer = setInterval(function () {
    if ($(selector).length) {
      clearInterval(checkExistTimer);
      $(selector).each(callback);
    }
  }, 20);
}