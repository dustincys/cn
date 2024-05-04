---
layout: post
category: technology
title: Emacs-everywhere在MAC中的设置方法
matheq: no
comments: yes
tags: [emacs, emacs-everywhere, mac, 配置]
share: yes
toc: no
---
[Emacs-everywhere](https://github.com/tecosaur/emacs-everywhere)越来越重要，因为需要调用Emacs中封装的Chatgpt的API来对所有编辑的
文本进行润色。
而Emacs是GNU的嫡系，所以对非GNU系统支持不好。
如要完美设置Emacs-everywhere，需要以下步骤,

* 安装对Mac支持最好的Emacs版本。
目前看只有这个[homebrew](https://github.com/railwaycat/homebrew-emacsmacport)的版本对Mac优化最好。

* 在Emacs上安装Emacs-everywhere，需要先设置好
``` lisp
  (server-start)
```

* 按照[Readme中的说明](https://github.com/tecosaur/emacs-everywhere)，安装Emacs-everywhere。

* 重载Emacs-everywhere中的`emacs-everywhere-set-frame-position`函数，因为，对于非特大屏幕，不需要在鼠标的位置弹出窗口，设置为显示屏正中间最好。

``` lisp
  (defun my-emacs-everywhere-set-frame-position ()
    (let* ((frame (selected-frame))
           (frame-width (frame-pixel-width frame))
           (frame-height (frame-pixel-height frame))
           (screen-width (display-pixel-width))
           (screen-height (display-pixel-height))
           (pos-x (/ (- screen-width frame-width) 2))
           (pos-y (/ (- screen-height frame-height) 2)))
      (set-frame-position frame pos-x pos-y)))

  (advice-add 'emacs-everywhere-set-frame-position :around #'my-emacs-everywhere-set-frame-position)
```

* 添加一个钩子：
```lisp
  (defun my-emacs-everywhere-set-frame-style ()
      (set-frame-parameter (selected-frame) 'undecorated t))
  (add-hook 'emacs-everywhere-init-hooks #'my-emacs-everywhere-set-frame-style)
```
因为，弹出窗口的标题栏并没有什么用。

* 在Mac的Automator中添加一个workflow，类型是Run shell command，内容为：
```shell
/opt/homebrew/bin/emacsclient -e "(emacs-everywhere)"
osascript -e 'tell application "System Events" to click UI element "Emacs" of list 1 of application process "Dock"'
```
其中，第二行为Mac系统的聚焦命令。在Mac系统的Emacs无法做到Emacsclient聚焦，即使是`(raise-frame)`也不行。

* 在Mac系统的keyboard的shortcuts中，把上面的workflow绑定到一个自定义的快捷键。

* 在Mac系统的privacy and security中，在Accessibility列表中添加目标程序设置。
例如，如果想在Outlook中使用，那么就把Outlook添加到这个列表中。

以上，就可以自由自在地在任何程序中使用Emacs了！
然后就，
> 再没有心的沙漠！再没有爱的荒原！

