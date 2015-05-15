window.onload = function() {
  /* sidebar */
  sidebar("#menu_wrapper", "#menu_button", "left");

     var canvas = document.getElementById('pngview');
     var canvas_s = document.getElementById('pathview');
 
     var pngInput = document.getElementById('loadpng');
     pngInput.addEventListener('change', function(e) {
         document.png_file = e.target.files[0];
         document.png_url = URL.createObjectURL(document.png_file);
         var img = new Image();
         img.src = document.png_url;
         img.onload = function(){
             canvas.setAttribute("width", img.width + "px"); canvas.setAttribute("height", img.height + "px");
             canvas_s.setAttribute("width", img.width + "px"); canvas_s.setAttribute("height", img.height + "px");
             canvas.style.width = "200px";
             canvas_s.style.width = "200px";
             document.ctx = canvas.getContext('2d');
             document.ctx.drawImage(img, 0, 0, img.width,img.height);
         }
         document.getElementById("makepath").disabled = false;
         document.getElementById("filename").innerHTML = document.png_file.name;
     }, false);
 
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
             //png_path(INPUT_ARRAY,error(px) diameter(mm) offset(-1) overwrap(0-1) intensity(0-1))
             var res = png_path(new Uint8Array(reader.result),error,diameter,offset,overlap,intensity);
             document.getElementById("makerml").disabled = false;
         };
     }, false);

     // var pathInput = document.getElementById('loadpath');
     // pathInput.addEventListener('change', function(e) {
     //   var file = e.target.files[0];
     //   var reader = new FileReader;
     //   reader.readAsArrayBuffer(file);
     //   reader.onload = function() {
     //     //path_rml(INPUT_ARRAY,direction(climb:1, conventional:0),speed(mm/s),jog(mm),xmin(mm),ymin(mm))
     //     var res = path_rml(new Uint8Array(reader.result),4,1,1,20,20);
     //   };
     // }, false);
 
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
     }, false);

     var rmlSend = document.getElementById('sendrml');
     rmlSend.addEventListener('click', function(e) {
         var rmldata = document.querySelector("#rmloutput").innerHTML
         sendRmlToRpi(rmldata);
         // console.log(rmldata)  
         // console.log("this function is not yet implemented.");
         // var file_reader = new FileReader();
         // file_reader.onload = function(e){
         //     var path_uint8_arr = new Uint8Array(file_reader.result);
         //     path_rml(path_uint8_arr,4,1,1,20,20);
         //     document.getElementById("sendrml").disabled = false;
         // };
         // file_reader.readAsArrayBuffer(document.path_blob);
     }, false);

     var sendRmlToRpi = function(rmldata){
       // rmljson  = JSON.stringify('{rml:'+rmldata+'}');
       // rmljson  = JSON.stringify('{rml:hoge}');
       console.log(rmldata);
       var mip = document.getElementById("rml_send_ethernet_ip");
       var mport = document.getElementById("rml_send_ethernet_port");
       var murl = 'http://'+mip+':'+mport;
       $.ajax({
           type: 'POST',
           url: murl,
           // data: rmljson,
           dataType: 'text',
           data: {
                 rml: rmldata
                // rml: JSON.stringify(rmldata)
                // rml: "PU1.0,2.0;H;"
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

function sidebar(menu_wrapper, button, lr, mask_name = "menu-mask") {
  $('body').prepend('<div id="'+mask_name+'" class="hidden-mask"></div>');
  menu = $(menu_wrapper);
  mask = $('#' + mask_name);
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
      menu.css(lr,0);
      menu.attr('menuOpen','open');
      $(mask).removeClass('hidden-mask');
    }
  });
}
