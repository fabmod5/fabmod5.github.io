 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents !== null){
           console.log("Output file ready."); 
           var path = String.fromCharCode.apply(null, Module.ret());
           console.log(path);

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
            console.log("processing png_path ...");
           }
    },300);

}
