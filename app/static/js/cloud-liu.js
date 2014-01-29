function CloudLiu(el) {
  this.el = $(el);
  this.candidates = Array();
  this.keyStrokes = Array();
  this.ui = $('.cloud-liu-outer');
  this.ui.tog_el = $('.cloud-liu-logo');
  this.ui.preedit = $('.cloud-liu-preedit')
  this.ui.candidates = $('.cloud-liu-candidates')

  var liu = this;
  this.el.keydown(function(e) {
    if (e.ctrlKey && e.shiftKey) {
      liu.ui.tog_el.click();
      e.preventDefault();
      return;
    }

    if (window.cliu_enabled) {
      if (e.ctrlKey) {
        return;
      }
      if (liu.handle_Key(e.keyCode)) {
        e.preventDefault();
      }
    }
  });

  this.el.on('focusin', function() {
    liu.updatePreEdit();
    liu.updateCandidates();
  });
}

CloudLiu.prototype.doQuery = function() {
  if (this.keyStrokes.length == 0) {
    this.candidates = [];
    return;
  }

  var key_map = { 188: "55", 190: "56", 219: "45", 221: "46", 222: "27" };
  var query_str = "SELECT phrase FROM phrases WHERE ";

  for (var i in this.keyStrokes) {
    var ch = this.keyStrokes[i];
    var alpha = key_map[ch]? key_map[ch]: ch - 65 + 1;
    query_str += ["m", i, "=", alpha, " AND "].join("");
  }

  query_str = query_str.replace(/ AND $/, "");
  query_str += " ORDER BY mlen,-freq LIMIT 10;";

  this.candidates = db.exec(query_str).map(function(v) { return v[0].value; });
  this.updateCandidates();
}

CloudLiu.prototype.handle_Key = function(key) {
  switch (key) {
  case 8:
    return this.handle_Backspace();
  case 13:
    return this.handle_Enter();
  case 32:
    return this.handle_Space();
  default:
    if (key >= 49 && key <= 57) {
      return this.handle_Number(key);
    }
    if ((key >= 65 && key <= 90) || key == 190 || key == 188
        || key == 222 || key == 219 || key == 221) {
      this.handle_Default(key);
      return true;
    }
  }
  return false;
}

CloudLiu.prototype.handle_Backspace = function () {
  if (this.keyStrokes.length) {
    this.keyStrokes.pop();
    this.doQuery();
    this.updatePreEdit();
    this.updateCandidates();
    return true;
  }
  return false;
}

CloudLiu.prototype.handle_Number = function (key) {
  if (this.keyStrokes.length) {
    var idx = key - 48;
    if (idx < this.candidates.length) {
      this.el.textrange('replace', this.candidates[idx]);
      this.el.textrange('setcursor', this.el.textrange('get').end);
      this.keyStrokes = [];
      this.candidates = [];
      this.updatePreEdit();
      this.updateCandidates();
      return true;
    }
    return true;
  }
  return false;
}

CloudLiu.prototype.handle_Default = function (key) {
  if (this.keyStrokes.length < 5) {
    this.keyStrokes.push(key);
    this.doQuery();
    this.updatePreEdit();
    //console.log(this.keyStrokes);
  }
}

CloudLiu.prototype.handle_Space = function () {
  if (this.candidates.length) {
    this.el.textrange('replace', this.candidates[0]);
    this.el.textrange('setcursor', this.el.textrange('get').end);
    this.keyStrokes = [];
    this.candidates = [];
    this.updatePreEdit();
    this.updateCandidates();
    return true;
  } else {
    return false;
  }
}

CloudLiu.prototype.handle_Enter = function() {
  return this.handle_Space();
}

CloudLiu.prototype.updatePreEdit = function() {
  var char_map = { 188: ",", 190: ".", 219: "[", 221: "]", 222: "'" };
  this.ui.preedit.text(
      this.keyStrokes.map(function(v) {
        return char_map[v]? char_map[v]: String.fromCharCode(v);
      }).join(""));
}

CloudLiu.prototype.updateCandidates = function() {
  this.ui.candidates.empty();
  if (this.candidates.length) {
    var idx = -1;
    this.ui.candidates.append(this.candidates.map(function(v) {
      if (idx++ == -1) {
        return '<div class="cloud-liu-candidate">' + v + '</div>';
      } else {
        return '<div class="cloud-liu-select-num">' + idx + '</div>'
            + '<div class="cloud-liu-candidate">' + v + '</div>';
      }
    }));
  } else {
    //this.ui.candidates.text("等待輸入");
  }
}
