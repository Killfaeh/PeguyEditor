@echo off
cls

set "MyPath=%~dpnx0" & call set "MyPath=%%MyPath:\%~nx0=%%" 
cd %MyPath% 
npm install --save-dev electron

pause