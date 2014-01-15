---
layout: post 
category : WEB
title: 剪不断、理还乱
comments: yes
share: no
tags : [CSS,评论]
---

网站如人，有的漂亮，有的丑陋；有的高雅，有的庸姿俗粉；有的时尚，有的老土。
举个例子，该[网页](http://aquaraile.fr/en/)，字体、颜色、布局完美的烘托了其高端、大气、上档次。

书呆一俗人，一心追求真、善、美，于是博客CSS改来改去，剪不断，离还乱。
改来改去，恍然发现，问题不是“增加”多少功能、效果，而是应该“去除”多少效果和功能。
关于多说评论的CSS，看来看去才发现与该博客的主题不符的地方在于头像的圆角，直角头像才显得更加清晰，直接。

{% highlight css linenos %}
#ds-reset .ds-avatar img{
	-webkit-border-radius: 0px;
	border-rdius: 0px;
}
{% endhighlight %}

关于多说，我这里要多说两句，缺点和优点都有。
首先是最后面的“多说”这个脚注，看起来甚是突兀，另一个就是“盖楼模式下”第一个孩子评论没有与1楼的评论内容对齐，由于1楼的头像是50px\*50px，而孩子评论是30px\*30px，这样看起来就不协调。
似乎唯一的解就是把孩子评论的头像大小调整与1楼评论相同，然后缩进增加20px。

{% highlight css linenos %}
#ds-thread .ds-powered-by{
display: none!important;
}
#ds-thread #ds-reset ul.ds-children .ds-post-self {
padding-left: 12px;
}
#ds-thread #ds-reset ul.ds-children .ds-avatar img {
width: 50px;
height: 50px;
}
#ds-thread #ds-reset ul.ds-children {
margin-left: 60px;
}
#ds-thread #ds-reset ul.ds-children .ds-comment-body {
padding-left: 60px;
}
{% endhighlight %}

调来调去，很无聊，很烦。
没耐心也许是件好事，没耐心就不断地想去尝试新事物，找刺激。
于是，书呆发现一些有意思的东西：

- [codepen](http://codepen.io)
- [particleslider](http://particleslider.com)

用particleslider做出来的网页，效果很绚。
<iframe src="http://codepen.io/EsambinoHsieh/full/ELGev" width="800" height="400">
</iframe>

这也许就是做网站的乐趣。

>最后介绍下我的博客的评论秘籍和翻篇秘籍：  
>1, 多说评论可发布图片评论，就在评论框评论如下格式即可：
>{% highlight html linenos %}
><img src="图片路径"/>
>{% endhighlight %}  
>2，可以用键盘中的左右键来切换上一篇或者下一篇博客。
>该功能是该主题的原[作者](http://yihui.name)所作。
