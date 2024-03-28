---
layout: post
category: technology
title: 南通小学毕业数学试卷第30题的数学模型
matheq: yes
comments: yes
tags: [小学, 数学]
share: yes
toc: no
---


<a class="fancybox" rel="gallery1" href="https://raw.githubusercontent.com/dustincys/cn/assets/nantong.png" title="南通小学试卷"><img src="https://raw.githubusercontent.com/dustincys/cn/assets/nantong.png" alt="南通小学试卷" /></a>


推广这个题目的条件，设被绕圈的大圆半径为$$a$$，内小圆半径为$$b$$，外圆半径为$$c$$，只有一个限定条件：$$a > b$$。

那么内小圆和外圆不转动的情况下，顺时针绕大圆公转一周后，按照相对运动原理，固定圆心，两圆其各自绕圆心相对转动一周。

在无滑动的情况下，内小圆和外圆的绕圆心转的圈数为外圆顺时针$$\frac{2*\pi*a}{2*\pi * c} = \frac{a}{c}$$，内小圆逆时针转动$$\frac{2*\pi * a}{2 * \pi * b} = \frac{a}{b}$$。
加上公转一周：外圆顺时针$$\frac{a}{c}+1$$，内小圆逆时针$$\frac{a}{b}-1$$。
若算上方向，两个圆的比值为$$-\frac{\frac{a}{c}+1}{\frac{a}{b}-1}$$。

