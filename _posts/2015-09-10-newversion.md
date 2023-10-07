---
layout: post 
category: else
title: 网站主题大改
matheq: no
comments: yes
tags: [网站主题, 安得倚天抽宝剑，把汝裁三截？]
share: yes
toc: no

---

最近书呆越来越觉得原网站主题不顺眼，愈发觉得字体和布局还不够大气、敞亮。

安得倚天抽宝剑，把汝裁三截？

- 第一截：把菜单设置成位置固定的隐藏式。
书呆使用[classie包](https://github.com/desandro/classie)所给出的方法改变class属性，使菜单分别映射到隐藏和显示两个状态的css。
具体方法见[这里](http://tympanus.net/codrops/2013/04/17/slide-and-push-menus/)。
-  第二截：重写的菜单部分，设置两个菜单，分别从左（大屏幕），右（移动设备小屏幕）边缘滑动出来。
因为书呆觉得移动设备右侧距离大拇指近，电脑上用鼠标应该是左侧比较符合常规。
- 最后一截：将博文内容、分享按钮、评论三个部分完全分开，以使的页面看起来敞亮。再设置一下各自的div的margin、border、shaddow等。
设置评论、分享和菜单快捷键以方便操作（快捷键说明参见[关于](https://dustincys.github.io/cn/about/)）。

好了，现在页面显得简洁、规范、抗审美疲劳。
