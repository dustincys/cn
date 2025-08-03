---
layout: post
category: technology
title: 用于Capture到Org-roam知识库的模板函数
matheq: no
comments: yes
tags: [org-roam, emacs, 知识管理, 信息管理]
share: yes
toc: no
---

合理的org捕获模板应该使其具备：捕获内容到org-roam知识库中任意一个标题之下。
且这个模板应该有一个函数自动寻找目标地址。

例如，有如下模板：

```elisp
      (setq org-capture-templates
            '(; For email todo ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
              ("e" "Email todo")
              ("et" "Mail org file" entry (file+headline "~/NutstoreFiles/Nutstore/org-roam/20220715212413-mail.org" "Mails TODO")
               "* TODO %?	 :MAIL:%^{Set tag|WORK|HOME|BABY|}:\n%U %a")
              ("eo" "Mail org file" entry (function my-org/roam-capture-to-headline)
               "* TODO %?	 :MAIL:\n%U %a")
              ("t" "Temp todo templates")
              ("tt" "Temp org file" entry (file+headline "~/NutstoreFiles/Nutstore/org-roam/20220715212959-temp.org" "Temporary task")
               "* TODO %?    :%^{Set tag|WORK|HOME|BABY|}:"
               :jump-to-captured t)
              ("to" "Org-roam TODO" entry (function my-org/roam-capture-to-headline)
               "* TODO %?"
               :jump-to-captured t))
```

那么如果设置如下函数，可以实现更智能的目标查找。

```elisp
(defun my-org/roam-capture-to-headline ()
    "Visit an Org-roam file and move point just under a chosen headline."
    (let* ((node (org-roam-node-read))
           (file (org-roam-node-file node))
           (headline
            (with-current-buffer (find-file-noselect file)
              (org-mode)
              (org-element-cache-reset)
              (let ((headlines
                     (org-element-map (org-element-parse-buffer) 'headline
                       (lambda (hl)
                         (org-element-property :raw-value hl)))))
                (completing-read "Choose headline: " headlines nil nil)))))
      (find-file file)
      (goto-char (point-min))
      (if (re-search-forward
           (format org-complex-heading-regexp-format (regexp-quote headline))
           nil t)
          (point)
        (progn
          (goto-char (point-max))
          (unless (bolp) (insert "\n\n"))
          (if (yes-or-no-p "Insert the new headline?")
              (insert (concat "* " headline)))
          (point)))))
```

