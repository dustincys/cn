---
layout: post 
category : Web
title: 剪不断、理还乱
comments: yes
share: no
tags : [CSS,评论]
---

网站如人，有的漂亮，有的丑陋；有的高雅，有的庸姿俗粉；有的时尚，有的老土。
如该[网页](http://aquaraile.fr/en/)，字体、颜色、布局完美的烘托了其高端、大气、上档次。

书呆一俗人，一心追求真、善、美，于是博客CSS改来改去，剪不断，离还乱。

{% highlight css linenos %}
#ds-thread .ds-powered-by{display:none!important;}
#ds-reset .ds-avatar img{
	-webkit-border-radius: 0px;
	border-rdius: 0px;
}
#ds-thread #ds-reset .ds-user-name  {
	font-size: 16px;
	line-height: 20px;
}
#ds-thread #ds-reset .ds-comment-body p {
	font-size: 16px;
	line-height: 20px;
}
.ds-post-self:hover .ds-avatar img{
	-webkit-transform-origin: topcenter;
	-moz-transform-origin: topcenter;
	-o-transform-origin: topcenter;
	transform-origin: topcenter;
	-webkit-animation-name: swing;
	-moz-animation-name: swing;
	-o-animation-name: swing;
	animation-name: swing;
}
@-webkit-keyframes swing {
	10%, 20%, 30%, 40%,50%, 60%, 70%, 80%, 90%,100% { -webkit-transform-origin: topcenter; }
	10%{ -webkit-transform: rotate(18deg);}
	20% { -webkit-transform: rotate(-16deg); }
	30%{-webkit-transform:rotate(14deg);}
	40% { -webkit-transform: rotate(-12deg); }
	50% { -webkit-transform: rotate(10deg); }
	60% { -webkit-transform: rotate(-8deg); }
	70% { -webkit-transform: rotate(6deg); }
	80% { -webkit-transform: rotate(-4deg); }
	90% { -webkit-transform: rotate(2deg); }
	100% { -webkit-transform: rotate(0deg); }
}
@-moz-keyframes swing {
	10%{ -moz-transform: rotate(18deg);}
	20% { -moz-transform: rotate(-16deg); }
	30%{-moz-transform:rotate(14deg);}
	40% { -moz-transform: rotate(-12deg); }
	50% { -moz-transform: rotate(10deg); }
	60% { -moz-transform: rotate(-8deg); }
	70% { -moz-transform: rotate(6deg); }
	80% { -moz-transform: rotate(-4deg); }
	90% { -moz-transform: rotate(2deg); }
	100% { -moz-transform: rotate(0deg); }
}
@-o-keyframes swing {
	10%{ -o-transform: rotate(18deg);}
	20% { -o-transform: rotate(-16deg); }
	30%{-o-transform:rotate(14deg);}
	40% { -o-transform: rotate(-12deg); }
	50% { -o-transform: rotate(10deg); }
	60% { -o-transform: rotate(-8deg); }
	70% { -o-transform: rotate(6deg); }
	80% { -o-transform: rotate(-4deg); }
	90% { -o-transform: rotate(2deg); }
	100% { -o-transform: rotate(0deg); }
}
@keyframes swing {
	10%{ transform: rotate(18deg);}
	20% { transform: rotate(-16deg); }
	30%{transform:rotate(14deg);}
	40% { transform: rotate(-12deg); }
	50% { transform: rotate(10deg); }
	60% { transform: rotate(-8deg); }
	70% { transform: rotate(6deg); }
	80% { transform: rotate(-4deg); }
	90% { transform: rotate(2deg); }
	100% { transform: rotate(0deg); }
}
#ds-reset .ds-avatar img{
		-webkit-animation-fill-mode: both;
		-moz-animation-fill-mode: both;
		-ms-animation-fill-mode: both;
		-o-animation-fill-mode: both;
		animation-fill-mode: both;
		-webkit-animation-duration: 0s;
		-moz-animation-duration: 0s;
		-ms-animation-duration: 0s;
		-o-animation-duration: 0s;
		animation-duration: 0s;
		-webkit-animation-duration: 1s;
		-moz-animation-duration: 1s;
		-ms-animation-duration: 1s;
		-o-animation-duration: 1s;
		animation-duration: 1s;
}
{% endhighlight %}

多说评论可发布图片评论，就在评论框评论如下格式即可：
{% highlight html linenos %}
<img src="图片路径"/>
{% endhighlight %}

另外，可以用键盘中的左右键来切换上一篇或者下一篇博客。
该功能是该主题的原[作者](http://yihui.name)所作。
