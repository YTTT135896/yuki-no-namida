# 更新日志 — 雪之痕 (Yuki no Kiseki)

---

## v2.4 — 响应式变量系统 (2026-08-12)

### 新增
- **响应式变量系统**：所有变量修改自动同步到前端 DOM 显示
  - `Yuki.ST.setVariable(key, value)` — 变量修改唯一入口，同时更新 JS 对象和 DOM
  - `Yuki.ST.refreshAllHUD()` — 页面初始化时批量同步所有绑定
  - `Yuki.ST.VAR_BINDINGS` — 变量→DOM 映射表，支持 4 种绑定动作（el / html / style+sel / custom）
- **深合并** `Yuki.ST.deepMerge(target, source)` — AI 返回的 `<vars>` JSON 深度合并，支持嵌套对象
- **变量元数据** `Yuki.ST.VAR_META` — 每个变量标注分类（display/affection/currency/state）、类型、描述
- **变量面板升级**：
  - 显示所有变量类型（含 `flags` 等对象类型，以 JSON textarea 编辑）
  - 每个变量展示分类标签和描述
  - 核心变量（chapter/location/time/weather）加锁保护，不可删除
  - 新建变量支持自动检测 JSON/数字/字符串类型
- HUD 新增 **天气显示** `#weather-text`
- 位置文本 `#location-text` 由 `location + time` 两个变量组合驱动
- 好感度条切换时从 `Yuki.ST.variables` 实时读取玩家好感值
- 创建 `CHANGELOG.md` 版本更新日志

### 修复
- 修复「游戏变量」面板修改后前端 HUD 不更新的问题
- 修复好感度/金币变化后角色详情页不反映最新值的问题
- 修复 AI 返回 `<vars>` JSON 后只更新 JS 对象不触发 DOM 刷新的问题

### 变更文件
| 文件 | 操作 |
|------|------|
| `config.js` | 新增 VAR_BINDINGS / VAR_META / PROTECTED_VARS，VERSION→2.4 |
| `sillytavern-core.js` | 新增 setVariable / refreshAllHUD / deepMerge / _refreshBinding；改造 mergeVars / rollbackVars |
| `sillytavern-ui.js` | 重写变量面板渲染（支持对象/分类/保护）；_updateVar 走 setVariable |
| `features.js` | 好感度切换读取 Yuki.ST.variables |
| `main.js` | ST init 后调用 refreshAllHUD |
| `index.html` | HUD 新增 weather-text；变量 modal 加宽至 640px；版本号 v2.4 |
| `sillytavern.css` | 新增 .var-key-col / .var-cat-tag / .var-desc / .var-value-obj / .var-lock-icon |
| `CHANGELOG.md` | **新建** |

---

## v2.3 — 酒馆模式 + 预设管理 (2026-08-12)

### 新增
- **预设管理**：3 个默认预设（默认叙事/文学风格/快速模式），含参数滑块、CRUD、导入导出
- **酒馆模式提示词**：宏系统 `{{char}}` `{{user}}` `{{char_card}}` `{{variables}}` `{{lorebook_before}}` `{{lorebook_after}}` `{{author_note}}` `{{original}}`
- **世界书位置分组**：条目支持「角色前/角色后」位置切换，提示词中分两组注入
- 侧边栏新增「预设管理」（位于「世界书」上方）
- 预设参数驱动所有 AI 生成参数

### 变更文件
18 files, +647/-316 lines

---

## v2.2 — 完全模块化 (2026-08-11)

### 新增
- 18 文件模块化架构：8 CSS + 8 JS + index.html + loading inline
- SillyTavern 集成：AI 聊天、世界书、游戏变量、对话管理、流式解析
- 角色详情、CG 收藏馆、背包系统、存档/读档、对话记录
- 衣柜系统（3 角色 × 8 部位）、套装效果
- 雪花粒子、光标拖尾、点击涟漪视觉特效

---

## v2.1 — 加载画面 (2026-08-10)

### 新增
- Loading screen 带进度条，消除 FOUC 和字体闪烁

---

## v2.0 — SillyTavern 集成 (2026-08-09)

### 新增
- AI 聊天、世界书、变量系统
- 流式响应、对话分支

---

## v1.2 — 前端原型 (2026-08-08)

### 新增
- 视觉小说前端原型：雪之痕 (Yuki no Kiseki)
