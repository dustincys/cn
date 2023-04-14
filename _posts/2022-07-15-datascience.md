---
layout: post
category: technology
title: 数据科学杂谈之四--数据存档
matheq: no
comments: yes
tags: [数据科学, emacs, org, org-roam, org-protocal, 数据科学杂谈]
share: yes
toc: no
---

有舍才有得。
生活就是这样，谁都没办法确保每一个工程都成功，谁都没办法确保做的每一个决定都正确。
谁都不得不舍弃，奔向下一个目标。

如果一个工程项目完结了，如何高效、可靠、经济地保存原始数据？
很简单，抓住这几个要点就可以。
高效：需要将工程项目的合作者，各种完成情况，以及重要的信息与工程的原始数据一起归档。
可靠：需要将工程的数据和对应md5sum校验码一起归档。
经济：不要将中间数据、冗余数据归档。
这个客观规律最终由人大脑结构决定的，因为人的历史记忆会逐渐模糊，所以任何需要大脑记忆的事，时间久了都不可靠。
有些大侠不相信客观规律，就要逆向行驶，最终结果就是把自己整得越来越累。

以上，可通过org-protocal和org-capture来设置。这里有些极端小伙伴喜欢org-roam，也可以。
设置几个capture模板可以达到在任意位置把记录信息只捕获到当前工程的`README.org`中。
```lisp
(setq org-capture-templates
        '(("c" "Collaborator" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh info")) "/README.org")) "Collaborator")
           "- %^{Collaborator}"
           :empty-lines-after 1
           :empty-lines-before 1)
          ("d" "Project type" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh info")) "/README.org")) "Project type")
           "- %^{Project type}\n"
           :empty-lines-after 1
           :empty-lines-before 1)
          ("n" "Note" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh info")) "/README.org")) "Note")
           "* %U: %^{Add note}\n%?In file: %F\n#+BEGIN_QUOTE\n%i#+END_QUOTE"
           :empty-lines-after 1
           :empty-lines-before 1)
          ("p" "Plan" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh info")) "/README.org")) "Plan")
           "* TODO %^{Add todo item}\n%?In file: %F\n#+BEGIN_QUOTE\n%i#+END_QUOTE"
           :empty-lines-after 1
           :empty-lines-before 1)
          ("F" "File or folder annotation" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh info")) "/README.org")) "File or folder annotation")
           "%(set-frame-name \"capture\")* %?%(if (f-file-p \"%:link\") \"File: \" \"Folder: \")%(f-filename \"%:link\")\n:PROPERTIES:\n:PATH: %(f-dirname \"%:link\")\n:END:\n- Note taken on %U \\\\\ \n  %^{Add note}"
           :empty-lines-after 1
           :empty-lines-before 1)
          ))
```
其中`projectJump.sh`为[上一篇](https://yanshuo.site/cn/2022/05/datascience/)中的跳转脚本。
ranger中设置：
```shell
map ,fan shell -w emacsclient -t -s tmux:$(tmux display -p '#S-#I') -a '' "org-protocol://capture?template=F&url=$(realpath %s)"
```
即可任性地、随意地、潇洒地对工程中文件进行各种姿势的注释。
当然也可以设置当前工程的org-files路径：
```lisp
(setq org-agenda-custom-commands
  '(("p" "This project todos" alltodo ""
      ((org-agenda-files
        (list (concat
        (file-name-as-directory
          (string-trim
          (shell-command-to-string "~/bin/projectJump.sh info")))
          "README.org")))))))
```
这样就允许在工程内部进行分布式进度查看和管理。
同样可以设置ranger命令
```shell
map ,pat shell -w emacsclient -t -s tmux:$(tmux display -p '#S-#I') -a '' --eval "(org-batch-agenda \"p\")"
```
进行任性地、随意地、潇洒地对工程中文件进行各种姿势的查看进度。
其他用于保存工程数据的命令：
```shell
# md5
map ,md5 console shell -f find . -type f ! -iname "*md5sum.txt" | xargs -n 1 md5sum > md5sum.txt
map ,cmd5 shell -f md5sum -c md5sum.txt > check_md5sum.txt
# file info
map ,fsl shell -w find $(pwd) -type f -printf "%%s\t%%p\n" | sort -n | numfmt --to=iec-i --format='%10f' | less
```
