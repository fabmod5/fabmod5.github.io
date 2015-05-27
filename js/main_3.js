window.onload = function() {
  /* replace svgs */
  replaceSvg();

  /* sidebar */
  panel();
  sidebar("#menu_wrapper", "#menu_button", {leftRight: "left"});

  /* render view */
  drawView();
  $(window).on('resize', drawView);
};

function sidebar(menu_wrapper, button, args) {
  if (typeof args["mask_name"] == 'undefined') {
    args["mask_name"] = "menu-mask";
  }
  if (typeof args["leftRight"] == 'undefined') {
    args["leftRight"] = "left";
  }
  
  $('body').prepend('<div id="'+args["mask_name"]+'" class="hidden-mask"></div>');
  menu = $(menu_wrapper);
  mask = $('#' + args["mask_name"]);
  menu.attr('menuOpen','closed');
  $(mask).click(function() {
    menu.removeAttr('style');
    menu.attr('menuOpen','closed');
    $(this).addClass('hidden-mask');
  });
  $(button).click(function() {
    if (menu.attr('menuOpen') == 'open'){
      menu.removeAttr('style');
      menu.attr('menuOpen','closed');
      $(mask).addClass('hidden-mask');
    } else {
      menu.css(args["leftRight"],0);
      menu.attr('menuOpen','open');
      $(mask).removeClass('hidden-mask');
    }
  });
}

function panel() {
  panel = $('#machine_panels');
  $(panel).click(function() {
    $('.machine_panel').removeAttr('style');
    $(this).addClass('hidden_panel');
  });
  $('.machine_area').click(function() {
    name = $(this).attr("panelName");
    $('#' + name).css("display", "block");
    $(panel).removeClass('hidden_panel');
  });
}

function slidePanel(forward) {
  if(typeof forward === 'undefined') {
    forward = true;
  }
  panel_width = 0 - $('.panel').width();
  panel_pos = $('#panel_wrapper').position().left / panel_width;
  console.log(panel_width);
  console.log(panel_pos);
  if (forward) {
    if ($("#panel_wrapper .panel").length != panel_pos + 1) {
      panel_pos++;
    }
  } else {
    if (panel_pos != 0) {
      panel_pos--;
    }
  } 
  $('#panel_wrapper').css("left", panel_pos * panel_width);
}

function replaceSvg() {
  jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var img_id = $img.attr('id');
    var img_class = $img.attr('class');
    var img_url = $img.attr('src');

    jQuery.get(img_url, function(data) {
      var $svg = jQuery(data).find('svg');
      if(typeof img_id !== 'undefined') {
        $svg = $svg.attr('id', img_id);
      }
      if(typeof img_class !== 'undefined') {
        $svg = $svg.attr('class', img_class+' replaced-svg');
      }
      $svg = $svg.removeAttr('xmlns:a');
      $img.replaceWith($svg);
    }, 'xml');
  });
}

function drawView() {
  var offset = 20;

  content_height = $(window).height() - $('#header').height();
  $('#viewer').height(content_height);
  content_width = $('#viewer').width();
  img_aspect = $('#viewer .lab_image:first-child').width() / $('#viewer .lab_image:first-child').height();
  img_width = 0; img_height = 0;
  if (content_height * img_aspect >= content_width) {
    img_width = content_width - offset * 2;
    img_height = img_width / img_aspect;
  } else {
    img_height = content_height - offset * 2;
    img_width = img_height * img_aspect;
  }
  $('#viewer #lab_wrapper').css({
    "width": img_width,
    "height": img_height,
    "margin-left": ($(window).width()-img_width)/2,
    "margin-top": ($(window).height()-$('#header').height()-img_height)/2
  });
}
