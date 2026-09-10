# -*- coding: utf-8 -*-
import io
P = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P, encoding="utf-8", newline="").read()
s = raw.replace("\r\n", "\n")
old = """window.v92_threadTick = function(node){
  try{
    if(!S||!S.threads) return null;"""
new = """window.v92_threadTick = function(node){
  try{
    if(!S) return null;
    if(!S.threads) S.threads={};"""
assert old in s, "anchor not found"
s = s.replace(old, new, 1)
io.open(P, "w", encoding="utf-8", newline="").write(s.replace("\n", "\r\n"))
print("OK: v92_threadTick lazy init")
