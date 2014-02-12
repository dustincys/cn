---
layout: post 
category : 学术
title: 贝叶斯网络（一）————模型选择与狄利克雷分布
comments: yes
share: no
tags : [dirichlet distribution, bayesian network, 狄利克雷分布, 贝叶斯网络, 模型选择, 机器学习 ]
---

机器学习中的各个学习模型具备其自身特点，如果各个模型都一样，为什么还有很多人在研究机器学习？
支撑向量机的特点是小样本即可发现足够的支撑向量，神经网是可以拟合任意复杂度，随机森林充分利用特征向量中每一个维度。
贝叶斯网络的优势在于可发现变量之间未知的关系。

问题马上就来了，贝叶斯网络是怎么发现变量之间的关系的？
仅了解贝叶斯公式远远不够充分理解贝叶斯网络实质。
<img src="https://2s66lw.blu.livefilestore.com/y2pNiXhG2EtuGyeEIBcuntEYUy4ryMPp-ay3g4ZHVtSVB8IERVo0zKK72YC9nxcoy5t3vJhXFU2zKtZeRZFFyPkcqirv66ykW6yWDeTYIoggXg/bayesiandata.png" alt="一堆原始数据" width="300"/> 
现在我们有一堆数据，如上图所示，如何发现\\(x\_1\\)，\\(x\_2\\)，\\(x\_3\\)之间的关系？
或者说下面的模型中，哪一个是最有可能的？

$$x\_1 \\rightarrow x\_2 \\rightarrow x\_3$$
$$x\_2 \\rightarrow x\_1 \\rightarrow x\_3$$
$$x\_1 \\rightarrow x\_3 \\rightarrow x\_2$$
$$\\cdots$$

于是需要计算在某个模型\\(B\_S\\)出现上面图中所示一堆数据\\(D\\)的可能性\\(P(D|B\_S)\\)，可能性大的模型最有可能是目标模型。这就是贝叶斯模型选择过程。
如果\\(D\\)中每一个数值是离散，由贝叶斯公式得到如果计算\\(P(D|B\_S)\\)，需要计算\\(P(B\_S,D)\\)， 
$$P(B\_S,D)=\\int \_{B\_P} P(D|B\_S, B\_P) f(B\_P|B\_S) P(B\_S) dB\_P$$
其中，\\(B\_S\\)表示某一个贝叶斯网络结构，\\(B\_P\\)表示网络中条件概率的某一赋值。
如果\\(D\\)中各个实例相互独立，则 
$$P(B\_S,D)=P(B\_S)\int \_{B\_P}\\left[ \\prod\\limits\_{h=1}^{m} P(C\_h | B\_S, B\_P ) \\right] f(B\_P|B\_S) dB\_P $$
\\(m\\)表示\\(D\\)中的实例个数，\\(C\_h\\)表示\\(D\\)中第\\(h\\)个实例。

进一步详细上面的公式，得到
$$P(B\_S,D)=P(B\_S) \\idotsint\\limits\_{\\theta\_{ijk}}  \\left[ \\prod\\limits\_{i=1}^{n} \\prod\\limits\_{j=1}^{q\_i} \\prod\\limits\_{k=1}^{r\_i} \\theta\_{ijk}^{N\_{ijk}} \\right] \\left[ \\prod\\limits\_{i=1}^{n} \\prod\\limits\_{j=1}^{q\_i} f(\\theta\_{ij1},\\ldots , \\theta\_{ijr\_i} ) \\right] d\\theta\_{111},\\ldots , d\\theta\_{nq\_nr\_n} $$
这里，\\(n\\)表示网络中变量个数（假设\\(D\\)中的变量是网络中的全部变量），\\(q\_i\\)是该变量的父节点不同的赋值个数，\\(r\_i\\)表示该变量所有可取值的个数，\\(\\theta\_{ijk}\\)表示当前状态下，该变量为第\\(k\\)个值的概率，\\(N\_{ijk}\\)表示\\(D\\)中出现当前状态的变量的次数。

\\(D\\)中各个实例独立，所以上面的公式的右侧\\(f(\\theta\_{ij1,\\ldots,\\theta\_{ijr\_i}})\\)为一常数密度（一根水平直线）。
设\\(f(\\theta\_{ij1,\\ldots,\\theta\_{ijr\_i}})=C\_{ij}\\)，在所有的\\(k\\)上积分为1
$$\\idotsint\\limits\_{\\theta\_{ijk}} C\_{ij} d\\theta\_{ij1},\\ldots, d\\theta\_{ijr\_i = 1}$$


就是在这里，狄利克雷开始发挥有意思的作用了。
作为多项分布的共轭分布，狄利克雷分布用来判断多项分布模型对应的不同数据集下，该多项分布模型的可信度。
为什么要用共轭分布？
直观上，选择模型的参数的过程类似一个不断进行最大似然的过程。
随着观察样本个数的逐渐增加，上一次的参数后验又变为下一次参数的先验。
所以这里后验概率和先验概率应该服从统一分布，也就是共轭分布。
最大化后验的过程就是不断修正参数的过程。

上式进一步变形为
$$P(B\_S,D)=P(B\_S) \\prod\\limits\_{i=1}^n \\prod\\limits\_{j=1}^{q\_i} C\_{ij} \\idotsint\\limits\_{\\theta\_{ijk}} \\prod\\limits\_{k=1}^{r\_i} \\theta\_{ijk}^{N\_{ijk}} d\\theta\_{ij1}, \\ldots, d\\theta\_{ijr\_{i}}$$
后面的多重积分正好是狄利克雷积分布密度函数去掉贝塔常数的密度的积分，根据归一性，可得到
$$\\idotsint\\limits\_{\\theta\_{ijk}} \\prod\\limits\_{k=1}^{r\_i} \\theta\_{ijk}^{N\_{ijk}} d\\theta\_{ij1},\ldots, d\\theta\_{ijr\_i} = \\frac{\\prod\\limits\_{k=1}^{r\_i} N\_{ijk} !}{(N\_{ij} + r\_i -1)!} $$
注意，就在此时，就是计算\\(C\_{ij}\\)的最佳季节！
令\\(N\_{ijk}=0\\)，这样上式中的积分项为1，就得到了\\(\\frac{1}{(r\_i-1)!}\\)，根据归一性，得到\\(C\_{ij}=(r\_i-1)!\\)
这样就得到了\\(P(B\_S,D)\\)
$$P(B\_S,D)=P(B\_S)\\prod\\limits\_{i=1}^n \\prod\\limits\_{j=1}^{q\_i} \\frac{\\Gamma(r\_i)}{\\Gamma(N\_{ij} +r\_i)} \\prod\\limits\_{k=1}^{r\_i} N\_{ijk}!$$
到了这里算是了解贝叶斯网络第一步。
