$(document).ready(function() {
  $('.nav > li > a').click(function() {
    var $el = $(this);
    var $target = $($el.attr('href')).parent();

    $target.addClass("block-" + $el.data("ani") + "-do-blink");
    console.log('here')
    setTimeout(function() {
      $target.removeClass("block-" + $el.data("ani") + "-do-blink");
    }, 2500);
  });
});
