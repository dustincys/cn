---
layout: post
category: 编码
title: FVWM的类似Windows的显示桌面功能
matheq: no
comments: yes
tags: [fvwm, 显示桌面, hotcorner, brightside]
share: yes
toc: no
---
如码，

```fvwm
DestroyFunc ShowDesktop
AddToFunc   ShowDesktop
+ I Any (CurrentPage, Iconifiable, !Iconic) Nop
+ I TestRc (Match) KeepRc All (CurrentPage, Iconifiable, Iconic) ThisWindow State 1 False
+ I TestRc (Match) KeepRc All (CurrentPage, Iconifiable, !Iconic) ThumbnailDesktop
+ I TestRc (NoMatch) RestoreDesktop

DestroyFunc ThumbnailDesktop
AddToFunc   ThumbnailDesktop
+ I All (CurrentPage, Iconifiable, !Iconic, !State 1) ThisWindow State 1 True
+ I All (CurrentPage, Iconifiable, !Iconic, State 1) Silent Thumbnail

DestroyFunc RestoreDesktop
AddToFunc   RestoreDesktop
+ I All (CurrentPage, Iconifiable, Iconic, State 1) Silent Iconify
```

其中，DeThumbnail设置需要添加状态设置，如下。

```fvwm
DestroyFunc DeThumbnail
AddToFunc DeThumbnail
+ I PipeRead "echo WindowStyle IconOverride, Icon \\$\\[Icon-$[w.id]\\]"
+ I UnsetEnv Icon-$[w.id]
+ I Exec rm -f $[fvwm_tmp]/icon.tmp.$[w.id].png
+ I ThisWindow State 1 False
```

这样，就和windows的显示桌面的逻辑完全一致。在`brightside`的左下角调用
FvwmCommand，就实现了显示桌面的的功能。逻辑是这样：当鼠标移动到桌面的最左下角，
判断当前页面中是否有没有图标化的窗口，如果有，则将所有这样的窗口最小化，更新设
置当前页面中所有窗口的状态。注意这时候更新的状态包括最小化窗口。
