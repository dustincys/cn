---
layout: post
category: technology
title: 数据科学杂谈之十二--强AI背景下如何科学地科研？
matheq: no
comments: yes
tags: [注意力, 科研, 数据科学杂谈]
share: yes
toc: no
---


> 某个科研大咖要去看文献，每天都要手动去上网搜索，然后读摘要等等，判断哪些文献是感兴趣的文献等等。
> 如同去超市买食物，需要去超市 -> 挑哪些食物符合口味 -> 查看食物保质期 -> 购买 -> 做饭 -> 吃。
> 这个过程分散了注意力。
> 而节省注意力的办法是，让超市每天根据我们的口味把最新的食材都带到我们家里，做好食物放在桌子上，我们挑想吃的食物直接吃。
>
> 本文涉及到的代码在这里：[article-summarizer](https://github.com/dustincys/article-summarizer)  
> 本文涉及到的软件的录屏：
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=114239687626348&bvid=BV1dModYPE3c&cid=29113779352&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

强AI背景下，如何愉快地玩耍才能不泯然众人矣？
总所周知，“[Attention is all you need](https://proceedings.neurips.cc/文献_files/文献/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)”，所以注意力已经是个人最宝贵的资源，如何节省该资源需要先明确如下几个事实：

1. 强AI导致“信息海啸”
2. 流量经济导致“信息轰炸”
3. 海量信息稀释了个人的注意力

前文中提到，在强AI背景下，每个人的信息输入输出模式如同“[编码器](https://dustincys.github.io/cn/2024/03/my-GPT/)”，所以尽最大可能节省注意力是我们破局的关键。
个性化、精准地获取信息的方法，应具备的特征如下

1. 能够精准且自动化地获取信息
2. 能够对信息优先级排序
3. 能够批量地调用AI进行信息凝练
4. 能够方便地安排处理信息的日程

[elfeed](https://github.com/skeeto/elfeed)和[elfeed-score](https://github.com/sp1ff/elfeed-score)具备批量地获取主流科研杂志的feed，并设置排序方式。
而下一步需要对获取到的文献进行AI总结，总结的逻辑是，在更新elfeed之后加入hook:
```elisp
  (add-hook 'elfeed-update-init-hooks #'my-feed/summarize-highscore-entries)
```
然后，判定所有文献中，是否排序靠前，即score大于一定阈值，或者有"to-summarize"标签。
```javascript
  (defun my-feed/summarize-highscore-entries ()
    (let* ((all-entries
            (cl-loop for entry being the hash-values in elfeed-db-entries
                     collect entry))
           (high-entries
            (cl-loop for entry in all-entries
                     for score = (elfeed-score-scoring-get-score-from-entry entry)
                     for tags = (elfeed-entry-tags entry)
                     for has-summarized = (memq 'summarized tags)
                     for to-summarize = (memq 'to-summarize tags)
                     when (or (and score (> score 80) (not has-summarized))
                              to-summarize)
                     collect entry)))
      (when high-entries
        (my-feed/fetch-batch-articles high-entries))))
```
而这个重要性分数，可通过[elfeed-score](https://github.com/sp1ff/elfeed-score)个性化地获取：
我设置的规则如下，首先获得目标杂志，并设置标签：
```org
* Paper                                                              :elfeed:
** Nature                                                           :nature:
*** https://www.nature.com/nature.rss
*** Nature method                                           :method:
**** https://www.nature.com/nm.rss
*** Nature medicine                                              :medicine:
**** https://www.nature.com/nmeth.rss
*** Nature review cancer                                           :review:
**** http://www.nature.com/nrc/current_issue/rss
*** Nature cancer                                                  :cancer:
**** https://www.nature.com/natcancer.rss
*** Nature communications                                  :communications:
**** https://www.nature.com/ncomms.rss
** Science                                                        :science:
*** https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science
*** Science Immunology                                         :immunology:
**** https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=sciimmunol
*** Science Translational Medicine                               :medicine:
**** https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=stm
** Cell                                                                :cell:
*** https://www.cell.com/cell/inpress.rss
*** Cancer Cell                                                    :cancer:
**** https://www.cell.com/cancer-cell/inpress.rss
*** Immunity                                                     :immunity:
**** https://www.cell.com/immunity/inpress.rss
** Cancer Discovery                                       :cancer_discovery:
*** https://aacrjournals.org/rss/site_1000003/1000004.xml
** Cancer Research                                         :cancer_research:
*** https://aacrjournals.org/rss/site_1000011/1000008.xml
```
然后获得目标分数：
```elisp
((version 10)
 ("title"
  (:text "AI" :value 10 :type S)
  (:text "biology" :value 20 :type s)
  (:text "3d" :value 150 :type s)
  (:text "sequencing" :value 80 :type s)
  (:text "cancer" :value 80 :type s)
  (:text "tumor" :value 80 :type s)
  (:text "tumour" :value 80 :type s)
  (:text "antitumour" :value 80 :type s)
  (:text "antitumor" :value 80 :type s)
  (:text "cell" :value 20 :type s)
  (:text "immune" :value 50 :type s)
  (:text "immunotherapy" :value 100 :type s)
  (:text "seq" :value 10 :type s)
  (:text "tumor evolution" :value 160 :type s)
  (:text "tumor subclone" :value 160 :type s)
  (:text "tumor subclonal" :value 160 :type s)
  (:text "digital twin" :value 260 :type s)
  (:text "microenvironment" :value 80 :type s)
  (:text "tumor microenvironment" :value 80 :type s)
  (:text "author correction" :value -500 :type s)
  )
 ("content")
 ("title-or-content"
  (:text "spatial" :title-value 160 :content-value 80 :type s)
  (:text "visium" :title-value 80 :content-value 80 :type s)
  (:text "xenium" :title-value 80 :content-value 80 :type s)
  (:text "chromium" :title-value 80 :content-value 80 :type s)
  (:text "slide-seq" :title-value 80 :content-value 80 :type s)
  (:text "seqfish" :title-value 80 :content-value 80 :type s)
  (:text "merfish" :title-value 80 :content-value 80 :type s)
  (:text "geomx" :title-value 80 :content-value 80 :type s)
  (:text "cosmx" :title-value 80 :content-value 80 :type s))
 ("tag")
 ("authors"
  (:text "Author name you like" :value 200 :type w)
  )
 ("feed")
 ("link")
 ("udf")
 (mark -20)
 ("adjust-tags"))
```
如以上代码所示，可以自由地设置打分规则，例如感兴趣的关键词和作者，不同来源的杂志等。
然后对于所有重要的文献，获取其全文，这个获取过程需要绕一点弯。
因为主流的杂志都有一定反爬虫机制，且有一部分杂志的正文内容是由脚本动态生成，所以获取该正文内容需要采用的方案是无头浏览器，
```javascript
const browser = await firefox.launch({
    headless: true,
    firefoxUserPrefs: {
        "javascript.enabled": true,
        "permissions.default.image": 2,  // 禁止加载图片
        "network.http.redirection-limit": 32,  // 允许更多重定向
        "media.volume_scale": "0.0"            // 静音
    },
    args: [
        '--disable-gpu',
        '--disable-software-rasterizer'
    ]
});
```
需要对浏览器设置时区、以及随机窗口大小，用来模拟用户随机打开窗口，躲避反爬虫机制，且，这个过程需要串行
```javascript
for (const [index, url] of urls.entries()) {
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0'
    });
    await context.addInitScript(() => {
        Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
            value: function () {
                const result = Reflect.apply(this, this, arguments);
                result.timeZone = 'Asia/Shanghai';
                return result;
            }
        });
    });

    const page = await context.newPage();
    await page.setViewportSize({
        width: 1280 + Math.floor(Math.random() * 100),
        height: 800 + Math.floor(Math.random() * 100)
    });
    let article = null;
    try {
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 25000
        });
        await page.waitForSelector(getSafeSelector(), {
            state: 'attached',
            timeout: 15000
        });
        const dynamicHtml = await page.content();
        const dom = new JSDOM(dynamicHtml, {
            url: url
        });
        article = new Readability(dom.window.document).parse();
        if (!article) {
            results.push({
                order: index + 1,
                url,
                status: 'fail',
                title: '',
                content: '',
                excerpt: '',
                length: 0
            });
        } else {
            const cleanText = article.textContent
                .replace(/\u00a0/g, ' ')    // 替换 &nbsp;
                .replace(/\s+[\r\n]\s+/g, '\n')  // 清理多余换行
                .trim();

            results.push({
                order: index + 1,
                url,
                status: 'success',
                title: article.title,
                content: cleanText,
                excerpt: article.excerpt,
                length: cleanText.length
            });
        }
    } catch (error) {
        results.push({
            order: index + 1,
            url,
            status: 'error',
            title: '',
            content: '',
            excerpt: '',
            length: 0
        });
    } finally {
        await context.close();  // 关闭上下文释放资源
    }
}
} finally {
await browser.close();
}
```
而获取之后的正文需要去噪声，使用火狐开发的去除噪声工具[@mozilla/readability](https://github.com/mozilla/readability)来去除噪声。
然后需要使用OpenAI或DeepSeek API来并行获取所有文本的总结：
```javascript
async function createCompletion(articleText) {
    if (!articleText?.trim()) {
        return "";
    }

    try {
        const client = new OpenAI(
            {
                apiKey: process.env.APIKEY,
                baseURL: process.env.BASEURL,
            }
        );

        const completion = await client.chat.completions.create({
            model: process.env.MODEL,
            messages: [
                {
                    role: "system",
                    content: process.env.PROMPT,
                },
                {
                    role: "user",
                    content: articleText,
                },
            ],
        });

        return completion?.choices[0].message?.content?.trim() || "";
    } catch (error) {
        if (axios.default.isAxiosError(error) && error.response) {
            logger.error("Error getting completion:");
            logger.error(error.response.data.error?.message);
        } else {
            throw error;
        }
        process.exit(1);
    }
}
```
然后将返的AI总结写入elfeed，方案如下
```elisp
(defun my-feed/fetch-batch-articles (entries)
    "通过 Node.js 批量获取 URLS 全文内容，ENTRIES 为对应的原始条目列表"
    (let* ((temp-in-file (make-temp-file "elfeed-urls-"))
           (temp-out-file (make-temp-file "elfeed-results-"))
           (command (format "node path/to/fetch-articles.js %s %s" temp-in-file temp-out-file))
           (proc (start-process-shell-command "elfeed-fetch-batch" nil command)))
      ;; 写入输入文件
      (message "临时输入文件: %s" temp-in-file)
      (message "临时输出文件: %s" temp-out-file)
      (message "执行命令: %s" command)
      (with-temp-file temp-in-file
        (insert (mapconcat #'elfeed-entry-link entries "\n")))
      (set-process-plist proc (list 'temp-in-file temp-in-file
                                    'temp-out-file temp-out-file
                                    'entries entries))
      (set-process-sentinel
       proc
       (lambda (process event)
         (let ((temp-in-file (process-get process 'temp-in-file))
               (temp-out-file (process-get process 'temp-out-file))
               (entries (process-get process 'entries)))
           (message "进程哨兵触发！事件: %s" event)
           (when (eq (process-status process) 'exit)
             (message "检测到进程退出！开始处理结果...")
             (delete-file temp-in-file)
             (if (zerop (process-exit-status process))
                 (condition-case err
                     (let* ((json-data (json-read-file temp-out-file))
                            (result-dict (my-feed/parse-json-result json-data)))
                       (dolist (entry entries)
                         (let* ((url (elfeed-entry-link entry))
                                (summary (gethash url result-dict)))
                           (when (and summary (not (string-empty-p summary)))
                             (elfeed-tag-1 entry 'summarized)
                             (elfeed-untag-1 entry 'to-summarize)
                             (setf (elfeed-meta entry :summary) summary)
                             )))
                       (delete-file temp-out-file)
                       (message "内容更新完成！"))
                   (error (message "update summary 失败: %s" err)))
               (progn
                 (delete-file temp-out-file)
                 (message "Node.js 执行失败，错误码：%d" (process-exit-status process))))))))
      (let ((proc proc)
            (temp-in-file temp-in-file)
            (temp-out-file temp-out-file))
        (run-at-time 1800 nil
                     (lambda ()
                       (when (process-live-p proc)
                         (delete-process proc)
                         (delete-file temp-in-file)
                         (message "超时处理完成")))))))
```
其中需要将elfeed的entry写入总结：
```elisp
(defun my-feed/parse-json-result (json-data)
    "将 JSON 数据转换为 URL 到内容的哈希表"
    (let ((hash (make-hash-table :test 'equal)))
      (cl-loop for item across json-data do
               (let* ((url (alist-get 'url item))
                      (raw-summary (alist-get 'summary item))
                      (summary (if (or (null raw-summary)
                                       (string-empty-p raw-summary))
                                   ""
                                 raw-summary)))
                 (when url
                   (puthash url summary hash))))
      hash))
```
以上就完成了elfeed的精准信息获取、AI异步总结。

下一步，设置org-capture模板：
```elisp
("E" "Elfeed entry" entry
               (file+headline "path/to/target.org" "Elfeed")
               (function
                (lambda ()
                  (let* ((entry (elfeed-search-selected t))
                         (title (elfeed-entry-title entry))
                         (link (elfeed-entry-link entry))
                         (summary (elfeed-meta entry :summary)))
                    (format "* TODO %s :elfeed:WORK:\n[[%s][%s]]\n%s\n"
                            title link link summary))))
               :empty-lines 1)
```
这样就完成了自动化精准抓取文献、文献优先级个性化排序、异步AI总结、信息抓取和日程安排全流程开发。
