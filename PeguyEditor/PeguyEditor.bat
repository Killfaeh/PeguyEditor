@echo off
cls

echo %cd%
set "MyPath=%~dpnx0" & call set "MyPath=%%MyPath:\%~nx0=%%" 
cd %MyPath% 
npm start

pause