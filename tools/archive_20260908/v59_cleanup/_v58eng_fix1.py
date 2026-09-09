#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_v58eng_fix1.py — V58-ENG 引用健康修复（12 项精确锚点，幂等 /v58eng:/）。

规则：每项 str.replace 精确匹配 + 计数断言；任何一项计数不符即中止不写回。
"""
import io, os

GAME = r'D:\1pao tuan\群雄割据\game.html'
MARK = '/v58eng:refhealth/'

FIXES = [
    # F1: window.S 恒 undefined（S 为顶层 let，不挂 window；含字符串内 trigger）→ typeof S 安全兜底
    ('window.S&&S.worldState', 'typeof S!=="undefined"&&S&&S.worldState', 7),
    # F2: v47 势力事件效果函数名错误（真名 worldDelta，已导出 window.worldDelta）
    ("if(ev.effect&&window.v47_worldDelta) { try{ v47_worldDelta(ev.effect.force, ev.effect.delta||0); }catch(e2){} }",
     "if(ev.effect&&window.worldDelta) { try{ worldDelta(ev.effect.force, ev.effect.delta||0); }catch(e2){} }", 1),
    # F3: v55_castFX 飘字调用错名（v44 真名 v44_showFloatText）
    ("if(window.v44_floatText) try{v44_floatText(document.getElementById('story'), s.cn, 'purple');}catch(e){}",
     "if(window.v44_showFloatText) try{v44_showFloatText(document.getElementById('story'), s.cn, 'purple');}catch(e){}", 1),
    # F4: v55 技能习得 toast 调用错名（v44 真名 v44_pushToast）
    ("if(window.v44_toast) try{v44_toast('新技法','你悟出了：'+added+' 门职业技法','success','⚔');}catch(e){}",
     "if(window.v44_pushToast) try{v44_pushToast('新技法','你悟出了：'+added+' 门职业技法','success','⚔');}catch(e){}", 1),
    ("try{ if(window.v44_toast){} }catch(e){}",
     "try{ if(window.v44_pushToast){} }catch(e){}", 1),
    # F6: ErrorLog 为顶层 const（不挂 window）→ typeof 安全
    ("if(window.ErrorLog&&ErrorLog.record) try{ ErrorLog.record(e); }catch(e2){}",
     "if(typeof ErrorLog!=='undefined'&&ErrorLog&&ErrorLog.record) try{ ErrorLog.record(e); }catch(e2){}", 1),
    # F7: ToastCenter 未定义（计划未实现）→ typeof 安全（行为不变）
    ("if(window.ToastCenter && ToastCenter.push) { try{ ToastCenter.push(e.t, e.m, 'info'); }catch(x){} }",
     "if(typeof ToastCenter!=='undefined'&&ToastCenter&&ToastCenter.push) { try{ ToastCenter.push(e.t, e.m, 'info'); }catch(x){} }", 1),
    # F8: v53 调用 v45 解锁函数名错误（v45 已导出 window.v45_unlockReading）
    ("if(window.unlockReading) unlockReading(id);",
     "if(window.v45_unlockReading) v45_unlockReading(id);", 1),
    # F9: v52_jobCn 未导出（v57 桥读取恒 undefined）→ 补导出
    ("function v52_jobCn(){ return S.job || \"\"; }",
     "function v52_jobCn(){ return S.job || \"\"; } window.v52_jobCn=v52_jobCn;", 1),
    # F10: ELDA.getNodes 中 window.N 恒 undefined（N 为顶层 const）→ 裸 N 优先（行为不变）
    ("return (typeof window.N !== 'undefined') ? window.N : (typeof N !== 'undefined' ? N : {});",
     "return (typeof N !== 'undefined') ? N : (typeof window.N !== 'undefined' ? window.N : {});", 1),
    # F11: RIVALS_V52 为顶层 const → 裸引用优先（行为不变）
    ("var R=window.RIVALS_V52||(typeof RIVALS_V52!==\"undefined\"?RIVALS_V52:{});",
     "var R=(typeof RIVALS_V52!==\"undefined\"?RIVALS_V52:(window.RIVALS_V52||{}));", 1),
]


def main():
    with io.open(GAME, encoding='utf-8') as f:
        d = f.read()
    if MARK in d:
        print('已存在 marker，跳过（幂等）')
        return
    for old, new, expect in FIXES:
        cnt = d.count(old)
        if cnt != expect:
            print('中止: "%s" 预期 %d 次，实际 %d 次' % (old[:60], expect, cnt))
            return
    # 全部通过后写入（带 marker 注释）
    marker_js = '\n/* ' + MARK + ' 引用健康修复 12 项 */\n'
    anchor = '/*=====v46-eng-end=====*/'
    assert anchor in d, '锚点缺失'
    d = d.replace(anchor, anchor + marker_js, 1)
    for old, new, expect in FIXES:
        d = d.replace(old, new)
    with io.open(GAME, 'w', encoding='utf-8') as f:
        f.write(d)
    print('OK: 12 项修复全部写入，marker=%s' % MARK)


if __name__ == '__main__':
    main()
