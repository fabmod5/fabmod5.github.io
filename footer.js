 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents !== null){
           console.log("Output file ready."); 
           var path = String.fromCharCode.apply(null, Module.ret());
           console.log(path);

           var blob = new Blob([path]);
           var a = document.createElement("a");
           var label = document.createTextNode("Download");
           var disp = document.getElementById("disp");

           if (window.URL) {
             disp.innerHTML = '<a href="' + window.URL.createObjectURL(blob) + '" target="_blank">Download .path file</a>';
           } else if (window.webkitURL) {
             disp.innerHTML = '<a href="' + window.webkitURL.createObjectURL(blob) + '" target="_blank">Download .path file</a>';
           }

           clearInterval(timerId);
       }
    },300);

}
