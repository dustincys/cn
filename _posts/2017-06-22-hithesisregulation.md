---
layout: post
category: 学术
title: 规范的正确打开方式
matheq: no
comments: yes
tags: [hithesis, 歧义, latex]
share: yes
toc: no
---
#### 之一，　版芯歧义
继[前文][hithesishangjv]所述的[《本科毕业论文规范》][bachelorregulation]中的行距歧义，我
工规范又一次被小伙伴们发现了重大歧义。我工两大规范[^regulation]大部分都内容是一
致的，只有封面、目录格式等少数几处不同。关于版芯的规定，在[《研究生论文规范》
][masterregulation]中3.8节规定：

> 版芯为150mm×240mm±2mm（包括页眉、页码）。

但在3.4节规定：

> 在版芯上边线加粗、细双线（粗线在上，宽0.8mm），双线上居中打印页眉。

且在2.2节规定：

> 页码在版芯下边线之下居中放置；

这到底是包括页眉页码还是不包括页眉页码呢？
细心的刀客会发现一处线索，在3.8节中紧接着版芯规定，有行数规定：

> 版芯为150mm×240mm±2mm（包括页眉、页码）。每页约33行。……　正文行距3~4mm。

按照[旧模板][plutothesis]的设置方法，模板中页眉、页码加正文中长度之和为240mm。正
文长度224mm。这样按照最小行距3mm加上小四12bp字号，正文中的行数能排下31行。但问题
是这个行数包不包括页眉页码呢？如果包括页眉页码，满足33行行数要求。但据小伙们反应
，大部分评审老师认为这个33行行数要求是只计算正文。如果在正文中排下33行，240mm恰
好可以。但如果只计算正文那么无论如何224mm也摆不下33行。到底哪一种假设是正确？扑
朔迷离[^banxin]。


#### 之二，标题间距的推理
还是[前文][hithesishangjv]中提到的章节标题行距问题。但这次不是[《本科毕业论文规
范》][bachelorregulation]，这次是[《研究生论文规范》][masterregulation]，3.2节规
定：

> 章标题 小2号字，建议段前1行，段后0.8行；……　正文　小4号字，建议段前0行，段后0行。

这里段前一行是标题之上还是标题之下？如果理解为标题在正文的段落之前，那么段前应该
是标题之下空一行。 还有这个段前空一行，是正文的一行还是章标题的一行？这两个距离不一样。如果按照word中习惯，
空一行是空的章标题的一行且在标题之上[^chapterskip]。还有一个问题是，空一行是只空一行字，还是
空一行字加上间距？如果空的只是一行字那么正文中段落之间就紧密相连了。不符合常理。
根据规范3.8中的规定：

> 章标题上、下行距10mm

那么章标题的段前空一行应该包括了章标题的字号12bp+10mm，这个空白很大，但根据以上
推理，应该就是规范所要求的。


[^regulation]: 规范是指[《哈尔滨工业大学研究生学位论文撰写规范》][masterregulation]和[《哈尔滨工业大学本科生毕业论文撰写规范》][bachelorregulation]
[^chapterskip]: [hithesis][hithesis]中的设置方法与word习惯一致，空章标题格式的一行，段前为标题之上，一行为字号+行间距。
[^banxin]: 为了规格严格、功夫到家，[hithesis][hithesis]给出两种版芯设置。

[bachelorregulation]: http://jwc.hit.edu.cn/2566/list.htm
[masterregulation]: http://hitgs.hit.edu.cn/aa/fd/c3425a109309/page.htm
[hithesishangjv]: http://yanshuo.name/cn/2017/06/hithesissiyuan/
[plutothesis]: https://github.com/dustincys/PlutoThesis
[hithesis]: https://github.com/dustincys/hithesis
