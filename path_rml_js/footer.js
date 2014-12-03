 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents != null){
           console.log("Output file ready."); 
           var rml = String.fromCharCode.apply(null, Module.ret());
           console.log(rml);

           var rml_blob = new Blob([rml]);
           document.rml_blob = rml_blob; 
           var a = document.createElement("a");
           var label = document.createTextNode("Download");
           var disp = document.getElementById("disp");

           if (window.URL) {
             disp.innerHTML = '<a href="' + window.URL.createObjectURL(rml_blob) + '" target="_blank">Download .rml file</a>';
           } else if (window.webkitURL) {
             disp.innerHTML = '<a href="' + window.webkitURL.createObjectURL(rml_blob) + '" target="_blank">Download .rml file</a>';
           }

           clearInterval(timerId);
         } else {
           console.log("processing path_rml...");
         }
    },300);

}
