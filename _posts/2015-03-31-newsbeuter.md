---
layout: post 
category: 学术
title: 书呆使用rss
matheq: no
comments: yes
tags: [rss, newsbeuter, 大杀器]
share: yes
toc: no

---

书呆就一直搞不懂[图书馆网站](http://202.118.225.131/database/mn/new)里乱七八糟，横七竖八的各式各样数据库应该怎么用的。
看到这么乱的东西，头疼。不如直接谷歌学术，搜到什么就下载什么。
但用着电脑天天搜来搜去慢慢就烦了，最新的文献很多漏掉半年多才看到，结果是忙了半年才发现原来是重复造车轮子。
我有一阵在想：数据如此地爆发增长，社会节奏这么快，作为一计算机专业书呆，怎样才能高效地使用计算机从而使其促进信息即时获取和利用？

为了能够获取最新信息，书呆使用雷鸟订阅了实验室公共推荐的[RSS列表](https://gist.github.com/dustincys/0eebb15c7891b4b50936)。 
于是就这么一年过去了，刚开始我还能忍住，到了现在实在是忍无可忍。
首先，这个雷鸟信息提示，每天从早到晚多的时候蹦出来100多个未读信息，如果点开一条一条看吧，感兴趣的文章很少，是浪费时间；
不点开看吧，有用的文章就错过了。

<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2p3nPjOnVGzb7xkySSvPmF9CeGsLxryKY3GHZf0a3F4tG1Du14oVOG9R2xNu0y5p3xvypb3cH2z4_vkO6IRTAavJhUphUbWfkSed6IzsiUOctrVhyesImj-5W6sVNKH9k5ht_Rn-9QJEJ-mifbADst7Q/thunderhint.png" title="雷鸟信息提示"><img src="https://2s66lw.bl3301.livefilestore.com/y2p3nPjOnVGzb7xkySSvPmF9CeGsLxryKY3GHZf0a3F4tG1Du14oVOG9R2xNu0y5p3xvypb3cH2z4_vkO6IRTAavJhUphUbWfkSed6IzsiUOctrVhyesImj-5W6sVNKH9k5ht_Rn-9QJEJ-mifbADst7Q/thunderhint.png" alt="雷鸟信息提示" /></a>

另外，如下图雷鸟界面所示，一年时间差不多，“Bioinformatics” 目录中积累900多个未读，有的还积累了1000多个，一条一条读要读到猴年马月？

<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pwg3jZbzYUGes5pXEb6aNYyAnwCVwQuzkHUeYgnHqrVr31i0fy7ANHQGK3sfuTzJq_jr6JlyM37SzO1EuBZ49dlAhyfbCCCqui0eBOe7A_Jf1NJZRn3RLguiEhEofqdPKe9MXWYyU4s4cQThF_tsQIQ/thunderbird.png" title="雷鸟界面"><img src="https://2s66lw.bl3301.livefilestore.com/y2pwg3jZbzYUGes5pXEb6aNYyAnwCVwQuzkHUeYgnHqrVr31i0fy7ANHQGK3sfuTzJq_jr6JlyM37SzO1EuBZ49dlAhyfbCCCqui0eBOe7A_Jf1NJZRn3RLguiEhEofqdPKe9MXWYyU4s4cQThF_tsQIQ/thunderbird.png" alt="雷鸟界面" /></a>

这怎么能是计算机专业书呆所能忍受？
于是[newsbeuter](http://www.newsbeuter.org/ "newsbeuter")大杀器横空出世！
这是一种宝刀屠龙，杀敌如麻，歇斯底里，快意恩仇的感觉！！！
newsbeuter是个终端用户接口的软件，这货即优雅又精湛，其划时代的意义足够与[mutt](http://www.ctex.org/documents/shredder/comp.html "mutt")之类强大计算机工具相媲美。
有一些人士称之为[rss阅读器里的mutt](https://news.ycombinator.com/item?id=8326813)。

<a class="fancybox" rel="gallery1" href="https://2s66lw.bl3301.livefilestore.com/y2pPLGSxB1EwSVBe4Xc2mfCEJ8Ap9ue3HuSwgK7E543O_IQ3od7nouwNValZB8GWlfZpFbudr9coDPsUbrRphVgqOxWHlJiJjkdZcf_qwtcSkhaXq04H-89v0R_oEvxxXn0hYCWNA-EN_rYQuTOsV0-bA/newsbeuter.png" title="newsbeuter界面"><img src="https://2s66lw.bl3301.livefilestore.com/y2pPLGSxB1EwSVBe4Xc2mfCEJ8Ap9ue3HuSwgK7E543O_IQ3od7nouwNValZB8GWlfZpFbudr9coDPsUbrRphVgqOxWHlJiJjkdZcf_qwtcSkhaXq04H-89v0R_oEvxxXn0hYCWNA-EN_rYQuTOsV0-bA/newsbeuter.png" alt="newsbeuter界面" /></a>

现在书呆可以：

1.	随心所欲定义复杂的过滤条件并且保存为模板。
2.	自定义标签
3.	批量操作
4.	保存
5.	自动清除过时的信息
6.	快捷键绑定宏配置，例如执行打开浏览器并且保存
5.	可以将文章通过管道传送到命令行

尤其是最后一条功能，可以通过mutt发邮件，甚至可以实现文献实时挖掘。 
这个大杀器的另一大优点是可以用户自定义配置，书呆的vim式newsbeuter配置文件`~/.newsbeuter/config`如下：

	# filter------------------------------\{\{\{
	define-filter "sequencing call" title=~"sequencing" or title=~"call"
	define-filter "network software" title=~"network" or title=~"software"
	#--- \}\}\}

	# general behavior --------------------\{\{\{
	auto-reload yes
	browser firefox
	cleanup-on-quit yes
	save-path ~/.newsbeuter/GOOD/
	text-width 72 
	notify-always yes
	notify-format "newsbeuter: %n unread articles within %f unread feeds"
	notify-program notify-send
	notify-xterm yes
	notify-screen yes

	datetime-format "%D"
	bookmark-interactive yes
	display-article-progress yes
	goto-first-unread yes
	goto-next-feed no
	keep-articles-days 30 

	#--- \}\}\}

	# vim style binding ---------------------------------------------\{\{\{
	bind-key j down
	bind-key k up
	bind-key h left
	bind-key l right 
	bind-key m toggle-show-read-feeds
	# ------\}\}\}

	# hide articles matching: ---------------------------------------------\{\{\{
	ignore-article "*" "title =~ \"Sponsor\""
	ignore-article "*" "title =~ \"Advertisement\""
	ignore-mode "display"
	# ------\}\}\}

