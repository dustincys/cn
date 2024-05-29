---
layout: post
category: technology
title: 数据科学杂谈之十二--现场恢复
matheq: no
comments: yes
tags: [数据科学杂谈, 数据工程]
share: yes
toc: no
---

常常见到类似如下这样一句话：
> 在人工智能时代，知识壁垒不复存在。

以上这句话虽然难以接受但不是危言耸听，所有依赖知识壁垒所建立的竞争力将被极大削弱甚至完全摧毁。
传统的数据科学，包括数据清洗、数据挖掘、数据可视化的实现方法，依赖一定的编程知识壁垒。
在人工智能时代，这个壁垒不复存在，所有人都会做数据分析。
而传统的纯知识型专业，例如生物、医学、法律这类，其壁垒将被完全摧毁。
数据科学进入工程化和自动化是必然趋势。

工程化数据分析最关键一点是现场恢复。
例如，某数据科学家要同时进行两个项目，如何在两个项目中迅速切换？
快速恢复编码和调试场景，到达数据分析现场，助于项目管理、项目扩展，最终将节省大量时间，避免浪费。

常见的认知误区有如下几点：

1. 认为人脑管理数据和代码是最佳方案
2. 认为在本地PC上进行编码和调试最方便
3. 认为本机主流编辑和测试环境就是最佳环境，例如jupyter、rstudio、vscode等

第一点，人脑管理只能管理有限的数据，这是生理结构决定的。
第二点，本地PC命中注定是无法进行多任务管理，因为本地PC的内存和算力有限，多开任务注定导致内存用满、算力不够。
另外本地PC并不是稳定环境，笔记本电池耗尽、电源断连、网络不佳、系统更新、系统重启等等因素导致环境脆弱，不能持续使用。
第三点，在强人工智能背景下，代码的细节不再是瓶颈，使用任何编辑器都能达到目的。所以编辑器不重要，重要的是能够嵌入在终端中，使其长期稳定地运行在服务器上。
目前比较主流的能够嵌入在终端中的编辑器有vim、emacs、nano。
以emacs为例，我的方案是用tmux管理项目，即一个项目在单独的tmux session中。
而每一个session中，每一个page对应该项目中一个独立任务。
对于每一个任务我启动一个emacs server。
为了使其服务器友好，用一个简单的逻辑自动清理长期不使用的emacs server。
逻辑如下，首先让emacsclient每次退出的时候记录当前时间点到对应的emacs server的log中：
```lisp
  (defun log-emacs-server-done ()
    "Log the current time in absolute seconds to a file when an Emacs client session finishes."
    (let ((log-file (concat "~/" server-name ".log")))
      (with-temp-buffer
        (insert (format-time-string "%s\n"))
        (write-region (point-min) (point-max) log-file))))
  (add-hook 'server-done-hook 'log-emacs-server-done)
```
然后，用watch或cron自动清理所有长达一周没有打开emacsclient的emacs server。
```shell
readarray -t emacs_array <<< "$(ps -eo pid,user,etimes,args --sort=start_time | grep ${USER} | grep emacs | grep -Eo 'tmux:.*-[0-9]+' | uniq)"
readarray -t emacsclient_array <<< "$(ps -eo pid,user,etimes,args --sort=start_time | grep ${USER} | grep emacsclient | grep -Eo 'tmux:.*-[0-9]+' | uniq)"

for temp_daemon in "${emacs_array[@]}"; do
    if [[ ! " ${emacsclient_array[@]} " =~ " ${temp_daemon} " ]]; then
        if [ ! -e "~/${temp_daemon}.log" ]; then
            ps -eo pid,user,etimes,args --sort=start_time | grep ${USER} | grep "${temp_daemon}$" |  awk '{if($3 > 604800.0) print $1}' | xargs -n 1 -I{} kill -9 {}
        else
            last_visit_s=$(cat ~/${temp_daemon}.log)
            now_s=$(date +%s)
            interval=$((now_s - last_visit_s))
            one_week=$((7 * 24 * 60 * 60))
            if [ ${interval} -gt ${one_week} ]; then
                ps -eo pid,user,etimes,args --sort=start_time | grep ${USER} | grep "${temp_daemon}$" | xargs -n 1 -I{} kill -9 {}
                rm -rf ~/${temp_daemon}.log
            fi
        fi
    fi
done
```

