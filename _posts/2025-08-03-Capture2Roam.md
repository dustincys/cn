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

2025-11-13更新：

以上，所有各级标题都在一个级别目录内，且无法进行roam跳转。
所以一个更合理的函数是`my-org/roam-capture-to-headline`，能够把当前roam节点的org文件中所有标题构建一个树形结构，然后按照树形结构逐级来回跳转，同时如果是链接到新节点，那么提供选项跳到新节点。并提供反跳会含有该节点连接的任意节点。
这就真正意义上实现了“漫游”。

```elisp
  (cl-defstruct hl-node title begin level children parent)

  (defun my-org/parse-headline-tree ()
    "Return headline tree for current buffer."
    (let* ((parsed (org-element-parse-buffer))
           (root (make-hl-node :title "ROOT" :begin (point-min) :level 0 :children nil))
           (stack (list root)))
      (org-element-map parsed 'headline
        (lambda (hl)
          (let* ((title (org-element-property :raw-value hl))
                 (level (org-element-property :level hl))
                 (begin (org-element-property :begin hl))
                 (node (make-hl-node :title title :level level :begin begin :children nil)))
            ;; Pop stack until parent level matches
            (while (> (hl-node-level (car stack)) (1- level))
              (pop stack))
            ;; Add node to parent's children
            (setf (hl-node-children (car stack))
                  (cons node (hl-node-children (car stack))))
            ;; Push node to stack
            (push node stack))))
      ;; Reverse children lists recursively
      (cl-labels ((fix (n)
                    (setf (hl-node-children n)
                          (mapcar #'fix (nreverse (hl-node-children n))))
                    n))
        (fix root))))

  (defun my-org/set-parents (node &optional parent)
    (setf (hl-node-parent node) parent)
    (dolist (c (hl-node-children node))
      (my-org/set-parents c node))
    node)


  (defun my-org/extract-id-from-link (s)
    "Return Org-roam ID if S contains a link of the form [[id:UUID]]."
    (when (string-match "\\[\\[id:\\([-0-9a-f]+\\)\\]\\[[^]]*\\]\\]" s)
      (match-string 1 s)))


  (defun my-org/helm-select-from-tree (node)
    "Recursively choose a headline from NODE. Return either:
 - an hl-node
 - or (node . new-title) for insertion."
    (let* ((children (hl-node-children node))
           (parent (when (> (hl-node-level node) 0) (hl-node-parent node)))
           (node-title (when node (hl-node-title node)))
           (node-id (when node-title (my-org/extract-id-from-link node-title)))
           (child-cands (mapcar (lambda (c) (cons (hl-node-title c) c))
                                children)))

      (helm
       :prompt (format "Choose in [%s]: " (hl-node-title node))
       :sources
       (list
        ;; ---- Source 1 ----
        (helm-build-sync-source "Actions"
          :match (lambda (_) t)
          :candidates
          (append
           (when parent (list (cons "↑↑ Go up" :up)))
           (when node-id (list (cons "→→ Open linked node" :open-link)))
           (list (cons "++ Create new headline WITH typed prefix" :create-with-prefix))
           (list (cons "+- Create new headline WITHOUT prefix" :create-no-prefix))
           (list (cons "↩↩ Open backlinks" :open-backlinks))
           (list (cons "XX Cancel" :cancel))
           )
          :action
          (lambda (choice)
            (cond
             ((eq choice :up)
              (my-org/helm-select-from-tree parent))
             ((eq choice :cancel)
              :cancel)
             ((eq choice :open-backlinks)
              ;; Call backlink selector for current file
              (let ((current-file (buffer-file-name)))
                (my-org/helm-open-backlinks current-file)))
             ;; open linked node
             ((eq choice :open-link)
              (let ((target (org-roam-node-from-id node-id)))
                (when target
                  (find-file (org-roam-node-file target))
                  (goto-char (point-min))
                  (my-org/helm-select-from-tree
                   (my-org/set-parents
                    (my-org/parse-headline-tree))))))
             ((memq choice '(:create-with-prefix :create-no-prefix))
              ;; Return: (node . (choice . typed-text))
              (cons node (cons choice helm-pattern))))))
        ;; ---- Source 2 ----
        (helm-build-sync-source "Headlines"
          :candidates child-cands
          :action (lambda (choice)
                    (my-org/helm-select-from-tree choice)))))))


  ;; (my-org/helm-select-from-tree (my-org/set-parents (my-org/parse-headline-tree)))
  (defun my-org/roam-capture-to-tree ()
    "Use the headline tree selector and insert according to returned action.
Return the point where the content ends up."
    (interactive)
    (let* ((node (org-roam-node-read))
           (file (org-roam-node-file node))
           ;; Step 1: parse headline tree in a temp buffer
           (root (with-current-buffer (find-file-noselect file)
                   (org-mode)
                   (org-element-cache-reset)
                   (my-org/set-parents (my-org/parse-headline-tree))))
           ;; Step 2: let user select headline or create new
           (result (my-org/helm-select-from-tree root))
           parent-node typed insert-point)
      ;; Step 3: switch to actual file buffer for insertion
      (find-file file)
      (pcase result
        ;; Cancel
        (:cancel
         nil)
        ;; Create with prefix: insert typed headline under parent
        (`(,parent . (:create-with-prefix . ,typed))
         (setq parent-node parent)
         (goto-char (hl-node-begin parent-node))
         (unless (string-empty-p typed)
           (org-end-of-subtree t)
           (unless (bolp) (insert "\n"))
           (insert (make-string (+ 1 (hl-node-level parent-node)) ?*) " " typed))
         (setq insert-point (point)))
        ;; Create NO prefix: insert empty under parent
        (`(,parent . (:create-no-prefix . ,_typed))
         (setq parent-node parent)
         (goto-char (hl-node-begin parent-node))
         (setq insert-point (point)))
        ;; Should not happen
        (_
         nil))
      insert-point))
  (defun my-org/get-backlink-nodes (file)
    "Return a list of (source-id . source-file) that link to FILE."
    (org-roam-db-query
     [:select [links:source nodes:file]
              :from links
              :left-join nodes
              :on (= links:source nodes:id)
              :where (= links:dest
                        [:select id
                                 :from nodes
                                 :where (= file $s1)])]
     file))

  (defun my-org/helm-open-backlinks (current-file)
    "Helm interface to open backlinks of CURRENT-FILE.
Returns the node struct of the selected backlink file."
    (let* ((backlinks (my-org/get-backlink-nodes current-file))
           (candidates
            (mapcar (lambda (row)
                      (let* ((src-id (car row))
                             (src-file (cadr row))
                             (node (org-roam-node-from-id src-id)))
                        (cons (org-roam-node-title node) node)))
                    backlinks)))
      (helm :prompt "Backlinks: "
            :sources
            (helm-build-sync-source "Backlinked Nodes"
              :candidates candidates
              :action (lambda (node)
                        (let ((file (org-roam-node-file node)))
                          (find-file file)
                          (goto-char (point-min))
                          (my-org/helm-select-from-tree
                           (with-current-buffer (current-buffer)
                             (my-org/set-parents (my-org/parse-headline-tree))))))))))
```

