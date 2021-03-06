---
layout: post 
category: technology
title: 先验链之“Hello world!”
matheq: yes
comments: yes
tags: [贝叶斯学派, 频率学派, hello world]
share: yes
toc: no

---

某天有个概率面试题在窝里引起了争论：

> 有一对夫妇已生了一个儿子，那么这对夫妇再生一个小孩是儿子的概率是多少？

其实就是经典的扔硬币问题：

> 扔一次硬币，正面朝上，再扔一次还是正面的概率是多少？

有一个说法是$$\frac{1}{2}$$，理由是两次投硬币的所有可能是：正正、正反、反正、反反，已经有一个正面，那么下一个还是正面的概率显然是$$\frac{1}{2}$$。
然而据[坊间传言](http://bbs.tianya.cn/post-develop-879607-1.shtml)，这个问题的正确答案竟然是$$\frac{1}{3}$$，竟与如下问题有同解？

> 有一对夫妇生了两个孩子，其中一个是儿子，那么另外一个还是儿子的概率是多少？

类似的坊间传言还有很多，比如说这个[赌博必胜法](http://www.guokr.com/post/9996/)，实际上这是个悖论，必胜条件是要有无穷多的本金来赌博，因为输了多少钱，钱都是无穷的。
这个问题有价值的地方是可以用来做“别噎死”学派的“Hello world!”。 
众生提起“别噎死”学派，无不祭出“别噎死”公式：

$$\begin{split}
P(x | D )& = \frac{P(x)\times P(D | x)}{P(D)}\\
& = \frac{P(x)\times P(D | x)}{\int_0^1P(x)\times P(D | x)dx}\\
\end{split}
$$

“别噎死”门徒们认为硬币均匀程度是个概率分布，先验设为均匀分布，借用该文中的定义，应该是$$P(p_\text{正}) \sim \mathrm{Uniform}(0,1) $$。
那么扔了一次正面朝上之后，这个均匀程度被修正了，这个均匀程度的修正过程就是“别噎死”公式：

$$ \begin{split}
P(p_\text{正} | m_\text{正}=1, m_\text{负}=0)& = \frac{p_\text{正}^1(1-p_\text{正})^0P(p_\text{正})}{\int_0^1 t^1(1-t)^0dt}\\
&= \frac{\Gamma(3)}{\Gamma(2)\Gamma(1)} p_\text{正}\\
\end{split}
$$

右侧正好对应的是$$p_\text{正}$$的贝塔分布：

$$P(p_\text{正} | m_\text{正}, m_\text{负}) \sim \mathrm{Be}(m_\text{正}+1, m_\text{负}+1)$$

就是说“别噎死”门徒给出的答案不是一个固定的数值，给出的是一个分布。
“别噎死”门徒欲图通过抽样不断地修正答案。
且看“别噎死”门徒如何处理如下两个问题（其实是一个问题，不同的说法）：

> 有一对夫妇已生了两个儿子，那么这对夫妇再生一个小孩是儿子的概率是多少？

> 有一对夫妇已先生了一个儿子，之后又生了一个儿子，那么这对夫妇再生一个小孩是儿子的概率是多少？

第一个问题的答案是

$$P(p_\text{正} | m_\text{正}=2, m_\text{负}=0) \sim \mathrm{Be}(3,1)$$

，而第二个问题的答案要分为两步修正这个答案。 第一步可以得到

$$P(p_{\text{正}_1} || m_\text{正}=1, m_\text{负}=0) \sim \mathrm{Be}(2,1)$$

，进一步将这个修正之后的概率分布做为下一步的先验，

$$ \begin{split}
P(p_{\text{正}_2} | m_\text{正}=1, m_\text{负}=0) &= \frac{2p_{正}\times p_{正}}{\int_0^1 2t^2dt}\\
& = \frac{\Gamma(4)}{\Gamma(3)\Gamma(1)}p_{正}^2
\end{split}
$$

即$$P(p_{\text{正}_2} | m_\text{正}=1, m_\text{负}=0) = \mathrm{Be}(3,1)$$与第一个问题的答案相同。
为什么相同呢？因为第一次先验的系数也在分母中出现了，于是约去了系数，且后验与似然有相同的多项式形式。
也就是为什么采用共轭先验（前文中的均匀分布，共轭先验是相对于似然而言）的实际意义。
