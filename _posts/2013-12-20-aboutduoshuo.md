---
layout: post 
category : Web
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
#ds-thread .ds-powered-by{display:none!important;}
#ds-reset .ds-avatar img{
	-webkit-border-radius: 0px;
	border-rdius: 0px;
}
{% endhighlight %}

没耐心也许是件好事，没耐心就不断地想去尝试新事物，找刺激。
书呆发现一些有意思的东西：
- [codepen](http://codepen.io)
- [particleslider](http://particleslider.com)
看到particleslider、codepen如下的魔力之后,就不淡定了……
<p data-height="268" data-theme-id="0" data-slug-hash="ELGev" data-user="EsambinoHsieh" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/EsambinoHsieh/pen/ELGev'>Tribute to Rorschach</a> by Wei-Cheng Hsieh (<a href='http://codepen.io/EsambinoHsieh'>@EsambinoHsieh</a>) on <a href='http://codepen.io'>CodePen</a></p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

这也许就是做网站的乐趣。

>最后介绍下我的博客的评论秘籍和翻篇秘籍：  
>1, 多说评论可发布图片评论，就在评论框评论如下格式即可：
>{% highlight html linenos %}
><img src="图片路径"/>
>{% endhighlight %}  
>2，可以用键盘中的左右键来切换上一篇或者下一篇博客。
>该功能是该主题的原[作者](http://yihui.name)所作。
