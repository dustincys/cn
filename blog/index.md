---
title: 博客
layout: page
matheq: yes
toc: yes
---

“牢骚太盛防肠断”，不如寄托在这里。
岁月流淌，也许许多年后翻起曾经写过的文字，会想起当年的美好。
借一众人传颂的金句，

> 我们三十岁的时候悲伤二十岁已经不再回来。我们五十岁的年纪怀念三十岁的生日又多么美好。当我们九十九岁的时候，想到这一生的岁月如此安然度过，可能快乐得如同一个没被抓到的贼一般嘿嘿偷笑。岁月极美，在于它必然的流逝。春花、秋月、夏日、冬雪。相信生活和时间。
> 	—————— 三毛《岁月》


<ul class="listing">
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  {% if year != y %}
    {% assign year = y %}
    <h3 id="{{ y }}" class="listing-seperator">{{ y }}</h3>
  {% endif %}
  <li class="listing-item">
<div class="item">
   <div class="date" > <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time></div>
    <div class="title" > <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></div>
</div>
  </li>
{% endfor %}
</ul>

