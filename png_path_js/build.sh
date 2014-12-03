#!/bin/sh
# OPT="-s DISABLE_EXCEPTION_CATCHING=0 -s ALLOW_MEMORY_GROWTH=1"
OPT="-O3 -s DISABLE_EXCEPTION_CATCHING=0 -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1"
emcc ${OPT} -I/usr/local/include -L/usr/local/lib -c fab.c 
ar rsv libfabcore.a fab.o
emcc ${OPT} -I/usr/local/include -L/usr/local/lib -c png_path.c
emcc ${OPT} png_path.o libfabcore.a libpng.a libgif.a libz.a -o png_path.raw.js --pre-js pre.js
cat header.js png_path.raw.js footer.js > png_path.js 
cp png_path.js png_path.raw.js.mem ../
