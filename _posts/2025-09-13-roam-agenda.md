---
layout: post
category: technology
title: 机器应该如何理解人类的注意力？
matheq: no
comments: yes
tags: [org-agenda-files, org-roam, 注意力]
share: yes
toc: no
---

在高效管理时间和日程时，我们需要正视几个基本事实：
人类大脑的存储能力有限，注意力资源稀缺，时间以线性方式不可逆地流逝，同时计算机的算力也存在上限。
因此，在实践日程安排时，必须从海量文件中精准提取关键待办事项。
对于已完成的任务，应效仿大脑的“遗忘”机制，自动将其忽略，以避免资源浪费。
这样不仅能节省算力，还能实现快速、动态的日程优化，在纷繁事务中维持高效与平衡。
这种仿生型时间管理系统，本质上是在数字世界重构了人类认知的过滤机制。当技术开始理
解我们的注意力如何分配时，真正的效率革命才会发生。

对于org-roam的节点node文件，需要判断其所有内容是否都完成，如果完成是不是已经过去1月时间。
如果是，在查看日程时，忽略这个文件。
```lisp
(defun my-org/org-contains-agenda-p (&optional minutes)
    "Return non-nil if current buffer has any relevant task.

This includes:
- TODO entries,
- Entries not marked DONE but scheduled or with a deadline,
- DONE entries that have clock-in/out information."
    (let ((minutes (or minutes 43200)))
      (org-element-map
          (org-element-parse-buffer 'headline)
          'headline
        (lambda (h)
          (let* ((todo-type (org-element-property :todo-type h))
                 (scheduled (org-element-property :scheduled h))
                 (deadline (org-element-property :deadline h))
                 (contents-begin (org-element-property :contents-begin h))
                 (contents-end (org-element-property :contents-end h))
                 (clocked-in
                  (when (and contents-begin contents-end)
                    (save-excursion
                      (goto-char contents-begin)
                      (re-search-forward "CLOCK:.*" contents-end t))))
                 (recent-clock-out
                  (when (and contents-begin contents-end)
                    (save-excursion
                      (goto-char contents-begin)
                      (when (re-search-forward
                             "CLOCK:.*--\\(\\[[^]]+\\]\\)" contents-end t)
                        (let* ((time-str (match-string 1))
                               (time (org-time-string-to-time time-str))
                               (diff (float-time
                                      (time-subtract (current-time) time))))
                          (< diff (* minutes 60)))))))
                 )
            (or (eq todo-type 'todo)
                (and (not (eq todo-type 'done))
                     (or scheduled deadline))
                (and (eq todo-type 'done)
                     clocked-in
                     recent-clock-out)
                )))
        nil 'first-match)))
```
但随着时间流逝，我们需要在构建日程之前，自动检查文件是否已经“过期”，如果是，自动更新标签。
```lisp
(defun my-org/org-agenda-files ()
    "Return a list of note files containing 'agenda' tag and with relevant tasks."
    (let* ((agenda-files
            (seq-uniq
             (seq-map
              #'car
              (org-roam-db-query
               [:select [nodes:file]
                        :from tags
                        :left-join nodes
                        :on (= tags:node-id nodes:id)
                        :where (glob tag "AGENDA")]))))
           (tagged-files
            (seq-uniq
             (seq-map
              #'car
              (org-roam-db-query
               [:select [nodes:file]
                        :from tags
                        :left-join nodes
                        :on (= tags:node-id nodes:id)
                        :where (glob tag "agenda")]))))
           (today (format-time-string "%Y-%m-%d"))
           (already-run (and my-org/daily-last-filter-tag-date
                             (string= today my-org/daily-last-filter-tag-date))))
      (if already-run
          (seq-uniq (append
                     tagged-files
                     agenda-files))
        (setq my-org/daily-last-filter-tag-date today)
        (prog2
            (org-roam-db-sync)
            (seq-uniq (append
                       (seq-filter
                        (lambda (file)
                          (when (and file (file-exists-p file))
                            (with-current-buffer (find-file-noselect file)
                              (let ((is-agenda-file (my-org/org-agenda-update-tag)))
                                (when (buffer-modified-p)
                                  (save-buffer))
                                is-agenda-file))))
                        tagged-files)
                       agenda-files))
          (org-roam-db-sync)))))
```
但为了优化计算，每天只更新一次。
所以需要设置一个全局变量来判断。
```elisp
  (defvar my-org/daily-last-filter-tag-date nil
    "The date when `my-org/org-agenda-files' was last successfully run.")
```
这样将以上逻辑添加入日程管理的步骤中即可。
```lisp
  (defun my-org/org-agenda-files-update (&rest _)
    "Update the value of `org-agenda-files'."
    (setq org-agenda-files (my-org/org-agenda-files)))

  (add-hook 'find-file-hook #'my-org/org-agenda-update-tag)
  (add-hook 'before-save-hook #'my-org/org-agenda-update-tag)

  (dolist (fn '(org-agenda org-agenda-list org-todo-list))
    (when (fboundp fn)
      (advice-add fn :before #'my-org/org-agenda-files-update)))
```
