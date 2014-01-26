function CloudLiu(el) {
  this.el = $(el);
  this.active = true;
  this.candidates = Array();
  this.keyStrokes = Array();
  this.ui = $('.cloud-liu-outer');
  this.ui.tog_el = $('.cloud-liu-logo');
  this.ui.preedit = $('.cloud-liu-preedit')
  this.ui.candidates = $('.cloud-liu-candidates')
  this.pxhr = undefined;

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
}

CloudLiu.prototype.doQuery = function() {
  if (this.keyStrokes.length == 0) {
    this.candidates = [];
    return;
  }

  var query_str = "SELECT phrase FROM phrases WHERE ";
  for (var i = 0; i < 5; ++i) {
    var alpha = "";
    switch(this.keyStrokes[i]) {
    case 190:
      alpha = "56";
      break;
    case 188:
      alpha = "55";
      break;
    case 222:
      alpha = "27";
      break;
    case 219:
      alpha = "45";
      break;
    case 221:
      alpha = "46";
      break;
    default:
      alpha = this.keyStrokes[i] - 65 + 1;
    }

    if (i < this.keyStrokes.length - 1) {
      query_str += ["m", i, "=", alpha, " AND "].join("");
    } else {
      query_str += ["m", i, "=", alpha].join('');
      break;
    }
  }
  query_str += " ORDER BY -freq LIMIT 10;";

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
    this.handle_Space();
    return true;
  default:
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

CloudLiu.prototype.handle_Default = function (key) {
  if (this.keyStrokes.length < 5) {
    this.keyStrokes.push(key);
    this.doQuery();
    this.updatePreEdit();
    //console.log(this.keyStrokes);
  }
}

CloudLiu.prototype.handle_Space = function () {
  this.el.textrange('replace', this.candidates[0]);
  this.el.textrange('setcursor', this.el.textrange('get').end);
  this.keyStrokes = [];
  this.candidates = [];
  this.updatePreEdit();
  this.updateCandidates();
}

CloudLiu.prototype.handle_Enter = function() {
  if (this.keyStrokes.length) {
    this.handle_Space();
    return true;
  }
  return false;
}

CloudLiu.prototype.updatePreEdit = function() {
  this.ui.preedit.text(
      this.keyStrokes.map(function(v) {
        return String.fromCharCode(v);
      }).join(""));
}

CloudLiu.prototype.updateCandidates = function() {
  this.ui.candidates.empty();
  this.ui.candidates.append(this.candidates.map(function(v) {
    return '<div class="cloud-liu-candidate">' + v + '</div>';
  }));
}
