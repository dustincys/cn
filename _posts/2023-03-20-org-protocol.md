---
layout: post
category: technology
title: org-protocol 和 org-roam-protocol 配合使用
matheq: no
comments: yes
tags: [org-roam, org-protocol, org-roam-protocol, org-roam-capture-templates, org-capture-templates, org-roam-capture-ref-templates]
share: yes
toc: no
---

org-roam是一个笔记文本文件网。
于是乎，用户捕获内容的方式有如下两个：
1. 生成一个新文本文件，作为网中一个节点
2. 不生成新文件，将捕获内容插入到已有节点中

第一种，org-roam-protocol中已提供的方法，简单看一看就明白。
但第二种方式我想了好半天，真是“不识庐山真面目，只缘身在此山中！”
方法很简单，用org-roam的两个内部函数作为org-capture路径就可以了：
```lisp
("orp" "Org roam capture content" plain (file (lambda () (org-roam-node-file (org-roam-node-read))))
  "* %^{Content title}\nSource: %u [[%:link][%(transform-square-brackets-to-round-ones \"%:description\")]]\n#+BEGIN_QUOTE\n%i\n#+END_QUOTE"
:immediate-finish t)
("orL" "Org roam capture link" plain (file (lambda () (org-roam-node-file (org-roam-node-read))))
  "* %^{Content title}\nSource: %u [[%:link][%(transform-square-brackets-to-round-ones \"%:description\")]]\n"
  :immediate-finish t)
```

