---
layout: post
category: technology
title: 数据科学杂谈之五--奇异博士的传送门
matheq: no
comments: yes
tags: [数据科学, 工程, 数据科学杂谈]
share: yes
toc: no
---

本篇是[上一篇“数据科学杂谈之二”](http://dustincys.github.io/cn/2022/05/datascience/)的扩展。

<a class="fancybox" rel="gallery1" title="Portal" href="https://raw.githubusercontent.com/dustincys/cn/assets/doctorstrange-drstrange.gif"><img src="https://raw.githubusercontent.com/dustincys/cn/assets/doctorstrange-drstrange.gif" alt="Portal" /></a>

很多小伙伴都有一个这样一个梦想：能有奇异博士的打开传送门的能力，这样就可以节省大量时间。
例如，从办公室到实验室之间，瞬间传送。
在现实中实现不了，在计算机中完全可以实现。
对于某[数据分析工程文件夹架构](https://dustincys.github.io/cn/2020/10/datascience/)如下：

<a class="fancybox" rel="gallery1" title="Scheme_of_path" href="https://raw.githubusercontent.com/dustincys/cn/assets/scheme_of_path.png"><img src="https://raw.githubusercontent.com/dustincys/cn/assets/scheme_of_path.png" alt="Scheme_of_path" /></a>

奇异博士的传送门功能是从绿色路径的pipeline5文件夹打开传送门，直接传送到红色路径的pipeline5文件夹中，逻辑是
```shell
#!/usr/bin/env bash
if git status &>/dev/null; then
    ProjectRoot=$(git rev-parse --show-toplevel)
    CodePath=$ProjectRoot/code/
    PipelinePath=$ProjectRoot/code/pipeline/private/
    SrcPath=$ProjectRoot/code/src/private/
    DataPath=$ProjectRoot/data/
    InfoPath=$ProjectRoot/info/
    KnowledgePath=$ProjectRoot/knowledge/private/
    ResultPath=$ProjectRoot/result/
    CurrentPath=$(pwd)

    case $1 in
        "code" )
            jump $ProjectRoot $CurrentPath $CodePath
            ;;
        "pipeline" )
            jump $ProjectRoot $CurrentPath $PipelinePath
            ;;
        "src" )
            jump $ProjectRoot $CurrentPath $SrcPath
            ;;
        "data" )
            jump $ProjectRoot $CurrentPath $DataPath
            ;;
        "info" )
            jump $ProjectRoot $CurrentPath $InfoPath
            ;;
        "knowledge" )
            jump $ProjectRoot $CurrentPath $KnowledgePath
            ;;
        "result" )
            jump $ProjectRoot $CurrentPath $ResultPath
            ;;
        "root" )
            echo -n $ProjectRoot
            ;;
        "base" )
            echo -n $(basename $ProjectRoot)
            ;;
        "fzf" )
            targetFolder=$(find $ProjectRoot -type d | fzf-tmux --cycle --header "Jump to" --print0 --preview="selected=\$(echo {}); perl -pl0 -e \"s|^${HOME}|~|;s|([^/])[^/]*/|$\"\"1/|g\" <<< \${selected#$ProjectRoot}; printf \"\n\"; ls -all \${selected}")
            if [ -z $targetFolder ]; then
                echo -n $CurrentPath
            else
                echo -n $targetFolder
            fi
            ;;
        * )
            echo -n $CurrentPath
            ;;
    esac
else
    echo -n $CurrentPath
fi
```
如何打开传送门呢？其实就是把路径中不相同的地方相互替换，某刀客将不同的路径称之为“桥”，获取桥以及如何判断有桥的Portal如下：
```shell
#!/usr/bin/env bash
is_a_portal_path () {
    ProjectRoot=$1
    TargetPath=$2
    CodePath=$ProjectRoot/code/
    PipelinePath=$ProjectRoot/code/pipeline/private/
    SrcPath=$ProjectRoot/code/src/private/
    DataPath=$ProjectRoot/data/
    InfoPath=$ProjectRoot/info/
    KnowledgePath=$ProjectRoot/knowledge/private/
    ResultPath=$ProjectRoot/result/
    if [[ $TargetPath == *"${ResultPath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    if [[ $TargetPath == *"${PipelinePath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    if [[ $TargetPath == *"${DataPath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    if [[ $TargetPath == *"${InfoPath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    if [[ $TargetPath == *"${KnowledgePath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    if [[ $TargetPath == *"${SrcPath}"* ]]; then
        echo -n "YES"
        return 1
    fi
    echo -n "NO"
    return 0
}

get_the_bridge () {
    ProjectRoot=$1
    TargetPath=$2
    CodePath=$ProjectRoot/code/
    PipelinePath=$ProjectRoot/code/pipeline/private/
    SrcPath=$ProjectRoot/code/src/private/
    DataPath=$ProjectRoot/data/
    InfoPath=$ProjectRoot/info/
    KnowledgePath=$ProjectRoot/knowledge/private/
    ResultPath=$ProjectRoot/result/

    if [[ $TargetPath == *"${ResultPath}"* ]]; then
        echo -n "\/result\/"
        return 1
    fi
    if [[ $TargetPath == *"${PipelinePath}"* ]]; then
        echo -n "\/code\/pipeline\/private\/"
        return 1
    fi
    if [[ $TargetPath == *"${DataPath}"* ]]; then
        echo -n "\/data\/"
        return 1
    fi
    if [[ $TargetPath == *"${InfoPath}"* ]]; then
        echo -n "\/info\/"
        return 1
    fi
    if [[ $TargetPath == *"${KnowledgePath}"* ]]; then
        echo -n "\/knowledge\/private\/"
        return 1
    fi
    if [[ $TargetPath == *"${SrcPath}"* ]]; then
        echo -n "\/code\/src\/private\/"
        return 1
    fi
    echo -n ""
    return 0
}
```
获取传送门的Portal如下：
```shell
#!/usr/bin/env bash
jump () {
    ProjectRoot=$1
    CurrentPath=$2
    TargetPath=$3

    if [[ $(is_a_portal_path $ProjectRoot $CurrentPath) == "YES" ]]; then
        if [[ $(is_a_portal_path $ProjectRoot $TargetPath) == "YES" ]]; then

            bridge_here=$(get_the_bridge $ProjectRoot $CurrentPath)
            bridge_there=$(get_the_bridge $ProjectRoot $TargetPath)

            if [[ "$bridge_here" == "$bridge_there" ]]; then
                portal_path=$TargetPath
            else
                portal_path=$(echo $CurrentPath | sed "0,/${bridge_here}/{s/${bridge_here}/${bridge_there}/}")
            fi

            while [ ! -d $portal_path ]; do
                portal_path=$(dirname $portal_path)
            done

            echo -n $portal_path

        else
            echo -n $TargetPath
        fi
    else
        echo -n $TargetPath
    fi
}
```
其中，递归向上回溯可跳转路径以及基于当前路径选择传送门的路径赋予这个跳转一点“智能”。
因为还有可能需要跳转到其他路径中，例如从pipeline5跳到data文件夹下data1中。

以上小伙伴可能会说，这些都是没有意义的，因为写以上这段脚本耗费的时间可能远大于其节省的时间。
这个观点非常幼稚。
因为如果将该脚本放置于Linux应用层的低端，那么其运行频率将指数增长，最后节省的时间也是指数增长，其结果远远超乎想象。
关于如何放置于Linux应用层低端的Portal在[上一篇“数据科学杂谈之二”](http://dustincys.github.io/cn/2022/05/datascience/)有所述。

