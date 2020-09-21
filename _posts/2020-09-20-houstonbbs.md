---
layout: post
category: technology
title: 两只爬虫
matheq: yes
comments: yes
tags: [爬虫, 烦恼]
share: yes
toc: no
---

有些事是想不明白的，想不明白不是烦恼的起源，而是把这些信息传递给你的渠道。
小时候没有电脑，没有网络，只有电视，每天看看动画片，觉得生活很快乐，很美好。
现在有了网络，什么电视剧、动画片随便看，反而常常失眠。
只觉得被网络中五光十色的信息奴役。
或许只有高高在上的神，能够一眼看便所有的真真假假。
你所在意的，烦恼的，不安的，喜爱的，讨厌的一切，在看得明白的神看来，应该都是“让人可发一笑”。
当然，一切都是时间问题。
再过100年你所面临的烦恼还有意义么，再过 $n\uparrow\uparrow\uparrow n\ldots n$ 年，整个宇宙膨胀、冷却到所有的恒星能量消耗殆尽，宇宙中的化学反应都慢到极点，宇宙中可能需要几百万年才能产生一个想法，最终到一切物质和意识都结束，包括你所有的烦恼。

有点跑题，怎么能缩短烦恼呢？自动化获取、过滤信息是一种手段。
这样最好整个破旧小笔记本电脑或者树莓派，或者购买个服务器什么的都可以，定时运行爬虫爬爬信息发到邮箱，手机上弄个邮箱大师之类，能够语音播报更好，这样仿佛弄了一个永远不会累秘书帮你办这些烦恼的事。

