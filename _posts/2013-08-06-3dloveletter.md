---
layout: post
category :  学术
matheq: yes
recentvisitors: yes
comments: yes
share: yes
title: 立体情书
tags : [math, r]
---


>**传闻，法国著名数学家笛卡尔曾经流落到瑞典，邂逅瑞典公主克里斯蒂娜（Kristina），并成为了公主的数学老师。两人萌生爱意。国王知道后，强行拆散他们，并且没收了之后笛卡尔写给公主的所有信件。后来，笛卡尔染上黑死病，临死前给公主寄去了最后一封信，信中只写着一行字：\\(r=a(1-\\sin \\theta)\\)。国王和大臣们都看不懂这是什么意思，只好交还给公主。公主在纸上建立了极坐标系，用笔在上面描下方程的点，看到了方程所表示的心脏线，理解了笛卡尔对自己的深深爱意。  
>在历史上，笛卡尔和克里斯蒂娜的确有过交情。但笛卡尔是1649年10月4日应克里斯蒂娜邀请才来到瑞典，而当时克里斯蒂娜已成为了瑞典女王。笛卡尔与克里斯蒂娜谈论的主要是哲学问题而不是数学。有资料记载，由于克里斯蒂娜女王时间安排很紧，笛卡尔只能在早晨五点与她探讨哲学。笛卡尔真正的死因是因天气寒冷加上过度操劳患上的肺炎，而不是黑死病**  
>————wiki


时光荏苒，岁月如梭。  
笛卡尔死后300年，书呆我也借用大师之心形线写一封立体情书。


####立体情书
<img src="http://i.imgur.com/CkNRhNC.gif" >

####代码

{% highlight r %}
require(rgl)
beta<-matrix(seq(0, 2*pi, len=50),50,50)
r<-16*sin(t(beta/2))^3
x<-r*sin(beta)
y<-r*cos(beta)*abs(cos(beta))*0.5
z<-13*cos(t(beta/2))-5*cos(2*t(beta/2))-2*cos(3*t(beta/2))-cos(4*t(beta/2)) 
open3d()
persp3d(x, y, z, ylim=c(max(y)*2,min(y)*2),col="red",alpha=0.8)
persp3d(x-5, y-5, z-1, ylim=c(max(y)*2,min(y)*2),col="hotpink",alpha=0.9,add=TRUE)
text3d(0, y =10, z = -5, texts="I love you",col="red")
text3d(0, y =-10, z = -5, texts="I love you",col="hotpink")
movie3d( spin3d(), duration=5 )
{% endhighlight %}


####参考

- [wiki 笛卡尔](http://zh.wikipedia.org/wiki/%E7%AC%9B%E5%8D%A1%E5%B0%94)
- [用R绘制情人节的礼物](http://cos.name/2012/02/valentines-gift-by-using-r/)


