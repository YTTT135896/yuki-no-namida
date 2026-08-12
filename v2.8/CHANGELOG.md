# 更新日志 — 雪之痕 (Yuki no Kiseki)

---

## v2.8 — 记忆管理 + 多项修复 (2026-08-12)

### 新增
- **记忆管理系统**：分层记忆架构（全文 → 摘要 → 元摘要）
  - AI 输出 `<summary>` 和 `<meta>` 标签后自动生成记忆条目
  - 可配置三层读取数量限制（全文层/摘要层/元摘要层）
  - 记忆管理 UI：查看条目、调整层级、预览 AI 视角、删除/清空
  - 新增 `{{memory}}` 宏注入分层记忆上下文

### 修复
- **继续游戏流程**：选择存档后直接进入游戏，无需再点击「开始新游戏」
- **对话记录**：改用实际对话历史作为数据源，上限 50 条

### 移除
- **对话管理功能**：删除对话管理弹窗、侧边栏入口及相关代码

### 修改文件
| 文件 | 变更 |
|------|------|
| `js/sillytavern-core.js` | 新增记忆系统（数据结构/构建上下文/流解析器扩展/macro/DB存储） |
| `js/sillytavern-ui.js` | 新增记忆管理 UI，删除对话管理相关代码 |
| `js/config.js` | 新增 `{{memory}}` macro，更新格式模板，DB_VERSION→4 |
| `js/features.js` | 修复读档后直接进入游戏，对话记录改用 chatHistory + 50条限制 |
| `index.html` | 新增记忆管理弹窗，删除对话管理弹窗 |
| `css/features.css` | 新增记忆管理样式 |
| `js/main.js` | （无需变更） |

---

## v2.7 — UI 修复 (2026-08-12)

### 修复
- **主界面按钮失效**：修复弹窗 z-index 低于标题画面导致"继续游戏"和"CG回想"无法点击的问题
- **版本号错误**：标题画面版本号从 v2.4 更正为 v2.7

### 移除
- **设置入口**：删除主界面标题菜单和侧边栏中的"设置"按钮

### 修改文件
| 文件 | 变更 |
|------|------|
| `css/modals.css` | `.modal-overlay` z-index 100→350 |
| `index.html` | 删除 `#title-settings-btn`、`#nav-settings`，版本号 v2.4→v2.7 |
| `js/ui-core.js` | 删除 `title-settings-btn` 事件监听 |

---

## v2.6 — 正则管理模块 (2026-08-12)

### 新增
- **正则管理模块**：SillyTavern 风格正则 find/replace 引擎
  - 3 条默认规则：清理多余空行、英文标点转中文、移除 Markdown 残留
  - CRUD UI（列表 + 编辑器双栏，复用预设管理布局）
  - 每条规则支持：正则表达式、替换文本、目标范围（输入/输出/双向）、启用开关
  - 内置测试区：输入测试文本，即时预览替换结果
  - 导入/导出 JSON
- **应用引擎**：
  - `applyRegexInput(text)` — 用户输入发送前应用输入规则
  - `applyRegexOutput(text)` — AI 输出显示前应用输出规则
  - 无效正则自动跳过并 console.warn，不影响正常流程
- **IndexedDB**：新增 `regexes` store（DB_VERSION → 3）
- **侧边栏**：API 设置 → 预设管理 → **正则管理（新）** → 世界书

### 变更文件
| 文件 | 操作 |
|------|------|
| `config.js` | DB_VERSION→3，VERSION→2.6，DEFAULT_REGEX_RULES ×3 |
| `sillytavern-core.js` | DB 新增 regexes store；load/saveRegexRules；applyRegexInput/Output；sendToAI 和 _processAIResponse 接入正则 |
| `sillytavern-ui.js` | 正则管理完整 UI（open/select/save/init）；侧边栏加 nav-regex |
| `index.html` | 正则管理 modal（860px 双栏布局，含测试区） |
| `CHANGELOG.md` | v2.6 条目 |

---

## v2.5 — 完整变量体系 + 世界书集成 (2026-08-12)

### 新增
- **变量扩展到 30+ 个**：年龄、角色间互感、当前想法、衣柜穿搭、旗标等
- **世界书变量文档 ×3**：
  - `变量系统·完整列表` — 触发词「变量/状态/属性」，注入完整 schema
  - `变量更新规则` — 触发词「好感度/正面互动/负面互动」，注入 ±1~5 规则和 `<vars>` 格式
  - `变量初始值` — 触发词「初始状态/开局」，注入起始值快照
- **`{{wardrobe}}` 宏** — 当前角色穿搭摘要注入提示词
- **`getWardrobeText()`** — 格式化衣柜为可读文本（8 部位）
- **`renderFromVars()`** — 从 `Yuki.ST.variables.*_wardrobe` 渲染衣柜网格
- **`openDetailBySlot()`** — 按部位名打开服饰详情弹窗
- **角色详情页动态绑定**：
  - 年龄（`.var-age-val`）
  - 互感好感度（`.var-aff-kanade` `.var-aff-rei` `.var-aff-yukina`）
  - 当前想法（`.char-thought-text`）
  - 好感对象按钮显示实时互感值百分比

### 变更文件
| 文件 | 操作 |
|------|------|
| `config.js` | 新增 DEFAULT_WARDROBE、WB_VAR_SCHEMA/RULES/INITIAL 世界书条目；扩展 VAR_BINDINGS(20→40+)、VAR_META、PROTECTED_VARS；VERSION→2.5；格式模板新增 `{{wardrobe}}` |
| `sillytavern-core.js` | 默认变量从 7→28 个字段；默认世界书条目 +3；新增 getWardrobeText/renderFromVars；getVarsText 格式化衣柜为可读列表 |
| `features.js` | 新增 renderFromVars / openDetailBySlot；好感度切换读取 live 变量 |
| `index.html` | 3 个角色 slide：年龄改动态 span、互感按钮显示实时百分比 |
| `CHANGELOG.md` | v2.5 条目 |

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
