---
layout: post
category: technology
title: 用Emacs打造课堂随机提问系统
matheq: no
comments: yes
tags: ["emacs", "elisp", "教学工具", "tts", "课堂互动"]
share: yes
toc: no
---

## 引言

作为教师，课堂上如何公平地提问、记录学生的回答质量，一直是个不大不小的难题。手动点名容易不自觉偏爱某些学生，纸质记录效率低下，课后统计更是费时费力。
并且，现在学生名字生僻字太多，喊错名字又太尴尬。

[classroom-call](https://github.com/dustincys/classroom-call) 是一个 Emacs 扩展，专为课堂场景设计——随机点名、语音播报、评分记录、统计图表、CSV导出，全部在 Emacs 中完成。

本文带你从安装到进阶，全面掌握这个"Emacs教师利器"。

---

## 功能一览

- **🎲 随机点名** — 从学生池中随机抽取，配合滚动动画，增强课堂趣味性与紧张感
- **🔊 TTS 语音播报** — 集成 Microsoft Edge TTS，用中文朗读学生姓名和评分结果
- **📊 五级评分制** — 不仅看答案对错，更看重学生的逻辑表达能力（0–4 分）
- **🔄 多轮次支持** — 每轮学生顺序随机打乱，避免同一节课重复点到同一学生
- **📝 Org 记录** — 全部点名与评分以 Org mode 格式保存，可检索、可回顾
- **🚫 无回答处理** — 累计 ≤2 次无回答推迟至下节，第 3 次移出本轮池，防止逃避
- **↩️ 取消提问** — 误触或改变主意？按 `c` 即可取消，学生放回池中
- **💾 状态持久化** — 课堂状态自动保存，Emacs 崩溃或重启后可无缝恢复
- **📈 统计图表** — 按班级生成成绩分布柱状图 + 平均分折线（matplotlib 绘制）
- **📤 CSV 导出** — 一键导出全量成绩 CSV，每轮一列，Excel 友好

---

## 安装

### 环境依赖

| 组件 | 用途 | 安装命令 |
|------|------|----------|
| **Emacs** ≥ 27 | 运行平台 | 各系统包管理器 |
| **Python 3** | 拼音转换 & 图表生成 | `apt install python3` |
| **pypinyin** | 中文姓名 → 拼音 | `pip3 install pypinyin` |
| **matplotlib + numpy** | 成绩分布图表 | `pip3 install matplotlib numpy` |
| **edge-tts** | 语音合成 | `pip3 install edge-tts` |
| **mpv** 或 **ffplay** | 播放合成语音 | `apt install mpv` |

> 💡 不需要语音功能？跳过 `edge-tts` 和 `mpv`，设置 `classroom-enable-tts` 为 `nil` 即可。

### 配置 Emacs

克隆仓库后，在 Emacs 配置中添加：

```elisp
;; 添加到 load-path
(add-to-list 'load-path "~/.emacs.d/site-lisp/classroom-call/")
(require 'classroom-call)
```

推荐使用 `use-package`：

```elisp
(use-package classroom-call
  :load-path "~/.emacs.d/site-lisp/classroom-call/"
  :custom
  (classroom-enable-tts t)
  (classroom-tts-voice "zh-CN-XiaoxiaoNeural")
  (classroom-tts-player-command '("mpv" "--volume-max=200")))
```

所有可配置项都可以通过 Emacs 的 `customize-group` 界面进行可视化调整：

```
M-x customize-group RET classroom-call RET
```

---

## 学生名单

准备一个 CSV 文件，三列：**学号**、**姓名**、**班级**。第一行为表头。

```csv
id,name,group
20230001,张三,1班
20230002,李四,2班
20230003,王五,2班
20230004,赵六,3班
20230005,孙七,3班
```

- **id**：学号，作为唯一标识
- **name**：姓名（支持中文，系统自动调用 `pypinyin` 生成带声调的拼音）
- **group**：班级/分组（用于按班级生成统计图表）

文件名默认为仓库目录下的 `students.csv`，也可以在启动时互动选择其他文件。

---

## 使用指南

### 启动系统

在 Emacs 中执行：

```
M-x classroom-start
```

首次启动会提示你选择学生名单 CSV 文件。如果检测到上次课堂的状态文件（`classroom-state.el`），会询问是否恢复——选 **y** 即可继续上次未完成的课堂。

| 命令 | 说明 |
|------|------|
| `classroom-start` | 启动课堂系统（自动检测状态恢复） |
| `classroom-load-csv` | 手动重新加载学生名单 |
| `classroom-load-state` | 手动恢复上次保存的课堂状态 |

### 点名流程

1. 在 `*Classroom Call*` 缓冲区，按 **`c`** 开始点名
2. 屏幕上出现滚动动画——学生姓名快速随机切换，营造悬念
3. 动画结束，被点中的学生信息**全屏居中显示**：姓名、拼音、学号、班级
4. 若启用 TTS，系统会用中文朗读 *"请 XXX 回答问题"*
5. 学生在回答完毕后，教师按数字键 **`0`–`4`** 评分，或者按 **`c`** 取消本次提问

### 五级评分标准

这套评分体系不仅考察答案的正确性，更重视**逻辑思维与表达能力**：

| 按键 | 等级 | 含义 |
|:----:|------|------|
| `0` | 无回答 | 学生未回应提问 |
| `1` | 回答错误且解释无逻辑 | 答案和论证都存在明显问题 |
| `2` | 回答正确但解释不清 | 蒙对答案但说不出所以然 |
| `3` | 逻辑清晰（无论对错） | 回答正确且解释到位，或回答错误但推理路径有价值 |
| `4` | 批判性思维 | 推翻已有结论并提出新观点，超越标准答案 |
| `c` | 取消提问 | 学生放回池中，重新随机 |

这套标准的核心理念：**"说清楚为什么"比"说对答案"更重要**。等级 3 的设计尤为精妙——即使答案有误，只要逻辑推理清晰，同样获得高分肯定。

### 键盘快捷键

在 `*Classroom Call*` 主界面：

| 按键 | 功能 |
|:----:|------|
| `c` | 开始点名 |
| `s` | 显示统计信息与成绩分布图 |
| `p` | 查看当前轮次剩余学生名单 |
| `t` | 预生成全部 TTS 语音缓存 |
| `T` | 后台异步预热 TTS 缓存 |
| `C` | 清空 TTS 缓存目录 |

---

## 核心特性详解

### 1. 滚动动画

点名时的滚动动画并非华而不实——它在心理学上有助于营造公平感和紧张氛围。动画持续约 1.2 秒，学生姓名以递减速度切换，最终定格在选中的学生上。

实现上，它使用了 Emacs 的 `sit-for` 来控制刷新间隔，初期快速切换（每帧 15ms），后期逐渐变慢（约 185ms），模拟"转盘减速"的效果。

### 2. 无回答处理机制

这是对真实课堂场景的深度适配——总有学生会以"没想好""不会"为由不回答。系统的处理逻辑：

| 次数 | 处理方式 |
|:----:|----------|
| 第 1–2 次 | 学生放入 `unanswered-pool`（挂起池），**下次启动时**重新加入点名池 |
| 第 3 次 | 学生**永久移出**当前轮次点名池，不再被点到 |

如果挂起的学生之后正常回答了问题（1–4 分），其无回答计数**自动清零**，挂起状态清除。这确保了学生有机会补救，但无法无限期逃避。

### 3. 防止连续点到同一学生

两重保护：
- 每轮的点名池在开始时随机打乱，按序弹出——同一轮内不会重复
- 取消提问后，被取消的学生不会在下次点名中立即出现（系统会检测并重新洗牌）

### 4. TTS 语音播报

系统使用 Microsoft Edge TTS 引擎，免费且音质自然。默认使用 **"晓晓"（zh-CN-XiaoxiaoNeural）** 语音角色。

**缓存策略**：合成后的 MP3 文件以 `MD5(voice + rate + text)` 命名，缓存在 `classroom-tts-cache/` 目录。同一文本绝不重复合成。

**预热建议**：正式上课前，按 `t` 执行 `classroom-precache-tts`，提前生成所有学生姓名和评分等级的语音文件。点名时播放是即时的，不会有任何等待。

**异步生成**：如果课前忘了预热也不用担心——系统会在后台异步生成语音，**绝不阻塞**评分菜单。教师可以继续操作而不受影响。

可自定义的 TTS 参数：

```elisp
(setq classroom-tts-voice "zh-CN-YunxiNeural")  ; 换个语音角色
(setq classroom-tts-rate "+30%")                 ; 调整语速
(setq classroom-tts-player-command
      '("ffplay" "-nodisp" "-autoexit" "-loglevel" "quiet"))  ; 换用 ffplay
```

### 5. 统计图表

按 `s` 即可查看统计面板，内容包括：

- 当前轮次、剩余人数、已回答人数
- **成绩分布柱状图**：按班级分组，每个班级显示 0–4 各等级的计数
- **平均分折线图**（红色）：等级映射为百分制分数
  - 0 分 → 0，1 分 → 60，2 分 → 80，3 分 → 98，4 分 → 100
- **全员平均分参考线**（红色虚线）
- 当前挂起（无回答）的学生列表

图表由 Python 脚本 `classroom-plot.py` 使用 matplotlib 生成，以 PNG 格式嵌入 Org 缓冲区显示。支持任意数量的班级，图表宽度自适应。

### 6. Org 记录

所有点名和评分记录以 Org mode 格式保存，结构清晰：

```org
* 第1轮 张三 (Zhāng Sān) [20230001] <1班>
:PROPERTIES:
:ID:       20230001
:NAME:     张三
:PINYIN:   Zhāng Sān
:GROUP:    1班
:GRADE:    回答正确解释有逻辑，或回答错误但解释很有逻辑
:TIME:     [2026-06-14 Mon 10:23:45]
:END:
```

每条记录包含完整属性列，你可以用 Emacs 的 Org mode 搜索、过滤功能进行回顾。比如 `C-c / p` 按属性查找，或 `org-sparse-tree` 按正则匹配。

### 7. CSV 导出

执行 `M-x classroom-export-csv`，系统会解析 `classroom-record.org` 文件，将全量成绩导出为：

```csv
姓名,学号,班级,Round1,Round2,Round3
张三,20230001,1班,3,,1
李四,20230002,2班,1,0,1
王五,20230003,2班,,2,4
```

- 成绩以数字 0–4 表示
- 未参与轮次留空
- 可直接导入 Excel / Google Sheets 做进一步分析（计算班级平均分、成绩趋势等）

### 8. 状态持久化

每次评分后自动保存课堂状态到 `classroom-state.el`，包含：

- 当前轮次编号
- 点名池（剩余学生及顺序）
- 全部历史评分记录
- 学生名单
- 最后取消的学生 ID
- 无回答累计计数
- 挂起学生列表

Emacs 意外退出？下次启动时选择恢复，一切如初。

### 9. Spacemacs 支持

仓库 `spacemacs-layer/` 目录提供了 Spacemacs layer 配置，Spacemacs 用户可以直接将此 layer 添加到 `dotspacemacs-configuration-layers` 中使用。

---

## 个性化配置

以下是完整的可配置项及其默认值：

```elisp
;; ========== 文件路径 ==========
(setq classroom-directory
      (file-name-directory load-file-name))          ; 包所在目录
(setq classroom-org-file
      (expand-file-name "classroom-record.org" classroom-directory))
(setq classroom-state-file
      (expand-file-name "classroom-state.el" classroom-directory))
(setq classroom-default-students-file
      (expand-file-name "students.csv" classroom-directory))
(setq classroom-stats-image-file
      (expand-file-name "classroom-stats.png" classroom-directory))
(setq classroom-export-csv-default-file
      (expand-file-name "classroom-grades.csv" classroom-directory))

;; ========== Python ==========
(setq classroom-python-path "python3")
(setq classroom-plot-script
      (expand-file-name "classroom-plot.py" classroom-directory))

;; ========== TTS ==========
(setq classroom-enable-tts t)                        ; 启用语音
(setq classroom-tts-voice "zh-CN-XiaoxiaoNeural")   ; 语音角色
(setq classroom-tts-rate "+50%")                    ; 语速
(setq classroom-tts-player-command '("mpv" "--volume-max=200"))

;; ========== TTS 缓存 ==========
(setq classroom-tts-cache-dir
      (expand-file-name "classroom-tts-cache/" classroom-directory))
```

---

## 典型工作流

### 课前准备（2 分钟）

1. 打开 Emacs，执行 `M-x classroom-start`
2. （首次）选择本班学生 CSV 文件
3. 按 `t` 预生成全部 TTS 缓存（等待 30 秒 – 2 分钟，取决于学生数和 CPU）
4. 确认音量正常，关闭 TTS 日志缓冲区

### 课堂进行中

```
按 c   → 点名，学生姓名滚动，语音播报
学生回答
按 0-4 → 评分，系统朗读评分结果
按 c   → （可选）取消提问，换一个学生
按 s   → （可选）查看成绩分布和统计数据
重复
```

### 课后分析

1. `M-x classroom-show-statistics` 查看成绩分布图，截图放到教学总结中
2. `M-x classroom-export-csv` 导出成绩 CSV，在 Excel 中进一步分析
3. 打开 `classroom-record.org` 回顾每位学生的回答记录

---

## 设计哲学

classroom-call 的设计贯穿了几个核心理念：

**1. 公平性优先。** 随机点名 + 防止连续重复 + 无回答处理，确保每个学生有均等的被提问机会，同时防止逃避。

**2. 评价逻辑而非结果。** 评分标准向"表达清晰度"倾斜——等级 3 对错误但逻辑清楚的回答给予高分，等级 4 奖励批判性思维。这与"培养独立思考能力"的教育目标一致。

**3. 非侵入式语音。** TTS 异步生成、缓存预热、音频播放不阻塞操作——教师体验流畅，不需要为"等语音生成"而尴尬停顿。

**4. 纯 Emacs Lisp 核心。** 核心点名、评分、状态管理逻辑全部用 Elisp 实现，不依赖外部进程。只有拼音转换、图表生成、语音合成这些辅助功能才调用 Python / 外部工具——而且是异步的，不影响主流程。

**5. 数据归教师所有。** 所有记录保存在本地 Org 文件和 CSV 文件中，无云端依赖、无隐私泄露风险。教师完全掌控自己的教学数据。

---

## 小结

classroom-call 用 780 行 Elisp 代码 + 120 行 Python 脚本，将 Emacs 变成了一个功能完备的课堂互动工具。它或许不是最"现代化"的解决方案（那可能是某个 SaaS 平台），但它是：

- 🆓 **完全自由**（GPL-3.0）
- 🔒 **数据本地化**（无隐私顾虑）
- 🎛️ **深度可定制**（Elisp 配置一切）
- ⌨️ **键盘驱动**（Emacs 用户的最爱）

如果你是一名使用 Emacs 的教师，不妨试试在下次课堂上用 `classroom-call` 来点名——学生们听到电脑用中文朗读自己名字时的反应，本身就是课堂气氛的调味剂。

---

> 📦 项目地址：[github.com/dustincys/classroom-call](https://github.com/dustincys/classroom-call)
>
> 📄 许可证：GPL-3.0
>
> ✍️ 作者：Yanshuo Chu

