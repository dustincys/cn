---
layout: post
category: 生活
title: 那么样自由地切换程序
matheq: no
comments: yes
tags: [awesome wm, lua, 配置狂]
share: yes
toc: no
---

Awesome WM 的最大优势是瓦片布局，可以使窗口平铺在桌面，利用所有的桌面空间。
这样就不存在哪一个窗口被另外很多窗口遮挡住，从而渐渐被遗忘。
Awesome WM 默认的布局种类有瓦片、浮动、最大化、全屏布局等，如果是 Awesome WM 3.5 版本，那么使用 lain 配件集还有网格、映射、平均化布局等。
在每一种布局模式下，当前标签中的窗口有三种状态：最大化、最小化、既不最大化也不最小化。
其中，最大化和最小化这两种状态被设置为不参与当前标签的布局。

这样 Awesome WM 看似设计十分人性化的背后有令人难受的地方。

其一， 最大化窗口之后，如果想最大化另外一个应用窗口时候，需要的操作过多。
默认的步骤，如果采取逐次点击的方法，其背后的小窗口逐渐覆盖到当前应用之上，或者采用点开应用菜单（默认只有菜单能进行这样切换），再寻找另一个最大化窗口，点取，再最大化，需要过多操作次数。

其二， 如果采用切换到最大化布局的方式最大化当前应用，由于浮动层次的不同，很可能出现想要的应用不在最上层。

其三，如果透明应用配置，多层透明重叠在一起，最后变成不重叠，且如果在桌面上配置了小工具（如conky），最终也看不到了。

所以，特别是在瓦片布局状态下，作为一种非常好的最大化窗口方案是：[最小化所有其他窗口以使当前窗口自动铺满屏幕](https://github.com/worron/awesome-config/pull/1)！

首先，鼠标要设置成自动浮动聚焦模式（能省就省着点左键聚焦）。
这样可以通过移动鼠标来进行快速导航聚焦到需要最大化的应用之上。

然后，添加最大化操作方法：

{% highlight lua  %}
awful.button({ self.mod            }, 4, function (c) minimize_all_else(c) end),
awful.button({ self.mod            }, 5, function (c)
	if has_minimized_one_else(c) then
		restore_all_else(c)
	end
end)
{% endhighlight %}

其中特别注意的是最小化所有其他窗口函数，

{% highlight lua  %}
local function minimize_all_else(c)
    c:raise()
    thisScreen = client.focus.screen
    for _, cc in ipairs(client.get(c.screen)) do
        if current(cc, thisScreen) and cc.window ~= c.window then
                cc.minimized = true
        end
    end
end
{% endhighlight %}

`thisScreen` 必须要在循环之前获取到，否则会导致在最小化其他应用窗口时候，由于窗口的浮动层次不同出现有的窗口突然浮动到当前窗口之上导致聚焦变化，而导致出现聚焦不到异常。
另外，由于采用的是sloppy鼠标模式，需要将当前窗口提到最上一层`c:raise()`，否则会出现最大化窗口后窗口没有被聚焦，然后在进行恢复操作时出现异常。



