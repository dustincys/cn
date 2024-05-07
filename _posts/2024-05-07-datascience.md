---
layout: post
category: technology
title: 数据科学杂谈之十一--瞬时捕捉
matheq: no
comments: yes
tags: [数据科学杂谈, org-mode]
share: yes
toc: no
---

在数据科学领域，数据的复杂性往往是不可避免的。正如文中所言，数据的复杂性恰恰体现了数据科学的存在意义。数据科学家常常需要面对数据清洗、质量控制、数据挖掘等一系列工作，甚至在项目接近尾声时，对数据的有效性仍然存在疑问。

在面对数据挖掘过程中的复杂情况时，一个良好的习惯是快速记录关键信息。就像文中提到的[ 自由博客系统之一--瞬时捕捉 ](https://dustincys.github.io/cn/2023/04/easyjekyll/)一样，这种记录方式有利于方便进行多任务并行处理，提高工作效率。

因此，在实践中，使用以下模板来捕捉关键信息是非常有用的：

```lisp
(setq org-capture-templates
             '(("c" "Collaborator" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Collaborator")
                "- %?"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("pC" "Collaborator protocol" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Collaborator")
                "%(set-frame-name \"capture\")- %?"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("d" "Project type" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Project type")
                "- %?"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("pD" "Project type protocol" item (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Project type")
                "%(set-frame-name \"capture\")- %?"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("n" "Note" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Note")
                "* %?    :%(string-trim (shell-command-to-string \"~/bin/projectJump.sh base\")):\n%U In file: [[file://%F::%(with-current-buffer (org-capture-get :original-buffer) (number-to-string (line-number-at-pos)))][%f]]\n#+BEGIN_SRC %(replace-regexp-in-string \"-mode\" \"\" (with-current-buffer (org-capture-get :original-buffer) (symbol-name major-mode)))\n%i#+END_SRC"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("p" "Plan about code" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Plan")
                "* TODO %?    :%(string-trim (shell-command-to-string \"~/bin/projectJump.sh base\")):\n%U In file: [[file://%F::%(with-current-buffer (org-capture-get :original-buffer) (number-to-string (line-number-at-pos)))][%f]]\n#+BEGIN_SRC %(replace-regexp-in-string \"-mode\" \"\" (with-current-buffer (org-capture-get :original-buffer) (symbol-name major-mode)))\n%i#+END_SRC"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("pP" "Plan protocol" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "Plan")
                "%(set-frame-name \"capture\")* TODO %?    :%(string-trim (shell-command-to-string \"~/bin/projectJump.sh base\")):"
                :empty-lines-after 1
                :empty-lines-before 1)
               ("pF" "File or folder annotation protocol" entry (file+headline (lambda () (concat (string-trim (shell-command-to-string "~/bin/projectJump.sh INFO")) "/README.org")) "File or folder annotation")
                "%(set-frame-name \"capture\")* %(if (f-file-p \"%:link\") \"File: \" \"Folder: \")[[file://%:link][%(f-filename \"%:link\")]]    :%(string-trim (shell-command-to-string \"~/bin/projectJump.sh base\")):\n- Note taken on %U \\\\\ \n  %?"
                :empty-lines-after 1
                :empty-lines-before 1)))
```
其中，
`(org-agenda nil "p")`的设置方法在[数据科学杂谈之八--日程管理](https://dustincys.github.io/cn/2023/04/datascience_agenda/)文中有描述。
```lisp
(string-trim (shell-command-to-string \"~/bin/projectJump.sh base\"))
```
为前文“[数据科学杂谈之五--奇异博士的传送门](https://dustincys.github.io/cn/2022/11/datascience/)”中描述的跳转方法。

除了一些常见的`org-protocol`之外，模板`pF`非常有用，例如其与文件管理器`ranger`结合，可对当前文件进行快速注释。
在`ranger`的配置文件`rc.conf`中，添加
```conf
map ,fan shell -w ~/bin/file_annotation_org.sh $(realpath %s)
```
而`file_annotation_org.sh`内容为：
```shell
emacsclient -t -u -q -s tmux:$(tmux display -p '#S-#I') -a '' "org-protocol://capture?template=pF&url=${1}"
```
此外，因为`lisp`具备无与伦比的强大扩展性，所以用户可以任意地定制和修改Emacs的各种行为。
例如，我喜欢在当前工程文件夹的任意位置，通过按`,pat`直接弹出当前工程的日程安排和待办事项。
然后，按`q`直接退出。
这样`ranger`的`rc.conf`中直接设置
```conf
map shell -w emacsclient -t -s tmux:$(tmux display -p '#S-#I') -a '' --eval "(progn (set-face-background 'default \"unspecified-bg\" (selected-frame)) (advice-add 'org-agenda-quit :after #'my-temporary-org-agenda-quit-hook) (org-agenda nil \"p\"))"
```
此处，
```lisp
(set-face-background 'default "unspecified-bg" (selected-frame))
```
用来去除新建的emacsclient的背景，因为我喜欢没有任何背景颜色。
而
```lisp
(advice-add 'org-agenda-quit :after #'my-temporary-org-agenda-quit-hook)
```
用来在退出`org-agenda`之前，添加一个钩子，用来删除emacsclient。
而这个挂在钩子上的函数能够自己把自己从钩子上卸下来：
```lisp
(defun my-temporary-org-agenda-quit-hook ()
    "Function to be run temporarily. remove whole frame"
    (delete-frame (selected-frame))
    (advice-remove 'org-agenda-quit #'my-temporary-org-agenda-quit-hook))
```

有了以上各种手段，诸位可以歇斯底里、快意恩仇、大杀四方！
