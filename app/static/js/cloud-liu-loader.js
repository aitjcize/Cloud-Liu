var host = '__HOST__';

function CloudLiu_UI_init() {
  window.cliu_enabled = true;

  var ui = $('<div class="cloud-liu-outer"><div class="cloud-liu-logo">嘸</div><div class="cloud-liu-preedit"></div><div class="cloud-liu-candidates">載入中 ...</div></div>');
  ui.draggable();
  $('body').append(ui);

  var tog_el = $('.cloud-liu-logo');
  tog_el.click(function() {
    if (window.cliu_enabled) {
      tog_el.text('Ａ');
      window.cliu_enabled = false;
    } else {
      tog_el.text('嘸');
      window.cliu_enabled = true;
    }
  });
}

function CloudLiu_Core_init() {
  var $disp = $('.cloud-liu-candidates');
  var raw = atob(db_data.value);
  var array = new Int8Array(raw.length);
  for (var i = 0; i < raw.length; ++i) {
    array[i] = raw.charCodeAt(i);
  }
  window.db = SQL.open(array);

  // Strange hack to kick-start Chrome V8's JIT
  db.exec("SELECT phrase FROM phrases WHERE m0=9 ORDER BY -freq LIMIT 1;");

  array = undefined;
  $disp.text("等待輸入");
}

function CloudLiu_Core_register() {
  $('textarea').each(function(idx, el) {
    if (typeof el.attributes.cliu == "undefined") {
      el.setAttribute('cliu', true);
      new CloudLiu(el);
    }
  });

  $('input[type="text"]').each(function(idx, el) {
    if (typeof el.attributes.cliu == "undefined") {
      el.setAttribute('cliu', true);
      new CloudLiu(el);
    }
  });

  $('input[type="search"]').each(function(idx, el) {
    if (typeof el.attributes.cliu == "undefined") {
      el.setAttribute('cliu', true);
      new CloudLiu(el);
    }
  });
}

requirejs.config({
  baseUrl: host + '/static/js',
  waitSeconds: 120
});

require(['jquery-1.10.2.min'], function() {
  if (typeof window.cliu_enabled != "undefined") {
    console.log('Cloud Liu: Areadly loaded, abort.');
    return;
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','cga');
  cga('create', 'UA-47158795-2', document.domain);
  cga('send', 'pageview', '/active');
  cga('send', 'event', 'launch', document.URL);

  console.log('Cloud Liu: loading library ...');
  require([
    'jquery-textrange.min',
    'jquery-ui-1.10.4.custom.min'
  ], function() {
    CloudLiu_UI_init();
  });

  console.log('Cloud Liu: loading database ...');
  require([
    'sql.min',
    'boshiamy.db'
    ], function() {
    require(['cloud-liu.min'], function() {
      CloudLiu_Core_init();
      console.log('Cloud Liu: loaded');

      var watching = {};
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      var observer = new MutationObserver(function(mutations, observer) {
        CloudLiu_Core_register();
      });

      observer.observe(document, {
        subtree: true,
        attributes: true
      });

      CloudLiu_Core_register();
    });
  });
});
