---
layout: page 
title: 软件工具推荐
comments: yes
toc: no
share: yes

---

> 这里推荐一些Linux系统下好用的工具和相应的设置方法。


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

## 哈工大PlutoThesis模板XeLaTeX版本

目前没人维护了（除了我？），这个应该是此时[唯一一个能用的版本](http://yanshuo.name/PlutoThesis/)（xelatex版）。


