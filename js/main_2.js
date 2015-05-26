window.onload = function() {
  /* replace svgs */
  replaceSvg();

  /* sidebar */
  panel();
  sidebar("#menu_wrapper", "#menu_button", {leftRight: "left"});

  /* render view */
  drawView();
  $(window).on('resize', drawView);

  /* UPLOAD : listen to png image input */
  var pngInput = document.getElementById('loadpng');
  pngInput.addEventListener('change', function(e) {
      document.png_file = e.target.files[0];
      document.png_url = URL.createObjectURL(document.png_file);

      var img = new Image();
      img.src = document.png_url;
      img.onload = function(){
          var canvas = document.getElementById('pngview');
          var canvas_s = document.getElementById('pathview');
          canvas.setAttribute("width", img.width + "px"); canvas.setAttribute("height", img.height + "px");
          canvas_s.setAttribute("width", img.width + "px"); canvas_s.setAttribute("height", img.height + "px");
          document.ctx = canvas.getContext('2d');
          document.ctx.drawImage(img, 0, 0, img.width,img.height);
          resizeCanvas();
      }
      document.getElementById("makepath_high").disabled = false;
      document.getElementById("makepath_medium").disabled = false;
      document.getElementById("makepath_low").disabled = false;
      document.getElementById("filename").innerHTML = document.png_file.name;
      $("#control_panel > div").attr("style", "display:none;");
      $("#control_panel .make_path").removeAttr("style");
  }, false);
 
  /* MAKE PATH : listen to makepath button */
  var pathLowInput = document.getElementById('makepath_low');
  var pathMediumInput = document.getElementById('makepath_medium');
  var pathHighInput = document.getElementById('makepath_high');
  pathLowInput.addEventListener('click', function(e) {
      makePath("LOW", makeRml);
  }, false);
  pathMediumInput.addEventListener('click', function(e) {
      makePath("MEDIUM", makeRml);
  }, false);
  pathHighInput.addEventListener('click', function(e) {
      makePath("HIGH", makeRml);
  }, false);

  function makePath(level, callback) {
      var reader = new FileReader;
      reader.readAsArrayBuffer(document.png_file);
      reader.onload = function() {
          var error = document.getElementById(level+"-make_path_error").value;
          var diameter = document.getElementById(level+"-make_path_error").value;
          var offset = document.getElementById(level+"-make_path_error").value;
          var overlap = document.getElementById(level+"-make_path_error").value;
          var intensity = document.getElementById(level+"-make_path_error").value;
          var res = png_path(new Uint8Array(reader.result),error,diameter,offset,overlap,intensity);
          $("#control_panel > div").attr("style", "display:none;");
          $("#control_panel .file_output").removeAttr("style");
      };
  }

  /* MAKE RML : calculate rml */
  function makeRml(e) {
    var file_reader = new FileReader();
    file_reader.onload = function(e){
        var direction = document.getElementsByName("direction")[0].value;
        var speed = document.getElementsByName("speed")[0].value;
        var jog = document.getElementsByName("jog")[0].value;
        var xmin = document.getElementsByName("xmin")[0].value;
        var ymin = document.getElementsByName("ymin")[0].value;

        var path_uint8_arr = new Uint8Array(file_reader.result);
        path_rml(path_uint8_arr,speed,direction,jog,xmin,ymin);
        document.getElementById("sendrml").disabled = false;
        document.getElementById("sendrml-ws").disabled = false;
    };
    file_reader.readAsArrayBuffer(document.path_blob);
  }

  /* SEND RML : send rml file via ethernet or websocket */
  /*
  var rmlSend = document.getElementById('sendrml');
  rmlSend.addEventListener('click', function(e) {
      var rmldata = document.querySelector("#rmloutput").innerHTML
      sendRmlToRpi(rmldata);
  }, false);
  */

  var sendRmlToRpi = function(rmldata){
    console.log(rmldata);
    var mip = document.getElementById("rml_send_ethernet_ip");
    var mport = document.getElementById("rml_send_ethernet_port");
    var murl = 'http://'+mip+':'+mport;
    $.ajax({
        type: 'POST',
        url: murl,
        dataType: 'text',
        data: {
              rml: rmldata
        },
        success: function(){
          console.log("success");
        }
    });
  };

     /* Need to implement ws connection after server ip param change */
     var ws_relay = new WebSocket("ws://133.242.160.150:9090/ws");
     var ws_indicator = document.getElementById("ws-indicator");
     var sendrml_ws = document.getElementById("sendrml-ws");
     /*
     sendrml_ws.addEventListener('click',function(e){
       console.log("send rml");
       var rmldata = document.querySelector("#rmloutput").innerHTML
       // ws_relay.send("rml text here");
       ws_relay.send(rmldata);
     });
     ws_relay.onopen = function() {
         console.log("websocket opened");
     };
     ws_relay.onmessage = function (evt) {
        console.log("data received: "+evt.data);
     };
     ws_relay.onclose = function(){
       ws_indicator.innerHTML = "Relay server is down. Check and reload.";
       console.log("websocket closed");
     }
     if(ws_relay){
        ws_indicator.innerHTML = "Relay server is working";
     }
     */

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
  $("#panel_wrapper").width($("#panel_wrapper .panel").length * $(".panel").width());
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
  content_height = $(window).height() - $('#header').height();
  $('#panel_sidebar').height(content_height);
  $('#canvas_wrapper').height(content_height);
  if (typeof $('#canvas_wrapper canvas:first-child').attr("width") !== 'undefined') {
    resizeCanvas();
  }
}

function resizeCanvas() {
  var offset = 30;

  content_height = $('#canvas_wrapper').height();
  content_width = $('#canvas_wrapper').width();
  img_aspect = $('#canvas_wrapper canvas:first-child').width() / $('#canvas_wrapper canvas:first-child').height();
  img_width = 0; img_height = 0;
  if (content_height * img_aspect >= content_width) {
    img_width = content_width - offset * 2;
    img_height = img_width / img_aspect;
  } else {
    img_height = content_height - offset * 2;
    img_width = img_height * img_aspect;
  }
  $('#canvas_wrapper canvas').css({
    "width": img_width,
    "height": img_height,
    "margin-left": -img_width/2,
    "margin-top": -img_height/2
  });
}
