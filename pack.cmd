@echo off
cmd /c rollup -c rollup.config.ts
del *.tgz /q
del ..\coderr.client.js.node-demo\*.tgz /q
cmd /c npm pack
copy *.tgz ..\coderr.client.js.node-demo\ 
