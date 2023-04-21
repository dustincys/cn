---
layout: post
category: technology
title: 自由博客
matheq: no
comments: yes
tags: [自由, 博客, easyjekyll]
share: yes
toc: no
---

> 真正的自由是“我不想怎么样就不怎么样”。

之前用[easy-jekyll](https://github.com/masasam/emacs-easy-jekyll)每次想写点东西，需要打开这个插件，进入一个复杂页面，有各种快捷键，生成新博客的markdown文件或者其他操作。
我不想这么麻烦，想写点东西的时候，最好是打开capture，然后可以预览内容，选者哪一个文件，然后直接在capture窗口中编辑。
然后就如下所示：
```lisp
(when (configuration-layer/package-used-p 'helm)
  (defun blog-helm-find-files (dir)
    "Show all files in a directory using Helm."
    (interactive "D")
    (helm :sources (helm-build-sync-source "All Files in Directory"
                     :candidates (let ((mds (reverse (directory-files-recursively dir ".md"))))
                                   (mapcar* #'cons (mapcar #'f-filename mds) mds))
                     :action '(
                               ("edit file" .
                                (lambda (candidate)
                                  (if (file-exists-p candidate)
                                      (message "%s" candidate)
                                    (message "%s"
                                             (concat dir
                                                     (format-time-string
                                                      "%Y-%m-%d"
                                                      (current-time))
                                                     "-"
                                                     candidate
                                                     ".md")))))
                               )
                     :filtered-candidate-transformer (lambda (candidate _source)
                                                       (if candidate
                                                           candidate
                                                         (list (propertize helm-pattern 'face 'font-lock-warning-face))))
                     :persistent-action 'blog-helm-file-persistent-action
                     :persistent-help "Preview file"
                     :follow 1
                     )
          :buffer "*find blog*"
          ))

  (defun blog-helm-file-persistent-action (candidate)
    "Persistent action for file-related functionality.

Previews the contents of a file in a temporary buffer."
    (if (file-exists-p candidate)
        (let ((buf (get-buffer-create "*helm-blog persistent*")))
          (cl-flet ((preview (candidate)
                             (switch-to-buffer buf)
                             (setq inhibit-read-only t)
                             (erase-buffer)
                             (insert-file-contents candidate)
                             (let ((buffer-file-name candidate))
                               (set-auto-mode))
                             (font-lock-ensure)
                             (setq inhibit-read-only nil)))
            (if (and (helm-get-attr 'previewp)
                     (string= candidate (helm-get-attr 'current-candidate)))
                (progn
                  (kill-buffer buf)
                  (helm-set-attr 'previewp nil))
              (preview candidate)
              (helm-set-attr 'previewp t)))
          (helm-set-attr 'current-candidate candidate)
          )
      (if (and (helm-get-attr 'previewp)
               (get-buffer "*helm-blog persistent*"))
          (progn
            (kill-buffer "*helm-blog persistent*")
            (helm-set-attr 'previewp nil)))))

  (add-to-list 'org-capture-templates
               '("b" "blog" plain (file+function (lambda () (blog-helm-find-files "~/github/blog/cn/_posts/"))
                                                 (lambda () (goto-char (point-max))))
                 "%?"
                 :jump-to-captured t
                 :unnarrowed t))
  )
```