- 第一只：休斯顿BBS(https://www.houstonbbs.com/)

对于留学狗来说，主要需求是想买个旧车旧显示器什么的，懒得天天费时间刷。
上代码：

```python
# coding: utf8
import scrapy
import re
import os
import pickle
import subprocess
from collections import deque
from bbsSpider.items import BbsspiderItem
from bbsSpider import settings


class HoustonbbsSpider(scrapy.Spider):
    name = "houstonbbs"

    def start_requests(self):
        urls = [
            'https://www.houstonbbs.com/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        cacheLocal = settings.HOUSTONBBS_CACHE_LOCAL

        recentActs = response.css("section.items ul.even_odd_parent")[1]
        eventTexts = recentActs.css("ul li a::text").getall()
        eventObjs = recentActs.css("ul li").getall()
        hrefs = [re.search("(?<=href=\").+?(?=\")", eventText).group() for eventText in eventObjs]
        dataAfters = [re.search("(?<=data-after=\").+?(?=\")", eventText).group() for eventText in eventObjs]

        try:
            if os.path.getsize(cacheLocal) > 0:
                oldsQueue = pickle.load(open(cacheLocal, 'rb'))
            else:
                oldsQueue = deque(maxlen = 20)
        except:
            oldsQueue = deque(maxlen = 20)

        eventsQueue = deque(maxlen = 20)
        for dataAfter, href, eventText in zip(dataAfters, hrefs, eventTexts):
            urlFull = "https://www.houstonbbs.com{0}".format(href)

            cacheItem = "{0}\n{1}\n{2}\n\n".format(dataAfter, urlFull, eventText)
            if cacheItem not in oldsQueue:
                yield scrapy.Request(url=urlFull, meta={"dataAfter": dataAfter, "urlFull": urlFull, "eventText": eventText}, callback=self.detail_parse)

            eventsQueue.append(cacheItem)
        pickle.dump(eventsQueue, open(cacheLocal, 'wb'))

    def detail_parse(self, response):
        categoryList = response.css("header.content_header nav.breadcrumb a::text").getall()
        if "生活资讯" in categoryList or "跳蚤" in categoryList:
            newsItem = BbsspiderItem()
            newsItem['date'] = response.meta["dataAfter"]
            newsItem['url'] = response.meta["urlFull"]
            newsItem['title'] = response.meta["eventText"]


            articleUserNames = response.css("article header a::text").getall()
            articleUserCities = response.css("article header span.city::text").getall()
            articleUserResponseTime = response.css("article header span.time::text").getall()

            articleUserContent = []
            allArticleContent = response.css("div.forum_post article div.article_content")
            for artC in allArticleContent:
                tempac = artC.css("div.article_content::text").getall()
                tempac = [item.strip() for item in tempac]
                tempac = re.sub('\n+', '\n', "\n".join(tempac)).strip("\n")
                articleUserContent.append(tempac)

            content = ""
            for un, uc, ur, auc in zip(articleUserNames,
                                       articleUserCities,
                                       articleUserResponseTime,
                                       articleUserContent):
                content = "{0}\n__________________\n{1}  \t{2}  \t{3}\n\n{4}\n\n".format(content, un, uc, ur, auc)

            newsItem['content'] = content

            yield newsItem
```

- 第二只，纪念币发行(http://www.pbc.gov.cn/huobijinyinju/)

主要需求，弄点小礼物给朋友们，且这个网站式非静态的，且没有RSS订阅。

上代码：

```python
# -*- coding: utf-8 -*-
import time
from datetime import date
import re
import scrapy
import execjs
import requests
from scrapy.http import HtmlResponse
from urllib.parse import urljoin
import sys
import os
import pickle
from collections import deque
from CGSBSpider.items import CgsbspiderItem
from CGSBSpider import settings


class CgsbSpider(scrapy.Spider):
    name = 'cgsb'
    allowed_domains = ['www.pbc.gov.cn']
    start_urls = ['http://www.pbc.gov.cn/huobijinyinju/147948/147964/index.html', \
                  'http://www.pbc.gov.cn/huobijinyinju/147948/147966/index.html']

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, self.parse)

    def parse(self, response):

        cacheLocal = settings.PBC_CACHE_LOCAL

        try:
            if os.path.getsize(cacheLocal) > 0:
                oldsQueue = pickle.load(open(cacheLocal, 'rb'))
            else:
                oldsQueue = deque(maxlen = 100)
        except:
            oldsQueue = deque(maxlen = 100)

        s = requests.session()
        html = s.get(response.url).text
        js = re.findall(r'<script type="text/javascript">([\w\W]*)</script>', html)[0]
        js = re.sub(r'atob\(', 'window["atob"](', js)
        new_js = 'function get_url(){ var window = {};' + js + 'return window["location"];}'
        ctx = execjs.compile(new_js)
        res = ctx.call('get_url')
        real_url = urljoin(response.url, res)

        try:
            subResponse = HtmlResponse(url=real_url,
                                    body=s.get(real_url).content.decode('utf8'),
                                    encoding='utf-8')
        except:
            yield None

        divID = 22786
        if "147964" in response.url:
            divID = 22786
        else:
            divID = 23370

        targetDateTb = subResponse.css("html body div.mainw950 table tbody tr td table tbody tr td div#r_con.column div#{}.portlet div div table tbody tr td table tbody tr td span::text".format(divID)).extract()
        targetHrefTb = subResponse.css("html body div.mainw950 table tbody tr td table tbody tr td div#r_con.column div#{}.portlet div div table tbody tr td table tbody tr td font.newslist_style a::attr(href)".format(divID)).getall()
        targetTitleTb = subResponse.css("html body div.mainw950 table tbody tr td table tbody tr td div#r_con.column div#{}.portlet div div table tbody tr td table tbody tr td font.newslist_style a::attr(title)".format(divID)).getall()

        isNews = False
        for tempDate, tempHref, tempTitle in zip(targetDateTb, targetHrefTb, targetTitleTb):

            tempDateList = tempDate.split("-")

            tempDt = date(int(tempDateList[0]), int(tempDateList[1]), int(tempDateList[2]))
            todayDt = date.today()
            deltaDt = todayDt - tempDt

            cacheItem = "{0}\n{1}\n".format(tempDate, tempTitle)

            if deltaDt.days > 60 or cacheItem in oldsQueue:
                self.logger.info("omit:")
                self.logger.info(tempDate)
                self.logger.info(tempHref)
                continue
            else:
                isNews = True

                self.logger.info("crawling:")
                self.logger.info(tempDate)
                self.logger.info(tempHref)

                newsItem = CgsbspiderItem()
                newsItem['date'] = tempDate
                newsItem['url'] = "http://www.pbc.gov.cn"+tempHref
                newsItem['title'] = tempTitle

                try:
                    newsItem = self.sub_parse(newsItem)
                    oldsQueue.append(cacheItem)
                except:
                    next

                yield newsItem

        if isNews:
            pickle.dump(oldsQueue, open(cacheLocal, 'wb'))

    def sub_parse(self, item):

        s = requests.session()
        html = s.get(item['url']).text
        js = re.findall(r'<script type="text/javascript">([\w\W]*)</script>', html)[0]
        js = re.sub(r'atob\(', 'window["atob"](', js)
        new_js = 'function get_url(){ var window = {};' + js + 'return window["location"];}'
        ctx = execjs.compile(new_js)
        res = ctx.call('get_url')
        real_url = urljoin(item['url'], res)

        subResponse = HtmlResponse(url=real_url,
                                body=s.get(real_url).content.decode('utf8'),
                                encoding='utf-8')

        targetTextTb = subResponse.css("html body div.mainw950 div#pre.pre.column div#22861.portlet div table tbody tr td table tbody tr td table tbody tr td.content div#zoom p::text").getall()

        item['content'] = '\n'.join(targetTextTb)

        return item
```
