 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents != null){
           console.log("Output file ready."); 
           var rml = String.fromCharCode.apply(null, Module.ret());
           console.log(rml);

           var rml_blob = new Blob([rml]);
           document.rml_blob = rml_blob; 
           var a = document.createElement("a");
           var label = document.createTextNode("Download");
           var disp2 = document.getElementById("disp2");

           if (window.URL) {
             disp2.innerHTML = '<a href="' + window.URL.createObjectURL(rml_blob) + '" target="_blank">Download .rml file</a>';
           } else if (window.webkitURL) {
             disp2.innerHTML = '<a href="' + window.webkitURL.createObjectURL(rml_blob) + '" target="_blank">Download .rml file</a>';
           }

           clearInterval(timerId);
         } else {
           console.log("processing path_rml...");
         }
    },300);

}
