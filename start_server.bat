@echo off
chcp 65001 >nul
title 艾尔达大陆·群雄割据 本地服务器
echo ============================================
echo   艾尔达大陆 · 群雄割据 本地服务器
echo   分片版地址: http://localhost:8080/index.html
echo   单文件版:   http://localhost:8080/game.html
echo   关闭本窗口即停止服务器
echo ============================================
python -m http.server 8080
