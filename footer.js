 var timerId = setInterval(function(){
       if(FS.findObject("/output").contents !== null){
           console.log("Output file ready."); 
           console.log(String.fromCharCode.apply(null, Module.ret()));
           clearInterval(timerId);
       }
    },300);

}
