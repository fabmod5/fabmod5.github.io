#!/bin/sh
emcc -O2 -I/usr/local/include -L/usr/local/lib -c fab.c 
ar rsv libfabcore.a fab.o
emcc -O2 -I/usr/local/include -L/usr/local/lib -c png_path.c
emcc -O2 png_path.o libfabcore.a libpng.a libgif.a libz.a -o png_path.raw.js --pre-js pre.js
cat header.js png_path.raw.js footer.js > png_path.js 
cp png_path.js png_path.raw.js.mem ../
