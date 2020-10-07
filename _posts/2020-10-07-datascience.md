---
layout: post
category: technology
title: 数据科学的工程架构
matheq: no
comments: yes
tags: [工程架构, 代码]
share: yes
toc: no
---
[数据科学](https://en.wikipedia.org/wiki/Data_science)的代码工程架构比计算科学要复杂。
因为：

- 数据的特性比较高，每一类数据甚至每一批数据都有较强的自身特性。例如，[批次效应](http://chenyin.top/bioinfo/20190319-cca5.html)。

- 工程中涉及到的专业知识复杂，导致有多种类别的输入数据。
例如，生物数据分析（或者称为生物信息学），可能需要通路数据、网络数据、本体数据、基因蛋白等测序和注释数据、以及不同的生物实验设计对应的特异性的先验知识。

- 数据处理和数据分析和挖掘结果的可视化处理步骤繁多。
这一点是比较耗时间的，因为各种各样的模型、算法不仅仅需要会知其然，更要知道其所以然。

- 数据科学处于流水线的最末段，集质检＋销售+产品经理+工程师于一身。
前期实验设计是否合理？如何呈现产品？如何解释产品？如何写代码？这些一切责任都压在最后的数据科学这一阶段。

以上种种，导致[数据科学](https://en.wikipedia.org/wiki/Data_science)可重复性差，甚至可以说花样繁多。针对以上种种特点，数据科学的工程架构应该具备区分非特异性知识与特异性知识、多种复杂I/O结构、复杂pipeline并行/串行处理、数据模型验证以及参数寻优的特点。

	|
	|---Project 1
	  |---Database
	  | |---Public Database (不同工程所共有的知识)
	  | |---Private Database (特异的知识)
	  |---Data　(数据输入)
	  |---Code
	    |---SRC
	    | |---Public (不同工程所共有的数据分析和处理代码)
	    | |---Private (非共有的数据分析和处理代码)
	    |---Pipeline
	      |---Public (共有流程)
	      | |---Step 1
	      |---Private (私有流程)
	        |---Callback 1 (回调)

以上是工程内部的架构。
其中，共有知识、共有pipeline中是层次(树形)架构：

	|
	|---Project database
	  |---General knowledge (类似生物知识中本体结构)
	    |---Next level knowledge
        
共有的数据处理流程为：

	|
	|---Project pipeline
	  |---Process 1
	    |---Tool/Software 1
	      |---Parameter a
	        |---Parameter b
        
其中的参数寻优可以为网格式循环穷举，也可以使用梯度下降或者MCMC之类。
