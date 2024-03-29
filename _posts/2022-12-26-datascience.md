---
layout: post
category: technology
title: 数据科学杂谈之七--算力决胜
matheq: no
comments: yes
tags: [算力, 大规模计算, 数据科学杂谈]
share: yes
toc: no
---

> 有几个观点对于人可以成立，对于机器不成立：  
> “一心不可二用”  
> “欲速则不达”

今年人工智能领域的现象级模型chatGPT的训练参数有1750亿个。
在数学理论上，chatGPT应该不是颠覆性创新，其决胜的关键应该是如何应用算力。
从商业角度讲，如果公司A能够相对公司B较快速完成大规模参数训练，那么市场就会被先入
为主地占领。
另一面，如果从学术角度看，如果单位A能够相对单位B相对更短的时间内完成更大规模参数的机器学习，
那么单位A就能够挖掘到更多的知识，自然其驱动得到的学术成果就越多，其周期也就越短。

[上一篇](https://dustincys.github.io/cn/2022/11/datascience/)中提到的架构是数据在空间上结构,
这一篇讲的内容是关于数据在时间上的动态。
对于大规模的并行计算，大规模参数的优化，如果没有动态监控，那么只能在所有训练或者
学习结束之后，才能得到结果评估。
这样很浪费时间。
所以合理的方案是有一个数据库可以允许各个训练实例随机访问，这样就可以通过统计数据
库中的实时状态获取各个训练实例信息，动态监控模型训练情况。
以上就是MLFlow的Tracking模块的功能。
这就可以处理大规模的参数优化，例如单细胞数据无监督聚类，Tracjectory生成等等。
迅速对多个参数的动态进行监控，通过监控曲线，形成下一步分析计划和决心。

