---
layout: post
category: technology
title: Fvwm+brightside
matheq: no
comments: yes
tags: [brightside, Fvwm2, hotcorner]
share: yes
toc: no
---
Fvwm只支持xcompmgr这类轻量窗口合成管理器，不支持有各种酷炫特效的compiz。
xcompmgr只提供很基础的窗口渲染功能，这让Fvwm使用起来简洁高效，但也有一点坏处，没
有酷炫的特效就不能吸引“领导”的眼球，且一点特效动画都没有的Fvwm也显得枯燥单调。

brightside是一开发于2004年的Linux上“热角”（ hotcorner ）程序，收录于Ubuntu默认源中
，目前最新版本更新于2008年。 bright的优点是Linux平台上可以用于任意窗口管理器，
brightside还很“Linux”地提供了调用自定义shell脚本的接口。这样利用其接口，写一个简
单的脚本就可以实现类似gnome3的热角操作效果。需要在Fvwm2rc文件的StartFunction中添
加启动FvwmCommandS模块，让shell脚本可以直接执行Fvwm命令。
```Fvwm
+ I Module FvwmCommandS
```
在InitFunction中添加默认启动brightside。
```Fvwm
+ I Exec exec brightside &
```
hotcorner调用的脚本中用AnimatedMove实现动画移动窗口然后再用FvwmRearrange实现窗口
重排，需要调用vp.width实现自动获取屏幕宽度。
```sh
FvwmCommand "All (!Iconic, CurrentPage) AnimatedMove 0 -0 ewmhiwa";
sleep 0.5;
FvwmCommand "Piperead 'echo FvwmRearrange -tile -mn 3 -animate -m -u -s -t 0 2 \$((\$[vp.width]-212))p 98'"
```
但brightside有一个非常烦人的进度条，每次鼠标移动到屏幕角落就会触发这个进度条，显
示在屏幕中央非常难看，且没有选项可以不显示进度条。没办法，书呆只好修改一下源码，
从Ubuntu的deb-src或ArchLinux的aur重新生成package。只需要修改brightside.src文件中
的do_custom_action函数即可。
```c
static void
do_custom_action (Brightside *brightside, gint corner, gint action)
{
	gboolean is_enabled = (action == ACTION_START);

	if (is_enabled) {
		brightside_image_set_custom (brightside,
				brightside->settings.corners[corner].custom_in,
				TRUE);
		execute (brightside->settings.corners[corner].custom_in, FALSE,
			&brightside->settings.corners[corner].custom_kill_pid
			);
	} else if (brightside->settings.corners[corner].custom_kill) {
		brightside_image_set_custom (brightside,
				brightside->settings.corners[corner].custom_in,
				FALSE);
		kill_child_pid (
			brightside->settings.corners[corner].custom_kill_pid);
	} else {
		brightside_image_set_custom (brightside,
				brightside->settings.corners[corner].custom_in,
				TRUE);
		execute (brightside->settings.corners[corner].custom_out,
				FALSE, NULL);
	}

	dialog_hide (brightside);
}
```
