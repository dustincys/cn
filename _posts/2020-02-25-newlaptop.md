---
layout: post
category: technology
title: 全屏逻辑
matheq: no
comments: yes
tags: [电脑, Linux]
share: yes
toc: no
---
<style type="text/css" rel="stylesheet">
table, td, th {
    border: 1px solid;
    padding: 1em;
border-collapse: collapse;
}
</style>
hifvwm的逻辑是把所有窗口都最大化，按照任务，分类别排成九宫格桌面。
类似如下

任务1：

-------------|----------|------------
 Email       | PDF      | Dictionary 
 Terminal    | Emacs    | Firefox    
 FileBrowser | Terminal | Zotero     

任务2：

-------------|----------|------------
Else       　| Figures | Else
Adobe Illustrator | Photoshop   | Firefox 
Else | FileBrowser |  Else

因为空间记忆相比线性记忆（Windows任务栏/Mac全屏）要更加形象，便于工作。hifvwm自带自动识别程序，并在指定的桌面/位置中打开固定的窗口程序，这样形成肌肉记忆（类似拼音的九宫格输入法）之后就可以完全去除任务栏，让所有的窗口都全屏，排列整齐就好了，绝对不会出现找不到窗口的情况，因为一切都被hifvwm安排的妥妥的。

在全屏时候，有可能出现全屏窗口之下还覆盖着窗口，尽管这种情况很罕见。因为正常情况下，九个不同类别的程序，占用九个桌面已经基本足够。
windows/Mac的逻辑是提供一个屋子（系统），刚开始进入屋子时，里面只有一个桌子（桌面），桌子上逐渐放了一堆书（窗口），然后用户自己给书分类，桌子上必须有书架（任务栏），放不下自己再搬来一个桌子（生成新桌面）。
hifvwm的逻辑是，由于现在空间和物资足够（内存大和CPU强），用户直接进入的是一个楼，每一个楼层里有很多房间（任务，最大65536个，默认使用5个），每个房间里已经摆好3x3共9个桌子（桌面），有一个管家负责给书（窗口）分类放在各自桌上。用户进入之后在中间的主力工作书桌坐好，周围8个辅助书桌加一个管家，工作效率可想而知。

土豪既然资源多，那么就把所有的书都打开最大（全屏），用不着合上摞起来（最小化）。只需要稍微提醒一下有没有大书本下还覆盖着别的小书本，因为这种情况已经很罕见，几乎没有什么人上自习同时复习9本书以上的了。例如下图Emacs全屏之下还覆盖这一个firefox，在左下角提醒一下覆盖这窗口类别和对应数量即可。
实际上这种情况很罕见，因为firefox和emacs会被管家自动分开。

<a class="fancybox" rel="gallery1" href="https://raw.githubusercontent.com/dustincys/cn/assets/screenshot-2020-02-25%5B21%3A52%5D.jpg" title="全屏提醒"><img src="https://raw.githubusercontent.com/dustincys/cn/assets/screenshot-2020-02-25%5B21%3A52%5D.jpg" alt="全屏提醒" /></a>

提醒的方法如下：

```bash
##!/usr/bin/env bash

sleep 0.5

rm /home/dustin/.fvwm/tmp/.overlapped.temp /home/dustin/.fvwm/tmp/.winidlist.temp -f

FvwmCommand "Piperead \"wmctrl -l | awk '\\"$\\"2==\\"$\[desk.n\]\\" {print \\"$\\"1}' > /home/dustin/.fvwm/tmp/.winidlist.temp\""

sleep 0.1 && cat /home/dustin/.fvwm/tmp/.winidlist.temp | xargs -n 1 -I{} FvwmCommand "WindowID {} (CurrentPage, Overlapped) Piperead \"echo {} >> /home/dustin/.fvwm/tmp/.overlapped.temp\""

sleep 0.1

wn=`cat /home/dustin/.fvwm/tmp/.overlapped.temp | wc -l`
if [ $wn -gt 0 ]
then
    cat /home/dustin/.fvwm/tmp/.overlapped.temp | xargs -n 1 -I{} xprop -id {} | grep CLASS | awk 'BEGIN{FS="\""} NF>0 { t[$4]++} END{for(j in t) print j"("t[j]")"}' | awk 'BEGIN{ORS=" "} NF>0 1' | osd_cat -A left -p bottom -o -30 -i -10  -s 1 -d 2 -c cyan -f -adobe-courier-bold-r-normal--0-500-50-50-m-0-iso8859-1
fi

sleep 0.1
rm /home/dustin/.fvwm/tmp/.overlapped.temp /home/dustin/.fvwm/tmp/.winidlist.temp -f

```

