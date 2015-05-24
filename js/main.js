window.onload = function() {
  /* replace svgs */
  replaceSvg();

  /* design panel wrapper */
  panel();
  $('.params_title_back').click(function(){
    slidePanel(false);
  });

  /* sidebar */
  sidebar("#menu_wrapper", "#menu_button", {leftRight: "left"});

  /* render view */
  drawView();
  $(window).on('resize', drawView);

  /* UPLOAD : listen to png image input */
  var pngInput = document.getElementById('loadpng');
  pngInput.addEventListener('change', function(e) {
      document.png_file = e.target.files[0];
      document.png_url = URL.createObjectURL(document.png_file);

      document.getElementById('file_preview').setAttribute("src", document.png_url);

      var img = new Image();
      img.src = document.png_url;
      img.onload = function(){
          var canvas = document.getElementById('pngview');
          var canvas_s = document.getElementById('pathview');
          canvas.setAttribute("width", img.width + "px"); canvas.setAttribute("height", img.height + "px");
          canvas_s.setAttribute("width", img.width + "px"); canvas_s.setAttribute("height", img.height + "px");
          document.ctx = canvas.getContext('2d');
          document.ctx.drawImage(img, 0, 0, img.width,img.height);
      }
      document.getElementById("makepath").disabled = false;
      document.getElementById("filename").innerHTML = document.png_file.name;
      slidePanel();
  }, false);
 
  /* MAKE PATH : listen to makepath button */
  var pathInput = document.getElementById('makepath');
  pathInput.addEventListener('click', function(e) {
      var reader = new FileReader;
      reader.readAsArrayBuffer(document.png_file);
      reader.onload = function() {
          var error = document.getElementsByName("error")[0].value;
          var diameter = document.getElementsByName("diameter")[0].value;
          var offset = document.getElementsByName("offset")[0].value;
          var overlap = document.getElementsByName("overlap")[0].value;
          var intensity = document.getElementsByName("intensity")[0].value;
          var res = png_path(new Uint8Array(reader.result),error,diameter,offset,overlap,intensity);
          document.getElementById("makerml").disabled = false;
      };
      slidePanel();
  }, false);

  /* MAKE RML : calculate rml */
  var rmlInput = document.getElementById('makerml');
  rmlInput.addEventListener('click', function(e) {
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
      slidePanel();
  }, false);

  /* SEND RML : send rml file via ethernet or websocket */
  var rmlSend = document.getElementById('sendrml');
  rmlSend.addEventListener('click', function(e) {
      var rmldata = document.querySelector("#rmloutput").innerHTML
      sendRmlToRpi(rmldata);
  }, false);

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

function drawView() {
  $('#panel_sidebar').height($(window).height() - $('#header').height());
}
