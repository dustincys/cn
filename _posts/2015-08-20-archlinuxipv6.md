---
layout: post 
category: 生活
title: 哈工大宿舍Archlinux的ipv6配置方法
matheq: no
comments: yes
tags: [ipv6, archlinux, 哈工大, 宿舍, 锐捷, mentohust]
share: yes
toc: no

---

> 在窝工宿舍使用极路由的ipv6云插件进行ipv6路时，其一个弱点是路由器不能够向dhcp服务器持续发送ipv6分配请求，这导致出现了以下这个荒唐的情况：为了持续使用ipv6，吾等必要每间隔一两个月左右使用电脑链接一下进入宿舍的网线。


#### Archlinux 设置ipv6需要使用的一些程序和工具如下：

- 设置mac地址克隆

		ip link set <interface> down
		ip link set dev <interface> address <address>
		ip link set <interface> up

- 设置ipv4动态获取ip地址

		systemctl start dhcpcd@<interface>.service

	或者：

		systemctl enable dhcpcd@<interface>.service

- 使用mentohust（锐捷Linux客户端）连接网线上网

		mentohust

- 使用netctl设置ipv6静态地址
	1. 在`/etc/netctl/`文件夹下建立一个配置文件：<filename>，文件格式：

			Interface=<interface>
			Connection=ethernet
			IP6=static
			Address6=('XXXX:XXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX::1/XX')
			Gateway6=XXXX:XXX:XXXX:XXXX::X
	2. 启动这个配置：

			netctl start <filename>

		或者:

			netctl enable <filename>

#### 相关的ipv6配置

- [哈工大宿舍ubuntu的ipv6配置方法](http://yanshuo.name/cn/2014/12/ipv6/ "哈工大宿舍ubuntu的ipv6配置方法")
- [Archlinux，ipv6的修罗场！](http://yanshuo.name/cn/2015/07/ipv6/,"Archlinux，ipv6的修罗场！")
