---
layout: post
category: technology
title: 知识管理
matheq: no
comments: yes
tags: [信息管理, 知识管理]
share: yes
toc: no
---

> 任何一种武学，在实战中发挥作用时候，一定不是被武学大师从第一式到最后一式
> 按顺序耍一遍。
> 这样对手随便一变招，命就沒有了。
> 武学大师应该是把各式打散，穿插成了网络，这样对手如何变招都能接住。

任何[线性结构的知识](https://dustincys.github.io/cn/2017/09/iconman/)都无法被人脑长久记住。
[org-roam](https://www.orgroam.com/)的插入链接就是把“招式”编织成网络的绝招，其允许我们把记录的笔记穿
插成网路。
这更符合人脑的生理结构，因为相比较散布或线性结构的知识，图像化的知识更容易被理解和记住。
于是某书呆将[org-roam](https://www.orgroam.com/)这个哲学推广到博客系统，这样书呆的知识输出也编织成了网络。
岂不是也方便诸方大侠对某书呆武学的品评和印证？

```lisp
  (defun my-copy-blog-link-action (candidate)
    "copy blog link action"
    (let* ((abspath (car (split-string candidate ":")))
           (parts (split-string abspath "/"))
           (type-string (car (last (butlast parts 1)))))
      (if (string-equal type-string "_posts")
          (let* ((file-name-md (car (last parts)))
                 (fnm-parts (split-string file-name-md "-"))
                 (fnm-third-part (if (> (length fnm-parts) 3)
                                     (mapconcat 'identity (nthcdr 3 fnm-parts) "-")
                                   file-name-md)))
            (kill-new
             (concat "https://dustincys.github.io/cn/"
                     (car fnm-parts) "/"
                     (cadr fnm-parts) "/"
                     (file-name-sans-extension fnm-third-part) "/")))
        (kill-new
         (concat "https://dustincys.github.io/cn/"
                 type-string "/")))))

  (defun blog-helm-file-persistent-action-ag (candidate)
    "Persistent action for file-related functionality.
    Previews the contents of a file in a temporary buffer."
    (let* ((abspath (car (split-string candidate ":")))
           (lineno (cadr (split-string candidate ":"))))
      (if (file-exists-p abspath)
          (let ((buf (get-buffer-create "*helm-blog persistent*")))
            (cl-flet ((preview (abspath)
                               (switch-to-buffer buf)
                               (setq inhibit-read-only t)
                               (erase-buffer)
                               (insert-file-contents abspath)
                               (let ((buffer-file-name abspath))
                                 (set-auto-mode))
                               (font-lock-ensure)
                               (setq inhibit-read-only nil)
                               (goto-line (string-to-number lineno))))
              (if (and (helm-get-attr 'previewp)
                       (string= abspath (helm-get-attr 'current-candidate)))
                  (goto-line (string-to-number lineno))
                (preview abspath)))
            (helm-set-attr 'current-candidate abspath)
            (helm-set-attr 'previewp t))
        (if (and (helm-get-attr 'previewp)
                 (get-buffer "*helm-blog persistent*"))
            (progn
              (kill-buffer "*helm-blog persistent*")
              (helm-set-attr 'previewp nil))))))

  (defun my-helm-projectile-ag-blog-link ()
    "Customized helm-projectile-ag with custom actions."
    (interactive)
    (helm :sources
          (helm-build-sync-source "blog search (ag)"
            :candidates (lambda ()
                          (split-string
                           (shell-command-to-string
                            (format "ag --line-numbers --nocolor --hidden  %s %s --md"
                                    helm-pattern
                                    (projectile-project-root)))
                           "\n" t))
            :action '(("copy blog link to clipboard" . my-copy-blog-link-action))
            :persistent-action 'blog-helm-file-persistent-action-ag
            :persistent-help "Preview file"
            :follow 1)))
```

