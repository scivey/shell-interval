@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\shell-interval\bin\cmd.js" %*
) ELSE (
  node  "%~dp0\node_modules\shell-interval\bin\cmd.js" %*
)