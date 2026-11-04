---
layout: post
category: technology
title: 在Notmuch Message中用Ranger管理邮件附件
matheq: no
comments: yes
tags: [emacs, notmuch, ranger, spacemacs, 邮件]
share: yes
toc: yes
---

用 [notmuch](https://notmuchmail.org/) 收发邮件已有若干年。检索与阅读都很轻快，唯独附件一项不太顺手：在 `notmuch-message-mode` 里挂附件，标准做法是 `C-c C-a` 调 `mml-attach-file`，一次一个文件，路径要靠 `completing-read` 一层层点下去。写一封带七八个文件（源码、图、PDF）的信，或者干脆要把一整个目录打包带上时，这套流程就显得笨拙。

而 Emacs 里的文件管理，我一直用 [ranger.el](https://github.com/ralesi/ranger)。多栏目录漫游，`t` 选择、`TAB` 选择并下移，肌肉记忆早已形成。年初还写过一篇[《如何优雅地给spacemacs打补丁》](https://dustincys.github.io/cn/2026/03/patch/)，讲的正是它在 dired 之上做了哪些手脚。既然 ranger 只是 dired 之上的又一层 UI，那么让它暂时放下"文件管理器"的身份，改行做"附件选择器"，似乎是顺理成章的事。

于是有了 `attachment-ranger.el`（v0.2.0）。行为很朴素：在写信缓冲区里按 `C-c C-a`，跳进 ranger，像平常一样选文件、选目录，再按 `C-c C-a` 应用；不满意就按 `q` 走人，原信一字不动。

## 按键约定

| 键 | 作用 |
| --- | --- |
| `t` | 切换当前项的选择状态 |
| `TAB` | 切换选择并下移一行 |
| `C-c C-a` | 同步附件并返回邮件 |
| `q` | 放弃本次选择并返回邮件 |

两条隐含的规矩很重要：

其一，**选择跨目录保持**。在 `~/Downloads` 里选了两个文件，切到 `~/Documents` 再选三个，五个都算数，直到按下 `C-c C-a` 为止。

其二，**只同步自己插入的内容**。这个包在信件正文里维护一段由它托管的 MML 区域，你手写的 `<#multipart>`、`<#part>` 之类的 MML 标记一概不碰；反过来说，如果你手动改动过它托管的那一段，它会拒绝覆盖并报错。

## 状态分层

写这种"从工具 A 里操作工具 B 的缓冲区"的小包，麻烦往往不在功能本身，而在状态该放在哪里。这里的做法是分成两层：

一层是**每个 message 缓冲区自己的状态**，用 `defvar-local` 声明，随缓冲区生死：

```elisp
(defvar-local attachment-ranger--items nil
  "Selected files/directories for this message.")

(defvar-local attachment-ranger--files nil
  "Expanded regular files attached to this message.")

(defvar-local attachment-ranger--start nil
  "Start marker of managed MML region.")

(defvar-local attachment-ranger--end nil
  "End marker of managed MML region.")

(defvar-local attachment-ranger--snapshot nil
  "Expected text of managed MML region.")

(defvar-local attachment-ranger--directory nil
  "Last attachment directory for this message.")
```

注意 `--items` 与 `--files` 是分开记的：前者是你选的目录与文件（可能含目录），后者是目录递归展开之后的真实文件列表。再次打开选择器时应该停在原来的目录、恢复原来的勾选，而不是只知道最终展开了哪些文件。

另一层是**一次拾取会话的全局状态**：源邮件缓冲区、临时选择、打开 ranger 之前的窗口配置、本次访问过的所有 ranger 缓冲区，以及一个重入保护标志。

```elisp
(defvar attachment-ranger--mail nil
  "Message buffer currently using the picker.")

(defvar attachment-ranger--selection nil
  "Temporary selection during picker session.")

(defvar attachment-ranger--windows nil
  "Window configuration before opening the picker.")

(defvar attachment-ranger--buffers nil
  "Ranger buffers visited during this session.")

(defvar attachment-ranger--busy nil
  "Non-nil while updating picker marks.")
```

`--buffers` 这一项值得解释：ranger.el 每进入一个目录就换上对应的缓冲区，所以"当前 ranger 缓冲区"是会变的。会话结束时要把这一路上进过的每一个缓冲区里的 picker 模式都关掉，否则键位会漏在某个还开着的目录缓冲区里。`--busy` 则是给重绘 mark 时的保护开关，避免 `dired-mark` 触发的钩子递归回到重绘函数。

## 只加一层临时的 minor mode

不要改 ranger 的键位表，也不要改写 ranger 的函数。最干净的办法是定义一个只在选择期间生效的 minor mode：

```elisp
(defvar attachment-ranger-picker-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map (kbd "t")     #'attachment-ranger-toggle)
    (define-key map (kbd "TAB")   #'attachment-ranger-toggle-next)
    (define-key map (kbd "<tab>") #'attachment-ranger-toggle-next)
    (define-key map (kbd "C-c C-a") #'attachment-ranger-commit)
    (define-key map (kbd "q")     #'attachment-ranger-cancel)
    map)
  "Keymap active only during attachment selection.")

(define-minor-mode attachment-ranger-picker-mode
  "Minor mode for selecting mail attachments."
  :init-value nil
  :lighter " Attach"
  :keymap attachment-ranger-picker-mode-map)
```

minor mode 的键位优先级高于主模式，而 `C-c C-a` 是保留给用户的组合，ranger 本身不会占用，正好不冲突。

用 Evil 或 Spacemacs 的话还要补一刀：evil 有自己的状态键位表，光有 minor mode 的 keymap 在 normal 状态下不生效。所以要显式地把这套键位挂到 evil 的 `normal`、`motion`、`visual`、`insert` 四个状态上：

```elisp
(with-eval-after-load 'evil
  (evil-define-minor-mode-key
    '(normal motion visual insert)
    'attachment-ranger-picker-mode
    (kbd "t") #'attachment-ranger-toggle
    (kbd "TAB") #'attachment-ranger-toggle-next
    (kbd "<tab>") #'attachment-ranger-toggle-next
    (kbd "C-c C-a") #'attachment-ranger-commit
    (kbd "q") #'attachment-ranger-cancel))
```

还有一个细节：ranger 换目录之后，新缓冲区里并没有开启 picker 模式。所以把"给当前缓冲区补上 picker 模式、并把已选项重新标出来"挂到 `post-command-hook` 上，每次命令执行完检查一遍：

```elisp
(defun attachment-ranger--activate-current-buffer ()
  "Activate picker mode for the selected Ranger buffer."
  (when (and (attachment-ranger--active-p)
             (attachment-ranger--ranger-buffer-p)
             (not attachment-ranger--busy))
    (unless attachment-ranger-picker-mode
      (attachment-ranger-picker-mode 1))
    (cl-pushnew (current-buffer)
                attachment-ranger--buffers)
    (attachment-ranger--paint-marks)))
```

## 用 dired 的 mark 当视觉反馈

选择状态不必另画一套高亮：ranger 的每一行本来就是 dired 的行，直接调用 `dired-mark` / `dired-unmark` 把选中项标上 `*` 即可。好处是大得不成比例的——你看到的就是平时熟悉的那个星号，ranger 的一应显示设置也照旧生效。

代价是要绕过 dired 的只读与副作用：动态绑定 `inhibit-read-only`，事后再恢复原本的 `buffer-modified-p`，并用 `--busy` 挡住重入。下面只留骨架，逐行比对与标记的具体动作从略：

```elisp
(defun attachment-ranger--paint-marks ()
  "Restore Dired marks from attachment selection."
  (when (and (attachment-ranger--active-p)
             (attachment-ranger--ranger-buffer-p)
             (not attachment-ranger--busy))
    (let ((attachment-ranger--busy t)
          (inhibit-read-only t)
          (was-modified (buffer-modified-p)))
      (save-excursion
        (goto-char (point-min))
        (while (not (eobp))
          ;; ...逐行比对 (member (normalize file) selection)
          ;; 该标而未标的 dired-mark，该掉而未掉的 dired-unmark
          ))
      (set-buffer-modified-p was-modified))))
```

比对用的是 `expand-file-name` 归一化之后的绝对路径。ranger 在不同目录下传给 `dired-get-filename` 的可能是相对路径，不归一化就会漏标。

## 托管区域：怎么只覆盖自己的那一份

这是整个包里最需要小心的地方。信件正文在 `message-mode` 眼里是普通文本，附件以 MML 标记的形式嵌在里面。如果每次提交都粗暴地"清空所有附件再重加"，用户手写的标记就没了；反过来只加不删，同一个文件会被挂三四遍。

办法是维护一段**由本包托管**的区域：用它插入时的起点与终点的 marker，加上一段文本快照。

```elisp
(defun attachment-ranger--check-mml ()
  "Ensure previously managed MML text has not been changed."
  (let ((start attachment-ranger--start)
        (end attachment-ranger--end))
    (when (or start end)
      (unless
          (and (markerp start)
               (markerp end)
               (eq (marker-buffer start) (current-buffer))
               (eq (marker-buffer end) (current-buffer))
               (<= start end)
               (equal
                (buffer-substring-no-properties start end)
                attachment-ranger--snapshot))
        (user-error
         "Managed attachment region changed; refusing to overwrite")))))
```

提交前先校验收管区域是否仍是当初插入的样子：如果不一致，说明中间有人手动改过，此时报错退出比悄悄覆盖要负责任得多。

校验通过之后的同步本体，把"删旧的、插新的、更新标记与快照"包在 `atomic-change-group` 里：

```elisp
(defun attachment-ranger--sync (files items)
  "Synchronize FILES and remember selected ITEMS.
This function must be called in a message composition buffer."
  (unless (derived-mode-p 'message-mode)
    (user-error "Not a message composition buffer"))

  (attachment-ranger--check-mml)

  (unless (equal files attachment-ranger--files)
    (atomic-change-group
      (save-excursion
        (let ((old-start attachment-ranger--start)
              (old-end attachment-ranger--end)
              (mml-attach-file-at-the-end nil))

          ;; Remove only previously managed attachments.
          (if (and old-start old-end)
              (progn
                (goto-char old-start)
                (delete-region old-start old-end))
            (goto-char (point-max)))

          ;; Insert the new managed attachment group.
          (let ((begin (point)))
            (when files
              (insert "\n")
              (dolist (file files)
                (mml-attach-file
                 file
                 (or (mm-default-file-type file)
                     "application/octet-stream")
                 nil
                 "attachment")))

            (let ((finish (point))
                  (snapshot
                   (buffer-substring-no-properties
                    begin (point))))

              ;; Clear previous markers.
              (when (markerp old-start) (set-marker old-start nil))
              (when (markerp old-end) (set-marker old-end nil))

              (if files
                  (setq attachment-ranger--start (copy-marker begin nil)
                        attachment-ranger--end   (copy-marker finish t)
                        attachment-ranger--snapshot snapshot)
                (setq attachment-ranger--start nil
                      attachment-ranger--end nil
                      attachment-ranger--snapshot nil)))))))

    ;; Keep directory selections independently of expanded files.
    (setq attachment-ranger--files (copy-sequence files)
          attachment-ranger--items (copy-sequence items))))
```

三处值得留意：

- `mml-attach-file-at-the-end` 动态绑定为 `nil`。默认情况下 `mml-attach-file` 会把附件插到 `point-max`，只有把它按下去，才能在光标所在地插入，从而保证整段托管区域连续。
- 终点 marker 用 `(copy-marker finish t)`，插入类型为 `t`：以后在区域末尾继续输入时，终点会跟着往后走，而起点用 `nil` 固定在前面。marker 的插入类型在这种场景里不是可有可无的细节。
- 只有当展开后的 `files` 真的变了才动正文。仅仅改选了目录（比如把一个目录换成它下面的子目录，展开结果相同）时，正文保持不动，只更新 `--items`。

## 失败就留在 ranger

提交函数有一处刻意的顺序安排：先 `sync`，再 `exit`。

```elisp
(defun attachment-ranger-commit ()
  "Synchronize selected attachments and return to the email."
  (interactive)
  (unless (attachment-ranger--active-p)
    (user-error "No active attachment picker"))

  (let* ((mail attachment-ranger--mail)
         (items (copy-sequence attachment-ranger--selection))
         (directory default-directory)
         (files (attachment-ranger--expand items)))

    ;; If synchronization fails, remain in Ranger so that
    ;; selections are not lost.
    (with-current-buffer mail
      (attachment-ranger--sync files items)
      (setq attachment-ranger--directory directory))

    (attachment-ranger--exit)

    (message "Attachments synchronized: %d file(s)" (length files))))
```

如果 `sync` 因为快照校验失败而抛错，`exit` 根本执行不到，人还留在 ranger 里，刚才在若干目录间辛苦攒下的选择也还在——改完邮件正文里的托管区域之后，可以再提交一次。

退出流程则要处理相反的问题：清理工作本身可能出错（比如 ranger 的状态已经不正常），但无论出错与否，都必须恢复窗口配置、回到邮件缓冲区。

```elisp
(defun attachment-ranger--exit ()
  "Close the picker and restore the original mail window."
  (let ((mail attachment-ranger--mail)
        (config attachment-ranger--windows))

    (attachment-ranger--clear-session)

    ;; Do not allow Ranger cleanup failure to block returning.
    (unwind-protect
        (condition-case err
            (when (fboundp 'ranger-disable)
              (ranger-disable))
          (error
           (message "Ranger cleanup: %s" (error-message-string err))))

      (when config
        (set-window-configuration config))

      (when (buffer-live-p mail)
        (pop-to-buffer-same-window mail)))))
```

关闭模式的顺序在会话清理里也有一条讲究：先把 `attachment-ranger--mail` 置空，再逐个关闭 picker 模式。反过来的话，关闭模式时触发的钩子会看到"会话仍在"，从而再次进入激活分支，老死循环。

再配一个应急出口 `attachment-ranger-reset`：会话万一卡住（比如 ranger 抛错但没走到清理），可以手工复位，而不影响已经写好的信。

## 目录展开

选中目录时，`attachment-ranger--expand` 用 `directory-files-recursively` 递归收集其中的普通文件，过滤非法项，去重，并在数量超过 `attachment-ranger-directory-limit`（默认 100）时弹一次确认——防止手一滑把 `~/` 整个挂到信上。

这份清单只用于生成 MML，原始选择仍存在 `--items` 里，所以"上次选了哪两个目录"这个信息不会因为展开而丢失。

## 安装与配置

把 `attachment-ranger.el` 放到 `load-path` 上即可。三个自定义变量都有合理的默认值：

```elisp
(use-package attachment-ranger
  :load-path "~/path/to/attachment-ranger"
  :after (notmuch ranger)
  :custom
  (attachment-ranger-default-directory "~/Downloads/")
  (attachment-ranger-use-deer nil)
  (attachment-ranger-directory-limit 100))
```

依赖是 Emacs 29.1 与 ranger 0.9.9。`attachment-ranger-use-deer` 置 `t` 时用 Deer 代替完整的 ranger，多窗口环境下更省事。

`C-c C-a` 的绑定由包内自行完成：

```elisp
(with-eval-after-load 'notmuch-message
  (define-key notmuch-message-mode-map
              (kbd "C-c C-a")
              #'attachment-ranger-open))
```

这条绑定会覆盖 notmuch 原本挂在 `C-c C-a` 上的 `mml-attach-file`。如果你想保留单文件挂载的入口，把上面这一句的键位换掉，或者干脆在 picker 里选一个文件，效果是一样的。

## 几个踩过的坑

- **模式检查**：`notmuch-message-mode` 派生于 `message-mode`，但反过来不成立。打开选择器时检查前者，同步时检查后者，这两个检查的位置不能混。
- **`dired-get-filename` 的第二个参数**：一律传 `t`（no-error），否则光标落在 `..` 或标题行上时会直接抛错。
- **`q` 的语义**：`q` 只是放弃本次的勾选变化，已经提交过的附件不会被撤销。要撤附件，就在 picker 里把对应项取消勾选再提交。
- **Deer 与 Ranger 的差别**：Deer 复用当前窗口，没有独立的 ranger 布局，退出时 `ranger-disable` 的行为也略有不同；`unwind-protect` 那一段正是为了兜住这些差异。

## 完整源码

```elisp
;;; attachment-ranger.el --- Ranger picker for Notmuch -*- lexical-binding: t; -*-

;; Version: 0.2.0
;; Package-Requires: ((emacs "29.1") (ranger "0.9.9"))
;; Keywords: mail, files

;;; Commentary:
;;
;; Notmuch:
;;   C-c C-a  Open attachment picker
;;
;; Ranger/Deer attachment picker:
;;   t        Toggle selection
;;   TAB      Toggle selection and advance
;;   C-c C-a  Synchronize attachments and return
;;   q        Cancel selection and return
;;
;; Selections persist across directory navigation.
;; Only attachments created by this package are synchronized.
;; Ordinary Ranger key bindings remain unchanged outside the picker.

;;; Code:

(require 'cl-lib)
(require 'seq)
(require 'dired)
(require 'message)
(require 'mml)
(require 'mm-util)

(defgroup attachment-ranger nil
  "Manage mail attachments using Ranger."
  :group 'mail)

(defcustom attachment-ranger-default-directory "~/Downloads/"
  "Initial attachment directory."
  :type 'directory
  :group 'attachment-ranger)

(defcustom attachment-ranger-use-deer nil
  "Use Deer instead of full Ranger when non-nil."
  :type 'boolean
  :group 'attachment-ranger)

(defcustom attachment-ranger-directory-limit 100
  "Ask confirmation when attaching more than this many directory files."
  :type 'integer
  :group 'attachment-ranger)

;; ============================================================
;; State belonging to each message buffer
;; ============================================================

(defvar-local attachment-ranger--items nil
  "Selected files/directories for this message.")

(defvar-local attachment-ranger--files nil
  "Expanded regular files attached to this message.")

(defvar-local attachment-ranger--start nil
  "Start marker of managed MML region.")

(defvar-local attachment-ranger--end nil
  "End marker of managed MML region.")

(defvar-local attachment-ranger--snapshot nil
  "Expected text of managed MML region.")

(defvar-local attachment-ranger--directory nil
  "Last attachment directory for this message.")

;; ============================================================
;; Global active picker session
;; ============================================================

(defvar attachment-ranger--mail nil
  "Message buffer currently using the picker.")

(defvar attachment-ranger--selection nil
  "Temporary selection during picker session.")

(defvar attachment-ranger--windows nil
  "Window configuration before opening the picker.")

(defvar attachment-ranger--buffers nil
  "Ranger buffers visited during this session.")

(defvar attachment-ranger--busy nil
  "Non-nil while updating picker marks.")

(defun attachment-ranger--active-p ()
  "Return non-nil if a picker session is active."
  (buffer-live-p attachment-ranger--mail))

(defun attachment-ranger--normalize (file)
  "Return the absolute pathname of FILE."
  (expand-file-name file))

;; ============================================================
;; Picker minor mode
;; ============================================================

(defvar attachment-ranger-picker-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map (kbd "t")
                #'attachment-ranger-toggle)
    (define-key map (kbd "TAB")
                #'attachment-ranger-toggle-next)
    (define-key map (kbd "<tab>")
                #'attachment-ranger-toggle-next)
    (define-key map (kbd "C-c C-a")
                #'attachment-ranger-commit)
    (define-key map (kbd "q")
                #'attachment-ranger-cancel)
    map)
  "Keymap active only during attachment selection.")

(define-minor-mode attachment-ranger-picker-mode
  "Minor mode for selecting mail attachments."
  :init-value nil
  :lighter " Attach"
  :keymap attachment-ranger-picker-mode-map)

;; ------------------------------------------------------------
;; Evil / Spacemacs integration
;; ------------------------------------------------------------

(with-eval-after-load 'evil
  (evil-define-minor-mode-key
    '(normal motion visual insert)
    'attachment-ranger-picker-mode
    (kbd "t") #'attachment-ranger-toggle
    (kbd "TAB") #'attachment-ranger-toggle-next
    (kbd "<tab>") #'attachment-ranger-toggle-next
    (kbd "C-c C-a") #'attachment-ranger-commit
    (kbd "q") #'attachment-ranger-cancel))

;; ============================================================
;; Ranger buffer detection and mark display
;; ============================================================

(defun attachment-ranger--ranger-buffer-p ()
  "Return non-nil in a Ranger directory buffer."
  (derived-mode-p 'ranger-mode))

(defun attachment-ranger--paint-marks ()
  "Restore Dired marks from attachment selection."
  (when (and (attachment-ranger--active-p)
             (attachment-ranger--ranger-buffer-p)
             (not attachment-ranger--busy))
    (let ((attachment-ranger--busy t)
          (inhibit-read-only t)
          (was-modified (buffer-modified-p)))
      (save-excursion
        (goto-char (point-min))
        (while (not (eobp))
          (let* ((position (point))
                 (file (dired-get-filename nil t))
                 (selected
                  (and file
                       (member
                        (attachment-ranger--normalize file)
                        attachment-ranger--selection)))
                 (marked
                  (eq (char-after
                       (line-beginning-position))
                      dired-marker-char)))
            (when file
              (cond
               ((and selected (not marked))
                (dired-mark 1))
               ((and marked (not selected))
                (dired-unmark 1))))
            (goto-char position)
            (forward-line 1))))
      (set-buffer-modified-p was-modified))))

(defun attachment-ranger--activate-current-buffer ()
  "Activate picker mode for the selected Ranger buffer."
  (when (and (attachment-ranger--active-p)
             (attachment-ranger--ranger-buffer-p)
             (not attachment-ranger--busy))
    (unless attachment-ranger-picker-mode
      (attachment-ranger-picker-mode 1))
    (cl-pushnew (current-buffer)
                attachment-ranger--buffers)
    (attachment-ranger--paint-marks)))

(defun attachment-ranger--post-command ()
  "Follow Ranger directory changes during attachment selection."
  (when (attachment-ranger--active-p)
    (when (attachment-ranger--ranger-buffer-p)
      (attachment-ranger--activate-current-buffer))))

;; ============================================================
;; Selection operations
;; ============================================================

(defun attachment-ranger-toggle (&optional advance)
  "Toggle current item.
Move to the next file when ADVANCE is non-nil."
  (interactive)
  (unless (attachment-ranger--active-p)
    (user-error "No active attachment picker"))

  (unless (attachment-ranger--ranger-buffer-p)
    (user-error "Not in a Ranger directory"))

  (let ((file (dired-get-filename nil t)))
    (unless file
      (user-error "No file at point"))

    (setq file (attachment-ranger--normalize file))

    (if (member file attachment-ranger--selection)
        (setq attachment-ranger--selection
              (delete file attachment-ranger--selection))
      (setq attachment-ranger--selection
            (append attachment-ranger--selection
                    (list file))))

    (attachment-ranger--paint-marks)

    (when advance
      (condition-case nil
          (ranger-next-file 1)
        (end-of-buffer nil)))

    (message "Selected: %d item(s)"
             (length attachment-ranger--selection))))

(defun attachment-ranger-toggle-next ()
  "Toggle current item and advance."
  (interactive)
  (attachment-ranger-toggle t))

;; ============================================================
;; Expand directories into files
;; ============================================================

(defun attachment-ranger--expand (items)
  "Expand selected ITEMS into unique regular files."
  (let (result)
    (dolist (item items)
      (cond
       ((file-regular-p item)
        (push item result))

       ((file-directory-p item)
        (let* ((all
                (directory-files-recursively
                 item ".*" nil nil))
               (files
                (seq-filter #'file-regular-p all)))

          (when (and
                 (> (length files)
                    attachment-ranger-directory-limit)
                 (not
                  (yes-or-no-p
                   (format
                    "Attach %d files from %s? "
                    (length files) item))))
            (user-error "Directory selection cancelled"))

          (dolist (file files)
            (push file result))))

       (t
        (user-error "Missing or unsupported file: %s"
                    item))))

    (delete-dups (nreverse result))))

;; ============================================================
;; Managed MIME region validation
;; ============================================================

(defun attachment-ranger--check-mml ()
  "Ensure previously managed MML text has not been changed."
  (let ((start attachment-ranger--start)
        (end attachment-ranger--end))

    (when (or start end)
      (unless
          (and (markerp start)
               (markerp end)
               (eq (marker-buffer start) (current-buffer))
               (eq (marker-buffer end) (current-buffer))
               (<= start end)
               (equal
                (buffer-substring-no-properties start end)
                attachment-ranger--snapshot))
        (user-error
         "Managed attachment region changed; refusing to overwrite")))))

;; ============================================================
;; Synchronize MIME attachments
;; ============================================================

(defun attachment-ranger--sync (files items)
  "Synchronize FILES and remember selected ITEMS.
This function must be called in a message composition buffer."
  (unless (derived-mode-p 'message-mode)
    (user-error "Not a message composition buffer"))

  (attachment-ranger--check-mml)

  (unless (equal files attachment-ranger--files)
    (atomic-change-group
      (save-excursion
        (let ((old-start attachment-ranger--start)
              (old-end attachment-ranger--end)
              (mml-attach-file-at-the-end nil))

          ;; Remove only previously managed attachments.
          (if (and old-start old-end)
              (progn
                (goto-char old-start)
                (delete-region old-start old-end))
            (goto-char (point-max)))

          ;; Insert the new managed attachment group.
          (let ((begin (point)))
            (when files
              (insert "\n")
              (dolist (file files)
                (mml-attach-file
                 file
                 (or (mm-default-file-type file)
                     "application/octet-stream")
                 nil
                 "attachment")))

            (let ((finish (point))
                  (snapshot
                   (buffer-substring-no-properties
                    begin (point))))

              ;; Clear previous markers.
              (when (markerp old-start)
                (set-marker old-start nil))
              (when (markerp old-end)
                (set-marker old-end nil))

              (if files
                  (setq attachment-ranger--start
                        (copy-marker begin nil)
                        attachment-ranger--end
                        (copy-marker finish t)
                        attachment-ranger--snapshot snapshot)
                (setq attachment-ranger--start nil
                      attachment-ranger--end nil
                      attachment-ranger--snapshot nil)))))))

    ;; Keep directory selections independently of expanded files.
    (setq attachment-ranger--files
          (copy-sequence files)
          attachment-ranger--items
          (copy-sequence items))))

;; ============================================================
;; Session cleanup
;; ============================================================

(defun attachment-ranger--clear-session ()
  "Clear the active picker state and disable its keymaps."
  (let ((buffers attachment-ranger--buffers))

    ;; Clear active session first to prevent re-entry errors.
    (setq attachment-ranger--mail nil
          attachment-ranger--selection nil
          attachment-ranger--windows nil
          attachment-ranger--buffers nil)

    (remove-hook 'post-command-hook
                 #'attachment-ranger--post-command)

    (dolist (buffer buffers)
      (when (buffer-live-p buffer)
        (with-current-buffer buffer
          (when attachment-ranger-picker-mode
            (attachment-ranger-picker-mode -1)))))))

(defun attachment-ranger--exit ()
  "Close the picker and restore the original mail window."
  (let ((mail attachment-ranger--mail)
        (config attachment-ranger--windows))

    (attachment-ranger--clear-session)

    ;; Do not allow Ranger cleanup failure to block returning.
    (unwind-protect
        (condition-case err
            (when (fboundp 'ranger-disable)
              (ranger-disable))
          (error
           (message "Ranger cleanup: %s"
                    (error-message-string err))))

      (when config
        (set-window-configuration config))

      (when (buffer-live-p mail)
        (pop-to-buffer-same-window mail)))))

;;;###autoload
(defun attachment-ranger-reset ()
  "Reset a stuck attachment picker without changing the email."
  (interactive)
  (let ((mail attachment-ranger--mail)
        (config attachment-ranger--windows))
    (attachment-ranger--clear-session)
    (when config
      (set-window-configuration config))
    (when (buffer-live-p mail)
      (pop-to-buffer-same-window mail))
    (message "Attachment picker state reset")))

;; ============================================================
;; Commit and cancel
;; ============================================================

(defun attachment-ranger-commit ()
  "Synchronize selected attachments and return to the email."
  (interactive)

  (unless (attachment-ranger--active-p)
    (user-error "No active attachment picker"))

  (let* ((mail attachment-ranger--mail)
         (items
          (copy-sequence attachment-ranger--selection))
         (directory default-directory)
         (files (attachment-ranger--expand items)))

    ;; If synchronization fails, remain in Ranger so that
    ;; selections are not lost.
    (with-current-buffer mail
      (attachment-ranger--sync files items)
      (setq attachment-ranger--directory directory))

    (attachment-ranger--exit)

    (message "Attachments synchronized: %d file(s)"
             (length files))))

(defun attachment-ranger-cancel ()
  "Cancel changes and return to the email."
  (interactive)

  (unless (attachment-ranger--active-p)
    (user-error "No active attachment picker"))

  (attachment-ranger--exit)
  (message "Attachment selection cancelled"))

;; ============================================================
;; Open attachment picker
;; ============================================================

;;;###autoload
(defun attachment-ranger-open ()
  "Open Ranger or Deer to manage current Notmuch attachments."
  (interactive)

  (unless (derived-mode-p 'notmuch-message-mode)
    (user-error "Not a Notmuch composition buffer"))

  (when (attachment-ranger--active-p)
    (user-error
     "Another picker is active; use attachment-ranger-reset if stuck"))

  (require 'ranger)

  (let* ((mail (current-buffer))
         (dir
          (expand-file-name
           (or attachment-ranger--directory
               attachment-ranger-default-directory)))
         (dir
          (if (file-directory-p dir)
              dir
            (expand-file-name "~/"))))

    ;; Initialize the new session.
    (setq attachment-ranger--mail mail
          attachment-ranger--selection
          (copy-sequence attachment-ranger--items)
          attachment-ranger--windows
          (current-window-configuration)
          attachment-ranger--buffers nil)

    ;; Register navigation tracking before opening Ranger.
    (add-hook 'post-command-hook
              #'attachment-ranger--post-command)

    (condition-case err
        (progn
          (if attachment-ranger-use-deer
              (deer dir)
            (ranger dir))

          (attachment-ranger--activate-current-buffer)

          (message
           "Attachment picker: t/TAB select | C-c C-a apply | q cancel"))

      (error
       (attachment-ranger--clear-session)
       (signal (car err) (cdr err))))))

;; ============================================================
;; Notmuch integration
;; ============================================================

(with-eval-after-load 'notmuch-message
  (define-key notmuch-message-mode-map
              (kbd "C-c C-a")
              #'attachment-ranger-open))

(provide 'attachment-ranger)

;;; attachment-ranger.el ends here
```

写到这里，附件这一环总算是顺手了。这类小包的价值不在代码量，而在把已经练成的肌肉记忆原样搬到一个原本需要另学一套操作的地方——ranger 还是那个 ranger，只是这一次，它管的是信里的附件。
