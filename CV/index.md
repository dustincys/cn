---
layout: page
title: 简历
comments: no
toc: no
share: no

---

> 这里推荐一些Linux系统下好用的工具和相应的设置方法。

少林寺藏经阁里的七十二绝技，是不是在所有的武侠小说、电影里都有，所以这等博大精深家喻户晓的武学就不用宣传了。
少林弟子满天下，随便到江湖中一打听，各种宣传普及都有了。
这里想要讲述的是江湖中那些神秘的刀客（Doctor？）、剑客、侠客、浪子、隐士的武功秘笈……

> “大侠，先说说哪些算‘七十二绝技’？”  
> “Vim, Emacs, Fvwm, Awesome, Mutt……”  
> “大侠，哪些是神秘的刀客、剑客、浪子、隐士？”  
> “烟波钓叟，白首太玄经的作者，迎风一刀斩……”

## 毕业论文模板

哈工大毕业论文模板[hithesis](https://github.com/dustincys/hithesis)。

## 最好的桌面UI

[hifvwm](https://github.com/dustincys/hifvwm)，符合人类思维直觉，打开再多的窗口也不会“蒙圈”。

屏幕截图：

|![s1](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/screenshot-2020-04-27%5B00%3A16%5D.jpg)|![s2](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/Screenshot%20from%202020-04-27%2000-22-12.png)|![s3](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/screenshot-2020-04-27%5B00%3A19%5D.jpg)|
|-|-|-|
|![s4](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/screenshot-2020-04-27%5B00%3A20%5D.jpg)|![s5](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/screenshot-2020-04-27%5B00%3A23%5D.jpg)|![s6](https://raw.githubusercontent.com/dustincys/hifvwm/screenshots/screenshot-2020-04-27%5B00%3A24%5D.jpg)|

## 听广播

推荐个广播流媒体：[CRI轻松调频](http://english.cri.cn/easyfm/index.htm)。
其中有一个三个人谈话节目叫做圆桌会议，在EZFM频道下午1点到2点之间首播，在AM1008频道晚上6点重播。
这个时间段正是午饭后、晚饭后休息时间，不爱干活了吧？闲着没事干嘛呢？

一定会有像书呆所遇到的这种[“大网络中心提供的不咋地网速只够听广播”](https://dustincys.github.io/cn/2014/05/radio/)的情况，这时候就要不停地死循环地尝试链接流媒体。

<script src="https://gist.github.com/dustincys/7c9a20a8ac555b9d04f6.js"></script>


## Goldendict

### 软件截图
<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pdz3zqVvX6skpgKScFHas7Pq2jkdA88uueX9-UR3mFNtv66I91pvSGgVbiIPKn4PpftPytaafPw7I7m0pxhsSktFePyD49mMZtgDXpVN7iGCNvzEOF-jzam_J_xZRZ5KIYdwJxM53zk_3IWl0Y57mA7xN4pJKvKQu96OwOO9ZRm0/goldendict.png" title="Goldendict"><img src="https://2s66lw.bl3301.livefilestore.com/y2pdz3zqVvX6skpgKScFHas7Pq2jkdA88uueX9-UR3mFNtv66I91pvSGgVbiIPKn4PpftPytaafPw7I7m0pxhsSktFePyD49mMZtgDXpVN7iGCNvzEOF-jzam_J_xZRZ5KIYdwJxM53zk_3IWl0Y57mA7xN4pJKvKQu96OwOO9ZRm0/goldendict.png" alt="Goldendict" /></a>

### 设置方法

GoldenDict的CSS文件放在了`~/.GoldenDict/`中的`article-style.css`和`qt-style.css`中。 另一必要的设置：当词典窗口改变时，本地词典中的图片不超过窗口大小，这个设置在上面两个文件中有。

article-style.css  [下载地址](https://gist.github.com/dustincys/8471489)
qt-style.css	[下载地址](https://gist.github.com/dustincys/9739972)  

### 应用举例

vim下英文写作／翻译时使用goldendict方法，

	nnoremap <leader>d  :silent !goldendict <cword><CR>
