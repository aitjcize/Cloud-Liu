function createUI() {
  $('body').append($('<div class="cloud-liu-outer"><div class="cloud-liu-preedit"></div><div class="cloud-liu-candidates"></div></div>'));
}

function LoadDB() {
  window.db == undefined;
  var $disp = $('.cloud-liu-candidates');
  $disp.text("載入中 ...");
  var raw = atob(db_data.value);
  var array = new Int8Array(raw.length);
  for (var i = 0; i < raw.length; ++i) {
    array[i] = raw.charCodeAt(i);
  }
  window.db = SQL.open(array);
  $disp.text("等待輸入");
}

createUI();
LoadDB();

