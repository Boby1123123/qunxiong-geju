# AU-5 Web Audio 环境音（v93）

批次：AU-5 · 2026-09-11 · 八批大型更新第五批
状态：已完成，纯程序化音效，无外部资源，ci 全绿

## 扩了什么

- `src\script_04.js` `/v93audio:hooks/`（:11348 起）：
  - `v93_audioInit()`：懒初始化 AudioContext（首次渲染时），master 音量 0.04（极低不扰）。
  - 六种程序化音景：wind（北境/风雪）、wind2（沙漠/西境）、tavern（酒馆）、rumble（矿洞地下）、rain（雨）、fire（默认），按 S.curCity/place 匹配。
  - `v93_ambienceToggle()`：开关环境音；`ambienceSync()`：跟随地点切换。
- `applyDefaults` 新增 `S.settings.ambience=true`（独立键，旧档兼容）。

## 为什么

纯文字 MUD 长时间阅读易疲劳。轻量程序化环境音（风声/火塘/雨声）给每个区域一个听觉底色，显著提升沉浸感；全部 Web Audio API 本地合成，不引外部音频资源、不入存档、不改判定。

## 如何验证

- bu 实测：设置面板"环境音"开关存在且默认 on；`S.settings.ambience` 默认 true。
- 控制台无 AudioContext 报错；音景随地点切换（代码路径 ambienceSync）。
- 关掉后无音效、零回归。
