---
layout: post
category: technology
title: 数据科学杂谈之八--日程管理
matheq: no
comments: yes
tags: [数据科学杂谈, 日程管理]
share: yes
toc: no
---

> 如何多个工程并行进行，如何高效管理日程？如果凭着感觉走，容易掉沟里。不凭感觉走，
> 需要耗费大量脑细胞记各种路线。
> 实际上还有第三种，让老板雇一个秘书帮你。

相信所有带有工程的学科，一定强调鲁棒，高效，可重复。
所以有些坊间说法：
- [鸡蛋不要放在一个篮子里](https://yanshuo.site/cn/2020/10/datascience/)
- [程序员下班不爱关电脑](https://yanshuo.site/cn/2021/08/tmux/)
- [学霸喜欢记笔记](https://yanshuo.site/cn/2022/07/datascience/)

另一个坊间说法是用的“分布式日程管理”提高效率。
实现方法是在org-roam的[全局日程](https://yanshuo.site/cn/2023/03/org-roam/)基础上，
加一个工程日程函数：
```lisp
(defun +org-projectile-agenda()
    (interactive)
    (require 'magit)
    (if (file-exists-p (concat
                        (magit-toplevel)
                        "projectile.org"))
        (progn
          (advice-remove 'org-agenda  #'+org-agenda-files-update)
          (advice-remove 'org-todo-list  #'+org-agenda-files-update)
          (setq org-agenda-files (list
                                  (concat
                                   (magit-toplevel)
                                   "projectile.org")))
          (org-agenda)
          (advice-add 'org-agenda :before #'+org-agenda-files-update)
          (advice-add 'org-todo-list :before #'+org-agenda-files-update))()))
```
然后，世界就清净了。
