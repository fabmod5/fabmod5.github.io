#!/bin/sh
OPT="-O3 -s DISABLE_EXCEPTION_CATCHING=0 -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1"
emcc ${OPT} -I/usr/local/include -L/usr/local/lib -c fab.c 
ar rsv libfabcore.a fab.o
emcc ${OPT} -I/usr/local/include -L/usr/local/lib -c path_rml.c 
emcc ${OPT} path_rml.o libfabcore.a libpng.a libgif.a libz.a -o path_rml.raw.js --pre-js pre.js
cat header.js path_rml.raw.js footer.js > path_rml.js 
cp path_rml.js path_rml.raw.js.mem ../
