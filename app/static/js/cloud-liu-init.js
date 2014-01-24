function createUI() {
  $('body').append($('<div class="cloud-liu-outer"><div class="cloud-liu-preedit"></div><div class="cloud-liu-candidates"></div></div>'));
}

function LoadDB() {
  window.db == undefined;
  var $disp = $('.cloud-liu-candidates');
  $disp.text("載入中 ...");
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/static/boshiamy.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    window.db = SQL.open(new Int8Array(this.response));
    $disp.text("");
  }
  xhr.send();
}

createUI();
LoadDB();

