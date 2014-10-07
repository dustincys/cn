---
layout: post 
category : 生活
title: 烧烤理论
matheq: yes
comments: yes
tags : [烧烤, 买保险]
toc: yes

---
烧烤的原理很简单：高温把肉烤熟了。
但如果想要烤出高质量的肉就需要一点粗浅的物理知识。
###烧烤种类
####烧烤烤箱的种类
根据热源的不同，烤箱分为：

- 电烤箱 （特点：受热均匀，温度可控）
- 炭烤箱 （特点：适合没有电源的地方）

####食材的种类
根据食材的物理性质，食材可分为：

- 可用竹钎或铁钎穿成“糖葫芦”形状的食材 （如羊肉、鱼丸等）
- 不可用钎子穿成“糖葫芦”形状的食材 （如韭菜、金针磨、扇贝等）

####各类烧具应用场合
如果采用炭烤箱，十分不建议采用如下的方式：

<a class="fancybox" rel="gallary1" href="https://2s66lw.bl3301.livefilestore.com/y2pHtEDX6Cw0dcQK1zoGvG-Gqo0c3xxswJzUkx1JZwq_UslrJbQNSoZJ3oGYXssRlySkmoeBZVx2kz0dOPGW3CdcFwBlGASE0EGSu2ytI1hEIs/withNet.jpg" title="有网的炭烤箱">
	<img src="https://2s66lw.bl3301.livefilestore.com/y2pHtEDX6Cw0dcQK1zoGvG-Gqo0c3xxswJzUkx1JZwq_UslrJbQNSoZJ3oGYXssRlySkmoeBZVx2kz0dOPGW3CdcFwBlGASE0EGSu2ytI1hEIs/withNet.jpg" alt="有网的炭烤箱" />
</a>

实际操作中炭火常常会燃烧不均匀，通常是中心温度高边缘温度低。
如果将肉串直接放在钢网之上，这使得肉串上的肉处于同一个火焰高度，其结果往往是靠近中心的肉串先熟，而边缘还生。
等到都烤熟，中心的肉串糊了。
吃糊肉非常不健康。
如果采用电烤箱就不存在这个问题了。
一般在热源均匀的情况下，可以将烤肉放在同一个高度进行均匀加热。

在实际操作中常常因为木炭质量而产生烟，或者因为肉类烤出的油滴到木炭上起烟。
黑烟里面有很多未燃烧完全的碳化物质，非常不健康。
钢网这一类媒介会吸附这些有害物质，在烤肉的时候不可避免的粘到食物上，所以采用钢网这类工具使用来烤不会滴油的食材，或者不怕烟的（如扇贝）。

正确的烤肉方法是既要确保受热均匀，又要确保不被有害物质污染。
如果采用如下方式：

<a class="fancybox" rel="gallary1" href="https://2s66lw.bl3301.livefilestore.com/y2pOYNHJFLjVFV4dfRJ_mp0JB2rGNWwdzV-aIoWWxEOnvrtHh4znhq2NBqhw2wX2LK30GXmeVDDiYN77U_KL6nuUWBbH9s47REwlLtmEPsLWHQ/withoutNet.jpg" title="没有网的烤箱">
	<img src="https://2s66lw.bl3301.livefilestore.com/y2pOYNHJFLjVFV4dfRJ_mp0JB2rGNWwdzV-aIoWWxEOnvrtHh4znhq2NBqhw2wX2LK30GXmeVDDiYN77U_KL6nuUWBbH9s47REwlLtmEPsLWHQ/withoutNet.jpg" alt="没有网的烤箱"/>
</a>

一定要有人监督，如果滴油产生烟立即将食物移开。
其实最理想的烤肉箱、烤肉领域的绝世利器在这里：

<a class="fancybox" rel="gallary1" href="https://2s66lw.bl3301.livefilestore.com/y2p6vmATkcv9vAAREFqp-07OMxFbi_8i2_pNuYFCLl52v_72AwNxtPusLL9eFe0i_I03BL--P2b_YD2Z9R6UDg6WwkSOXPovFKAw-aQEy7wFc0/incline.jpg" title="斜坡式烤肉利器">
	<img src="https://2s66lw.bl3301.livefilestore.com/y2p6vmATkcv9vAAREFqp-07OMxFbi_8i2_pNuYFCLl52v_72AwNxtPusLL9eFe0i_I03BL--P2b_YD2Z9R6UDg6WwkSOXPovFKAw-aQEy7wFc0/incline.jpg" alt="斜坡式烤肉利器"/>
</a>

斜坡方式，烟熏不到，油滴不着。
烤侠使用把手通过齿轮传动一次转动一排肉串，有眼光选用这枚烤器的烤侠已臻化境。
###烧烤领域的其他技能
烤侠不知以下这公式，便是英雄也枉然……
$$\\text{江边烧烤}\_{\\text{天冷}} \\notin \\text{靠谱}$$
另外烤侠还要知道如何统计参加烧烤人员个人信息来买保险吧？
{% highlight python %}
#!/usr/bin/env python
# encoding: utf-8

import glob

def run(inFilePatern, outFilePath):
    """
    :inFileFolder: @todo
    :outFilePath: @todo
    :returns: @todo

    """
    inFileList = glob.glob(inFilePatern)
    total = 0
    nameID = set() 
    names = []
    with open(outFilePath, 'w') as outFile:
        for infoFilePath in inFileList:
            with open(infoFilePath) as infoFile:
                for line in infoFile:
                    line=line.strip()
                    if line=="":
                        continue
                    listLine=line.split("\t")
                    if len(listLine) == 9 and listLine[1] not in nameID:
                        outFile.write(line+"\n")
                        total = total + 1
                        nameID.add(listLine[1])
                        names.append(listLine[0])
                    elif listLine[1] in nameID:
                        print "duplication:{}".format(listLine[1])
                    else:
                        print "not ok {}".format(infoFilePath)
    print "finish:{}".format(total)
    print "已完成姓名:"
    print sorted(names)
    print "ID"
    print nameID

if __name__ == '__main__':
    run("/home/dustin/Desktop/烧烤/*.txt", "barbecueAll.txt")
{% endhighlight %}

> 糊肉烟光残照里，无言谁会凭阑意……
