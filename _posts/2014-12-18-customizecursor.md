---
layout: post 
category : 生活
title: ubuntu用户，改改鼠标吧！
matheq: no
comments: yes
tags : [ubuntu, 鼠标主题那么难看……]

---

我实在忍不住不要大喊一声：爷们，那么丑的鼠标你也能忍受？
主题丑忍忍也罢，图标丑忍忍也罢，那么小的鼠标，很多时候找不着鼠标在哪里。
而其实，ubuntu自身就带着一款非常高大上的鼠标主题——[chameleon](https://launchpad.net/ubuntu/+source/chameleon-cursor-theme "chameleon")！
这款鼠标主题大小适中，修长圆润，阴影衬托、半透明且有立体感，是ubuntu中最佳鼠标主题。

<a class="fancybox" rel="gallery1" href="http://gnome-look.org/CONTENT/content-pre1/38459-1.jpg" title="chameleon-white 鼠标"><img src="http://gnome-look.org/CONTENT/content-pre1/38459-1.jpg" alt="chameleon-white 鼠标" /></a>

安装方法非常轻松简单愉快：
	
	sudo apt-get install chameleon-cursor-theme

使用方法也非常轻松简单愉快，以我最喜欢的Chameleon-White-Large为例：

1. 使用ubuntu-tweak之类的工具将当前账户的鼠标设置为Chameleon-White-Large
2. 将root账户鼠标设置为Chameleon-White-Large, 首先打开root用户设置选项：

		sudo update-alternatives --config x-cursor-theme

	选中其中的chameleon-white-large选项设为默认。

这样高大上的鼠标就设置好了！诸位，改改鼠标吧！
