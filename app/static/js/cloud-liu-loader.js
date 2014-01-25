requirejs.config({
    baseUrl: 'static/js'
});
require([
    'jquery-1.10.2.min',
    'jquery-ui-1.10.4.custom.min',
    'jquery-textrange.min',
    'sql.min',
    'boshiamy.db'
    ], function() {
  require([
    'cloud-liu-init',
    'cloud-liu'
    ], function() {
    $('textarea').each(function(idx, el) {
      new CloudLiu(el);
    });

    $('input[type="text"]').each(function(idx, el) {
      new CloudLiu(el);
    });
  });
});
