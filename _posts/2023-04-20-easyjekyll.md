---
layout: post
category: technology
title: 自由博客系统之一--瞬时捕捉
matheq: no
comments: yes
tags: [自由博客系统, easyjekyll]
share: yes
toc: no
---

> 真正的自由是“我不想怎么样就不怎么样”。

之前用[easy-jekyll](https://github.com/masasam/emacs-easy-jekyll)每次想写点东西，需要打开这个插件，进入一个复杂页面，有各种快捷键，生成新博客的`markdown`文件或者其他操作。
我不想这么麻烦，想写点东西的时候，最好是打开`capture`，然后可以预览内容，选者哪一个文件，然后直接在`capture`窗口中编辑。
如果写到一半觉得没什么意思，那么就自动删除。
这样就彻底实现`capture`自由！
想添一添，减一减文字，只需要随时触发窗口捕捉瞬间的想法即可。

如下面代码所示，功能有以下几个方面：
1. 使用`helm`模糊搜索博文的`markdown`文件
2. 在搜索过程中自动预览文件内容
3. 如果没有选项则生成以搜索字符串为内容，以当前时间戳为前缀的`markdown`新文件为目标文件的`capture`
4. 在`capture`窗口中显示该目标文件全部内容
5. 在`capture`结束之前
   1. 检查tags:中是否有大些字母，如果有则转换为小写
   2. 检查capture中内容是否含有`https://yanshuo.site`和
      `https://slide.yanshuo.site`，如果有则转分别转换为
      `https://dustincys.github.io`和`https://dustincys.github.io/slide`。这是为
      了确保域名失效之后，依然还能使用。
6. 在`capture`结束，自动检查文件是不是空文件
   1. 如果是空文件，那么删除该文件
   2. 如果不是空文件，那么自动打开后台服务器，浏览网页

```lisp
(defun my-blog/post-init-default-org-config ()
  (defun mapcar* (function &rest args)
    "Apply FUNCTION to successive cars of all ARGS.
          Return the list of results."
    ;; If no list is exhausted,
    (if (not (memq nil args))
        ;; apply function to cars.
        (cons (apply function (mapcar 'car args))
              (apply 'mapcar* function
                     ;; Recurse for rest of elements.
                     (mapcar 'cdr args)))))
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
                                                     ".md"))))))
                     :filtered-candidate-transformer (lambda (candidate _source)
                                                       (if candidate
                                                           (append
                                                            candidate
                                                            (list
                                                             (propertize
                                                              helm-pattern
                                                              'face
                                                              'font-lock-warning-face)))
                                                         (list (propertize
                                                                helm-pattern
                                                                'face
                                                                'font-lock-warning-face))))
                     :persistent-action 'blog-helm-file-persistent-action
                     :persistent-help "Preview file"
                     :follow 1
                     )
          :initial-input "2"
          :buffer "*find blog*"))

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

  (defun blog-org-capture-after-finalize (file)
    "Function to be called after the capture is finalized.
      FILE is the target file name."
    (if (get-buffer "*helm-blog persistent*")
        (kill-buffer "*helm-blog persistent*"))
    (if (and (file-exists-p file)
             (let ((contents (with-temp-buffer
                               (insert-file-contents-literally file)
                               (buffer-string))))
               (or
                (= 0 (string-match-p "^[[:space:]\n]*$" contents))
                (string-empty-p contents))))
        (prog1
            (delete-file file)
          (message "Deleted empty file: %s" file))
      (blog-easy-jekyll-preview file)))

  (defun blog-org-capture-replace-function ()
    (with-current-buffer (org-capture-get :buffer)
      (save-excursion
        (goto-char (point-min))
        (while (search-forward-regexp "^\\(tags:.*\\)" nil t)
          (replace-match (downcase (match-string 1)))))
      (replace-string "https://yanshuo.site" "https://dustincys.github.io" nil (point-min) (point-max))
      (replace-string "https://slide.yanshuo.site" "https://dustincys.github.io/slide" nil (point-min) (point-max))))
  (defun blog-easy-jekyll-preview (file)
    "Preview jekyll at localhost."
    (if (file-exists-p file)
        (let* ((filename (file-name-nondirectory file))
               (s_list (split-string filename "[-.]"))
               (blog-preview-url (format "%s%s/%s/%s/" easy-jekyll-preview-url
                                         (nth 0 s_list)
                                         (nth 1 s_list)
                                         (when (string-match
                                                "[0-9]\\{4\\}-[0-9]\\{2\\}-[0-9]\\{2\\}-\\(.*\\).md"
                                                filename)
                                           (match-string 1 filename))
                                         )))
          (easy-jekyll-with-env
           (when easy-jekyll-publish-production
             (setenv "JEKYLL_ENV" "development"))
           (if (process-live-p easy-jekyll--server-process)
               (browse-url blog-preview-url)
             (progn
               (setq easy-jekyll--server-process
                     (start-process "jekyll-serve" easy-jekyll--preview-buffer
                                    "bundle" "exec" "jekyll" "serve" easy-jekyll-serve-flags easy-jekyll-serve-value easy-jekyll-serve-flags2 easy-jekyll-serve-value2))
               (while easy-jekyll--preview-loop
                 (if (equal (easy-jekyll--preview-status) "200")
                     (progn
                       (setq easy-jekyll--preview-loop nil)
                       (browse-url blog-preview-url)))
                 (sleep-for 0 100)
                 (if (and (eq (process-status easy-jekyll--server-process) 'exit)
                          (not (equal (process-exit-status easy-jekyll--server-process) 0)))
                     (progn
                       (switch-to-buffer easy-jekyll--preview-buffer)
                       (error "Jekyll error look at %s buffer" easy-jekyll--preview-buffer))))
               (setq easy-jekyll--preview-loop t)
               (run-at-time easy-jekyll-previewtime nil 'easy-jekyll--preview-end)))))))

  (add-to-list 'org-capture-templates
               '("b" "blog" plain (file+function (lambda () (blog-helm-find-files "~/github/blog/cn/_posts/"))
                                                 (lambda () (goto-char (point-max))))
                 "%?"
                 :unnarrowed t
                 :kill-buffer-on-finish t
                 :before-finalize blog-org-capture-replace-function
                 :after-finalize (lambda ()
                                   (blog-org-capture-after-finalize
                                    (buffer-file-name (marker-buffer org-capture-last-stored-marker)))))))
```
