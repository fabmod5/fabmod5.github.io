
var drawPath = function(path){
    var canvas = document.getElementById('pathview');
    var ctx = canvas.getContext( "2d" );
    var px,py,cx,cy = 0;
    function drawLine(cx,cy,px,py){
           ctx.beginPath();
           ctx.moveTo( px, py);
           ctx.lineTo( cx, cy);
           ctx.closePath();
           ctx.stroke();
    }
    var arr = path.split('\n');
    for (var i = 0; i < arr.length; i++) { 
      if(arr[i].match(/^\d/)!=null) {
        var coords = arr[i];
        cx = coords.split(' ')[0]/3.5;
        cy = coords.split(' ')[1]/3.5;
        drawLine(cx,cy,px,py)
        px = cx;
        py = cy;
      }
    }
}

 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents !== null){
           console.log("Output file ready."); 
           var path = String.fromCharCode.apply(null, Module.ret());
           document.path = path; 
           // console.log(path);

           drawPath(path);

           var path_blob = new Blob([path]);
           document.path_blob = path_blob;

           
           // var a = document.createElement("a");
           // var label = document.createTextNode("Download");
           // var disp = document.getElementById("disp");
           //
           // if (window.URL) {
           //   disp.innerHTML = '<a href="' + window.URL.createObjectURL(path_blob) + '" target="_blank">Download .path file</a>';
           // } else if (window.webkitURL) {
           //   disp.innerHTML = '<a href="' + window.webkitURL.createObjectURL(path_blob) + '" target="_blank">Download .path file</a>';
           clearInterval(timerId);
           } else {
            console.log("An error occured. reloading browser in 3 seconds.");
            var stat = document.getElementById("stat");
            stat.innerHTML = '<p>An error occured. Try another one.</p>';
            setTimeout(function(){
                location.reload()
            },3000);
           }
    },300);

}
