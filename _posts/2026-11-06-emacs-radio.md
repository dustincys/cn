---
layout: post
category: technology
title: 从土电话到 Emacs 收音机
matheq: no
comments: yes
tags: [emacs, 广播, 收音机, 德生pl-330, mpv, helm]
share: yes
toc: yes
---

小时候没有什么娱乐，喜欢听广播。
真正有意思的是晚上——等深夜，旋钮一拧，"咔哒咔哒"地一格一格走过去，指针越过中波、越过短波，忽然就撞进一个陌生的波段。
夜深人静，天波反射得远，还能听到俄罗斯的远东广播电台。
播音员说一口磕磕绊绊的普通话，信号飘飘忽忽，像从另一个世界传来的回声。
那时候我就想，这收音机背后，到底藏着一个多大的世界。

后来读博士，网络又慢又贵，慢得只够听广播。那几年常听的是中国国际广播电台的[轻松调频（CRI Easy FM）](https://dustincys.github.io/cn/recommend/)，尤其是下午那个三个人聊天的圆桌会议节目。实验室里断断续续的网速，配上一台吱吱响的收音机，竟也成了一种修行、一种情怀。我在[网站里](https://dustincys.github.io/cn/recommend/)的"听广播"一栏里，还专门记过这事。

前些日子和娃娃玩"土电话"——两个纸杯、一根棉线，杯底打个洞，线绷直了，这头说话，那头把杯子扣在耳朵上就能听见。娃娃问，为什么隔着线也能听见？我解释：你说话让杯底震动，震动顺着棉线一路传到对面，对面的杯底再把震动还原成声音。娃娃似懂非懂地点点头，我却忽然想起了广播。

土电话说到底，是“有线”的：震动老老实实地在棉线里走。广播呢，是“无线”的：声音本身传不远，得把它“抬”到电磁波上，让电磁波驮着它满世界飞。这“抬上去”的动作，就是调制。最常见的两种调制，一种是调幅（AM），让载波的幅度跟着声音变；一种是调频（FM），让载波的频率跟着声音变。接收端再把声音从载波上“摘”下来，这叫解调。合起来，调制器加解调器，就是我们天天念叨却未必深究的那个词——调制解调器。我琢磨着，等娃娃再大一点，拿两个对讲机、一个示波器，就能把这套“调幅、调频、调制解调”给他讲明白了。

想明白了这些，也就想明白了广播的好处。它单向——一个台说话，千千万万人听，不用握手、不用协商，谁也不耽误谁；它同时——同一份信号，大家同时收到，没有先后；它传播简单——一条载波，一片天空，山高水远都拦不住；它接收最方便——一台收音机，拧开就响，不用交费、不用账号、不用配对、不用升级。这些在今天看来稀松平常，当年却是了不起的本事。

于是又想起小时候晚上拧旋钮的感觉，心里痒痒的。我查了些长波、中波电台的资料，下单买了一台[德生 PL-330](http://www.tecsun.com.cn/)——长波、中波、短波、调频样样俱全的小机器，重新找回那种"旋钮咔哒、指针游走、电台从噪声里浮出来"的乐趣。
手机上也安装了收音机App，在老美开车的时候，听怀集音乐之声，在德州乡村小路上，有一种恍若隔世的感觉。
现在手机上的收音机App竟然一个赛一个地收费，广告还特别多，塞一堆花花绿绿的推荐，反而把"拧开就听"的干净劲儿给弄丢了。这不叫听广播，这叫刷广告。

那就不如自己做一个。于是有了 [emacs-radio](https://github.com/dustincys/emacs-radio)——一个放在 Emacs 里的网络收音机。既然手机 App 不可靠，就在自己最顺手的编辑器里听。一边写代码、写邮件，一边听着英文广播；想歇歇脑子，就切到新闻、音乐，或者听一段评书。多美好。

<img src="https://cdn.jsdelivr.net/gh/dustincys/emacs-radio@main/icon/EmacsRadioIcon.png" alt="Emacs Radio 图标" width="128" style="box-shadow:none;">

下面是演示视频：

<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; overflow: hidden; margin: 1em 0;">
  <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=117572901079753&bvid=BV1bH476KErQ&cid=43397220544&p=1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; max-width: 100%; border: 0; box-shadow: none;" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>

## 它是怎么工作的

emacs-radio 本身不解码音频，它只做电台管理界面这一件事，把重活都交给现成的工具。整条流水线是这样的：

```
原始 radio_sources.tsv（分类 / 电台 / URL）
        │
        └─ M-x emacs-radio-scan
             │ make-process：后台执行 emacs-radio-probe.py
             │ Python 用 FFmpeg 检验流是否真的能解码，并按 URL 去重
             ▼
缓存目录 radio_playable.tsv / radio_results.csv / radio_playable.m3u
        │
        └─ emacs-radio-load：只载入"通过检测"的电台
             │
             └─ M-x emacs-radio：按播放次数倒序，用 Helm 列出候选
                   │
                   └─ emacs-radio-play：启动后台 mpv
                         │
                         ├─ mode-line 显示电台名与播放状态
                         ├─ 鼠标点击 → 暂停/恢复（经 mpv JSON IPC）
                         └─ emacs-radio-stop → 停止并隐藏显示
```

这里有个关键的设计判断：**不是收到 HTTP 200 就算数，而是要让 FFmpeg 真的解码出 2 秒音频才算"可播放"**。网络电台的流地址常常改版，很多链接表面活着、点进去却是一片死寂，所以先扫一遍、只留能出声的，是必要的一步。扫描是异步的，跑起来不卡编辑器，进度可以随时用 `M-x emacs-radio-scan-log` 查看。

## 安装

依赖很少：Emacs 27.1+、`helm`，外加系统里的 `ffmpeg` 和 `mpv`。

```bash
sudo apt install ffmpeg mpv
```

把 `emacs-radio.el` 和 `emacs-radio-probe.py` 放在同一个目录，`radio_sources.tsv` 可以单独放。然后在配置里加几句：

```elisp
(add-to-list 'load-path "~/github/emacs-radio/")
(require 'emacs-radio)
(setq emacs-radio-sources-file "~/github/emacs-radio/radio_sources.tsv")
(setq emacs-radio-cache-directory "~/.emacs.d/emacs-radio-cache/")
(emacs-radio-mode 1)

;; 顺手绑几个快捷键
(global-set-key (kbd "C-c r r") #'emacs-radio)
(global-set-key (kbd "C-c r s") #'emacs-radio-scan)
(global-set-key (kbd "C-c r SPC") #'emacs-radio-toggle-pause)
(global-set-key (kbd "C-c r q") #'emacs-radio-stop)
```

## 使用

第一次先 `M-x emacs-radio-scan`，等它扫完。缓存目录里会多出三个文件：

- `radio_results.csv`——所有测过的电台及状态/失败原因；
- `radio_playable.tsv`——**只含 FFmpeg 能解码的电台**；
- `radio_playable.m3u`——对应的播放列表。

之后 `M-x emacs-radio`（或 `C-c r r`）就能用 Helm 搜索这份验证过的清单。缓存启动时自动加载，只有流地址大面积失效时才需要重新扫描。

电台表 `radio_sources.tsv` 只有三列：`分类`、`电台`、`URL`，制表符分隔。仓库里已经附了一份覆盖全国几十个省市台、中央台和国际英语频道的清单，直接可用，也可以照格式自己添。扫描不会改动这份原始表，想加台、想换源，改 TSV 再扫一次即可。

## 界面

`M-x emacs-radio` 弹出来的 Helm 电台列表长这样，按播放次数从高到低排，常听的台自然浮在最上面：

<a class="fancybox" rel="emacs-radio" href="https://cdn.jsdelivr.net/gh/dustincys/emacs-radio@main/screenshot/radio_station.png" title="电台列表"><img src="https://cdn.jsdelivr.net/gh/dustincys/emacs-radio@main/screenshot/radio_station.png" alt="电台列表" /></a>

播放时，mode-line 上会多出一小段随音量起伏的绿色波形——它不是花架子，而是通过 mpv 的 `astats` 滤镜实时算出来的响度包络；左键点一下就能暂停：

<a class="fancybox" rel="emacs-radio" href="https://cdn.jsdelivr.net/gh/dustincys/emacs-radio@main/screenshot/status_line.png" title="mode-line 状态与波形"><img src="https://cdn.jsdelivr.net/gh/dustincys/emacs-radio@main/screenshot/status_line.png" alt="mode-line 状态与波形" /></a>

## 几个贴心的地方

- **状态常驻 mode-line**。连接时显示 `[Radio … Station]`，播放中显示 `[Radio ▶ Station]`，暂停显示 `[Radio ⏸ Station]`；`emacs-radio-stop` 之后标记彻底消失，直到下一次开播。左键点一下那个收音机图标，就能暂停/恢复，不必切窗口敲命令。
- **按使用习惯排序**。v0.3.0 起，Helm 候选项按"选中次数"倒序排列，常听的台自然浮到最上面。次数按 URL 记，改名字也不丢；暂停、打开列表不选台，都不计入。次数落在 `radio_usage.tsv` 里，扫描不会覆盖它。
- **去重**。扫描前 Python 会先按 URL 去重（同一地址只留第一条名字/分类），一个电台有多个备用地址则保留多行，互不干扰。
- **Unix 下的 IPC 暂停**。`C-c r SPC` 通过 mpv 的 Unix-domain JSON IPC 套接字控制暂停，干净利落，适合 Debian 这类 Linux 系统。

## 写在最后

广播这东西，妙就妙在它"单向、同时、简单、方便"的朴素劲儿——没有握手、没有推送、没有算法，一台机器一片天，谁都能听。小时候拧旋钮听俄罗斯的远东电台是这种感觉，读博士时听轻松调频也是这种感觉；如今土电话勾起了话头，我买了德生 PL-330，又在 Emacs 里攒出这么个 [emacs-radio](https://github.com/dustincys/emacs-radio)，绕了一大圈，说到底还是想把这股劲儿留住：拧开，就响。
