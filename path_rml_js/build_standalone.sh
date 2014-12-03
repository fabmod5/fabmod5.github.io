#!/bin/sh
emcc -O2 -I/usr/local/include -L/usr/local/lib -c fab.c 
ar rsv libfabcore.a fab.o
emcc -O2 -I/usr/local/include -L/usr/local/lib -c path_rml.c 
emcc -O2 path_rml.o libfabcore.a libpng.a libgif.a libz.a -o path_rml.node.js --embed-file input
