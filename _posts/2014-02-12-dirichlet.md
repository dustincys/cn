---
layout: post 
category : 学术
matheq: yes
recentvisitors: yes
title: 贝叶斯网络（一）————模型选择与狄利克雷分布
comments: yes
share: no
tags : [dirichlet distribution, bayesian network, 狄利克雷分布, 贝叶斯网络, 模型选择, 机器学习 ]
share: yes
---

机器学习中的各个学习模型具备其自身特点，如果各个模型都一样，为什么还有很多人在研究机器学习？
支撑向量机的特点是小样本即可发现足够的支撑向量，神经网是可以拟合任意复杂度，随机森林充分利用特征向量中每一个维度。
贝叶斯网络的优势在于可发现变量之间未知的关系。

问题马上就来了，贝叶斯网络是怎么发现变量之间的关系的？
仅了解贝叶斯公式远远不够充分理解贝叶斯网络实质。
<img src="https://2s66lw.blu.livefilestore.com/y2pNiXhG2EtuGyeEIBcuntEYUy4ryMPp-ay3g4ZHVtSVB8IERVo0zKK72YC9nxcoy5t3vJhXFU2zKtZeRZFFyPkcqirv66ykW6yWDeTYIoggXg/bayesiandata.png" alt="一堆原始数据" width="300"/> 
现在我们有一堆数据，如上图所示，如何发现$$x_1$$，$$x_2$$，$$x_3$$之间的关系？
或者说下面的模型中，哪一个是最有可能的？

$$x_1 \rightarrow x_2 \rightarrow x_3$$

$$x_2 \rightarrow x_1 \rightarrow x_3$$

$$x_1 \rightarrow x_3 \rightarrow x_2$$

$$\cdots$$

于是需要计算在某个模型$$B_S$$出现上面图中所示一堆数据$$D$$的可能性$$P(D|B_S)$$，可能性大的模型最有可能是目标模型。这就是贝叶斯模型选择过程。
如果$$D$$中每一个数值是离散，由贝叶斯公式得到如果计算$$P(D|B_S)$$，需要计算$$P(B_S,D)$$， 

$$P(B_S,D)=\int _{B_P} P(D|B_S, B_P) f(B_P|B_S) P(B_S) dB_P$$

其中，$$B_S$$表示某一个贝叶斯网络结构，$$B_P$$表示网络中条件概率的某一赋值。
如果$$D$$中各个实例相互独立，则 

$$P(B_S,D)=P(B_S)\int _{B_P}\left[ \prod\limits_{h=1}^{m} P(C_h | B_S, B_P ) \right] f(B_P|B_S) dB_P $$

$$m$$表示$$D$$中的实例个数，$$C_h$$表示$$D$$中第$$h$$个实例。

进一步详细上面的公式，得到

$$P(B_S,D)=P(B_S) \idotsint\limits_{\theta_{ijk}}  \left[ \prod\limits_{i=1}^{n} \prod\limits_{j=1}^{q_i} \prod\limits_{k=1}^{r_i} \theta_{ijk}^{N_{ijk}} \right] \left[ \prod\limits_{i=1}^{n} \prod\limits_{j=1}^{q_i} f(\theta_{ij1},\ldots , \theta_{ijr_i} ) \right] d\theta_{111},\ldots , d\theta_{nq_nr_n} $$

这里，$$n$$表示网络中变量个数（假设$$D$$中的变量是网络中的全部变量），$$q_i$$是该变量的父节点不同的赋值个数，$$r_i$$表示该变量所有可取值的个数，$$\theta_{ijk}$$表示当前状态下，该变量为第$$k$$个值的概率，$$N_{ijk}$$表示$$D$$中出现当前状态的变量的次数。

$$D$$中各个实例独立，所以上面的公式的右侧$$f(\theta_{ij1},\ldots,\theta_{ijr_i})$$为一常数密度（一根水平直线）。
设$$f(\theta_{ij1},\ldots,\theta_{ijr_i})=C_{ij}$$，在所有的$$k$$上积分为1

$$\idotsint\limits_{\theta_{ijk}} C_{ij} d\theta_{ij1},\ldots, d\theta_{ijr_i} = 1$$


就是在这里，狄利克雷开始发挥有意思的作用了。
作为多项分布的共轭分布，狄利克雷分布用来判断多项分布模型对应的不同数据集下，该多项分布模型的可信度。
为什么要用共轭分布？

> 2014/2/20 更正：
> 为了计算的方便，通常将似然的效应融入到先验概率分布中，也就是削减似然对后验的影响。
> 因为我们仅仅想得到一个后验值就可以了。

<del>直观上，选择模型的参数的过程类似一个不断进行最大似然的过程。
随着观察样本个数的逐渐增加，上一次的参数后验又变为下一次参数的先验。
所以这里后验概率和先验概率应该服从统一分布，也就是共轭分布。
最大化后验的过程就是不断修正参数的过程。</del>

上式进一步变形为

$$P(B_S,D)=P(B_S) \prod\limits_{i=1}^n \prod\limits_{j=1}^{q_i} C_{ij} \idotsint\limits_{\theta_{ijk}} \prod\limits_{k=1}^{r_i} \theta_{ijk}^{N_{ijk}} d\theta_{ij1}, \ldots, d\theta_{ijr_{i}}$$

后面的多重积分正好是狄利克雷积分布密度函数去掉贝塔常数的密度的积分，根据归一性，可得到

$$\idotsint\limits_{\theta_{ijk}} \prod\limits_{k=1}^{r_i} \theta_{ijk}^{N_{ijk}} d\theta_{ij1},\ldots, d\theta_{ijr_i} = \frac{\prod\limits_{k=1}^{r_i} N_{ijk} !}{(N_{ij} + r_i -1)!} $$

注意，就在此时，就是计算$$C_{ij}$$的最佳季节！
令$$N_{ijk}=0$$，这样上式中的积分项为1，就得到了$$\frac{1}{(r_i-1)!}$$，根据归一性，得到$$C_{ij}=(r_i-1)!$$
这样就得到了$$P(B_S,D)$$

$$P(B_S,D)=P(B_S)\prod\limits_{i=1}^n \prod\limits_{j=1}^{q_i} \frac{\Gamma(r_i)}{\Gamma(N_{ij} +r_i)} \prod\limits_{k=1}^{r_i} N_{ijk}!$$

到了这里算是了解贝叶斯网络第一步。
