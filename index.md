---
title: 博文目录
layout: page
matheq: yes
---

<ul class="listing">
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  {% if year != y %}
    {% assign year = y %}
    <li class="listing-seperator">{{ y }}</li>
  {% endif %}
  <li class="listing-item">
<div class="item">
   <div class="date" > <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time></div>
    <div class="title" > <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></div>
</div>
  </li>
{% endfor %}
</ul>

