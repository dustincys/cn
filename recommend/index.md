---
layout: page 
title: 软件工具推荐
comments: yes
toc: yes
share: yes

---

> 这里推荐一些Linux系统下好用的工具和相应的设置方法。

少林寺藏经阁里的七十二绝技，是不是在所有的武侠小说、电影里都有，所以这等博大精深家喻户晓的武学就不用宣传了。
少林弟子满天下，随便到江湖中一打听，各种宣传普及都有了。
这里想要讲述的是江湖中那些神秘的刀客（Doctor？）、剑客、侠客、浪子、隐士的武功秘笈……

> “大侠，先说说哪些算‘七十二绝技’？”  
> “Vim, Emacs, Fvwm, Awesome, Mutt……”  
> “大侠，哪些是神秘的刀客、剑客、浪子、隐士？”  
> “烟波钓叟，白首太玄经的作者，迎风一刀斩……”

## 听广播

推荐个广播流媒体：[CRI轻松调频](http://english.cri.cn/easyfm/index.htm)。
其中有一个三个人谈话节目叫做圆桌会议，在EZFM频道下午1点到2点之间首播，在AM1008频道晚上6点重播。
这个时间段正是午饭后、晚饭后休息时间，不爱干活了吧？闲着没事干嘛呢？

一定会有像书呆所遇到的这种[“大网络中心提供的不咋地网速只够听广播”](http://yanshuo.name/cn/2014/05/radio/)的情况，这时候就要不停地死循环地尝试链接流媒体。

<script src="https://gist.github.com/dustincys/7c9a20a8ac555b9d04f6.js"></script>

## Tmux

这货能解决“开多个终端蒙圈了”之问题。
也有许多大侠喜欢用这个加上vim和debug工具组成一个类似IDE的截面。
另外也有大侠喜欢用这个替代screen。
配置文件`.tmux.conf`[下载地址](https://gist.github.com/dustincys/5593b68fed0cb23a9766)

使用Tmux最大的好处是可以一键打开工作环境。
举个例子，书呆开机后需要在终端逐个打开以下程序：

1. 谷歌代理，goagent，有时候谷歌代理不好用，需要查看错误输出信息
2. 打开广播，就是上面的广播脚本，mplayer 死循环，即可以随时检验网络链接状况，又可以随时薅起耳机听广播
3. 打开邮件，mutt，收发和阅读邮件
4. 打开rss阅读器，newsbeauter，查看最新的博客、文献
5. 打开本机工作文件夹
6. 打开实验室服务器ssh链接

每次开机之后，只需要执行以下脚本就可以一次打开所有的环境：

<script src="https://gist.github.com/dustincys/7f7769d7d585a31cff39.js"></script>

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

## Rednotebook

### 软件截图

<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pqsmYB8dWoASLLAdBHGhkj-6J7Or4gMSLNDh78eoK4VCqgkOAmJbzPWf8YQNUkq1jTZsVlnzZKE3eQQANNVcedeYl828f0L3WhWj5B0X0r0wqEf78wXwXfaa6iROYCAovXXNXjUN5StBemGsQWZwUZCNR1a-ktQKOL4AejUTdrEY/rednotebook.png" title="rednotebook"><img src="https://2s66lw.bl3301.livefilestore.com/y2pqsmYB8dWoASLLAdBHGhkj-6J7Or4gMSLNDh78eoK4VCqgkOAmJbzPWf8YQNUkq1jTZsVlnzZKE3eQQANNVcedeYl828f0L3WhWj5B0X0r0wqEf78wXwXfaa6iROYCAovXXNXjUN5StBemGsQWZwUZCNR1a-ktQKOL4AejUTdrEY/rednotebook.png" alt="rednotebook" /></a>

### 设置方法
- 软件安装位置：

	/user/share/rednotebook/rednotebook/

- 改标签云颜色的css设置在下面的文件中：

	/gui/clouds.py

<script src="https://gist.github.com/dustincys/6ea8484ed0394eb04db8.js"></script>

- 改预览界面颜色，修改显示公式编号等在下面的文件中：

	/util/markup.py

<script src="https://gist.github.com/dustincys/ad0c571edf3e630e08cc.js"></script>
- 改编辑器背景为黑色在下面的文件中：

	/gui/editor.py

	只需要在下面的函数中添加两行代码：

{% highlight python linenos %}
def __init__(self, day_text_view, undo_redo_manager):
	self.day_text_view = day_text_view self.day_text_buffer = t2t_highlight.get_highlight_buffer()
	self.day_text_view.set_buffer(self.day_text_buffer)
	self.day_text_view.modify_base(gtk.STATE_NORMAL, gtk.gdk.color_parse('black'))
	self.day_text_view.modify_text(gtk.STATE_NORMAL, gtk.gdk.color_parse('white'))
{% endhighlight %}

也可以直接用书呆修改好的：[下载地址](https://github.com/dustincys/rednotebook)。

## Newsbeuter

### 软件截图
<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pPLGSxB1EwSVBe4Xc2mfCEJ8Ap9ue3HuSwgK7E543O_IQ3od7nouwNValZB8GWlfZpFbudr9coDPsUbrRphVgqOxWHlJiJjkdZcf_qwtcSkhaXq04H-89v0R_oEvxxXn0hYCWNA-EN_rYQuTOsV0-bA/newsbeuter.png" title="newsbeuter"><img src="https://2s66lw.bl3301.livefilestore.com/y2pPLGSxB1EwSVBe4Xc2mfCEJ8Ap9ue3HuSwgK7E543O_IQ3od7nouwNValZB8GWlfZpFbudr9coDPsUbrRphVgqOxWHlJiJjkdZcf_qwtcSkhaXq04H-89v0R_oEvxxXn0hYCWNA-EN_rYQuTOsV0-bA/newsbeuter.png" alt="newsbeuter" /></a>

### 设置方法
生物信息学相关的xml文件[下载地址](https://gist.github.com/dustincys/0eebb15c7891b4b50936)

## Okular

### 软件截图
<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pHJunrSvKSsym6f9i5xigmyBP0AUsf3P08ASBIe6-V5rIosqpqxPwCRnywWqWcRC6qS2GPYymcL_MPVyDHJgP6bwP_vwwrX0nWf2FO4BSkw-qcj761hKWVh3XUuYvuHTz3yULuaKgdkCRvEew5KSCrnWiHd1mQdbShS0Rg-dPdYo/okular.png" title="Okular"><img src="https://2s66lw.bl3301.livefilestore.com/y2pHJunrSvKSsym6f9i5xigmyBP0AUsf3P08ASBIe6-V5rIosqpqxPwCRnywWqWcRC6qS2GPYymcL_MPVyDHJgP6bwP_vwwrX0nWf2FO4BSkw-qcj761hKWVh3XUuYvuHTz3yULuaKgdkCRvEew5KSCrnWiHd1mQdbShS0Rg-dPdYo/okular.png" alt="Okular" /></a>

### 设置方法

在菜单中的改变颜色设置改变纸张颜色，在注释选项中改变注释颜色。

## Firefox 
推荐zotero插件、Stylish插件。
### 软件截图
<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pvy0Pae81GlyW08y5SbpiwWdE2zvuR8EkVPujLiZxBnWFb3hIWZiyhd3ng4mcdFYaw_TCo0myU48pgO5UtjtG7KV1KDaVWLvMpsaJ5KK9D3BBqCmBHTEK-FoVCWcnTuRZD9WXuS1ATxJ8t-NOFOYQiDoASsB-DrJgqEKkvLoTjrI/firefox.png" title="Stylish"><img src="https://2s66lw.bl3301.livefilestore.com/y2pvy0Pae81GlyW08y5SbpiwWdE2zvuR8EkVPujLiZxBnWFb3hIWZiyhd3ng4mcdFYaw_TCo0myU48pgO5UtjtG7KV1KDaVWLvMpsaJ5KK9D3BBqCmBHTEK-FoVCWcnTuRZD9WXuS1ATxJ8t-NOFOYQiDoASsB-DrJgqEKkvLoTjrI/firefox.png" alt="Stylish" /></a>

## 毕业论文模板 
哈工大PlutoThesis模板XeLaTeX版本，这个应该是此时[唯一一个完美的版本](http://yanshuo.name/PlutoThesis/)（xelatex版）。


