---
layout: post
category: technology
title: 数据科学杂谈之十--算力分配
matheq: no
comments: yes
tags: [算力分配, lsf, nextflow, 数据科学杂谈]
share: yes
toc: no
---

合理分配算力是效率提高的关键。
理论上是可以在LSF系统级别，记录JOB的特征到数据库中，包括不限于：
1. 路径等参数特征
2. 运行环境特征
3. 数据I/O特征
4. 内存消耗峰值
5. CPU运行时
6. JOB异常的输出文本

预测模型可以是朴素迭代贝叶斯或者决策树什么的。
这样每次运行的JOB需要的内存不是由用户去猜。
现在这种没有反馈的人工设置算力占用多少的机制， 导致用户为了防止程序退出，“自私地”过多占用内
存和CPU，导致算力浪费。
