---
layout: post
category: technology
title: 数据科学杂谈之二
matheq: no
comments: yes
tags: [数据科学, 工程]
share: yes
toc: no
---

[前篇]( https://dustincys.github.io/cn/2021/08/tmux/)中提到数据科学工程面临两个
困难：数据量大，处理复杂。
代码和数据混合的工程架构已经越来越无法处理大规模数据。
因为不同的模型、工具等等需要对参数进行反复试错，代码和数据耦合，无规则工程架构无法应对。
类似，要把一堆衣服、裤子、袜子等等分门别类放置到各个小箱子里。如果随手堆一堆，取
放方便，但你要找某一个特定的衣物则需要耗费大量时间。

为快速打开每个“小箱子”，即快速在工程内部跳转，可以用类似如下逻辑获取目标路径：

```sh

if git status &> /dev/null; then
    ProjectRoot=$(git rev-parse --show-toplevel)
    CodeDir=$ProjectRoot/Code
    ...
    
    case $1 in
        "code" )
            echo -n $CodeDir
        ;;
        ...
        "fzf" )
        targetFolder=$(find $ProjectRoot -type d | fzf)
            if [ -z $targetFolder ]; then
                echo -n $(pwd)
            else
                echo -n $targetFolder
            fi
        ;;
        * )
            echo -n $(pwd)
        ;;
```

然后在ranger的rc.conf中添加类似快捷键：

```
map gc eval from ranger.ext.spawn import spawn; fm.cd(spawn("above.script.sh code").strip());fm.ui.win.redrawwin() 
...
```

emacs的ranger.el中的`ranger-go`函数中可以添加：
```lisp
('c (string-trim (shell-command-to-string "above.script.sh code")))
```
在函数的末尾可以添加：`(redraw-frame)`可以实现跳转刷新。

