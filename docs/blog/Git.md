---
title: Git
description: 'Git人门'
date: 2026-01-02
categories: 
  - "notes"
tags: 
  - "Git"
sidebar: false
aside: true
---
# Git

---

笔记对应MIT-The Missing Semester of Your CS Education的第六讲[Version Control (Git)](https://missing.csail.mit.edu/2026/version-control/)

[官方笔记文档](https://missing.csail.mit.edu/2020/version-control/)

[开源书籍](https://git-scm.com/book/en/v2)

### 有向无环图与数据模型
```bash
root/
├── foo/
│   ├── bar.txt
│   │   └── "Hello world"
└── baz.txt
    └── "git"

```
- "root","foo"文件夹称为tree
- 文件称为blob
- 将不同版本看作快照(snapshot)。git不局限在线性的文件历史，可以将历史记录分支成独立的分支。如1，2，3.1，3.2，4这里3.1，3.2都是基于2进行的更改，互相平行，而4进行的是将3的两个更改合并。
- 每个快照可能附加**作者，描述**等信息，称元数据

<br>


- 以下为git磁盘数据存储
```c
// --- 1. 定义数据类型 ---
//blob是文件内容，本质为一串比特
type blob = array<byte>

// Tree: 映射表 (Map)
// 将文件名 (string) 映射到子目录 (tree)（递归） 或文件 (blob)。
type tree = map<string, tree | blob>

// Commit: 结构体
// 代表一次提交。它包含了元数据和指向根目录树的指针。
type commit = struct {
    parents: array<commit>  // 父提交，即上一个版本
    author:  string         
    message: string         // 元数据
    snapshot: tree          // 提交内容，指向这一刻的项目根目录 (Root Tree)
}
//根据下面的对象存储，这里提交的所有对象并不是本身，可理解为id,指针

// --- 2. 定义对象存储 (Object Storage) ---

// Object: 联合类型
// Git 的基本对象只能是 blob、tree 或 commit 中的一种。
type object = blob | tree | commit

// Objects: 核心数据库 (哈希表)
// 这是一个巨大的 Map，id 是字符串 (哈希值)，Value 是对象本身。
objects = map<string, object>

// --- 3. 定义核心函数 ---

// 存储对象a的函数 
// 也就是 `git add` 或 `git commit` 底层发生的事情
def store(o) {
    // “内容寻址” (Content-Addressable)，由内容计算SHA-1值，也就是id
    id = sha1(o)
    
    // 将对象存入全局 Map 中
    objects[id] = o
}

// 读取函数 (读出)
// 也就是 `git cat-file` 或检出代码时发生的事情
def load(id) {
    // 根据哈希值 ID，从 Map 中取回对应的对象
    return objects[id]
}
```
- 由于哈希值为40字符长的十六进制字符串，不具可读性。还需要**引用**`references=map<string,string>` ，即维护一个从可读名称到id的哈希表,**可被用户操作**
### Git started
```bash
git init #初始化
git status   #查看状态
//输出
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)

```

<br>

- git具有“暂存区”(staging area)，说明了下一次快照应包含的更改。创建一个hello.txt后
```bash
git add hello.txt
git add .  #对全局操作
git commit #上传了第一个快照
git commit -a #提交所有更改，而不提交添加的文件
git commit -m "……" # 简单提交信息
//从输出中可以看到"commit" 对应的哈希值（假设f70f39c)，使用
git cat-file -p f70f39c   //可以查看commit的提交信息，包括tree（对应图结构），元数据等，可以取tree的哈希值进一步挖掘……

```

<br>

- 可视化提交历史
```bash
git log 
git log  --all --graph --decorate 
git log --all --graph --decorate --oneline
```
  - 分别是线性显示，有图示关系的显示，简单显示
  - 在这里可以看到HEAD指针，master[并行与分支](#并行与分支)

<br>

- 查看历史快照
```bash
  git checkout ……
  git checkout master
  git checkout hello.txt
  ```
- 后接commit的哈希值（或引用），回滚到对应的历史状态。例如，此时可以查看过去某状态时的文件内容
- 实质是移动HAED指针
- 这个命令具有危险性，修改文件时要当心
- 第三个指令直接丢弃指定工作目录的更改，滚到HAED指向快照的内容状态

<br>

- 对照
```bash
git diff hello.txt
git diff HEAD hello.txt
git diff ……(哈希值) HEAD hello.txt 
```
- 将当前工作目录与过去某快照比较，显示差异。第一行默认即是第二行
- 可以指定快照，也可以指定两个快照间的比较

### 并行与分支 
master即默认具有的分支，本质是指向commit的指针。
HEAD是指向分支的指针，即二级指针,但也可以是指向特定快照的一级指针
```bash
git branch
git branch -vv
git branch cat
git checkout -b dog

```
- 创建分支即创建新的引用，默认与HEAD指向的位置一致
- 分别是查看分支，更详细的查看分支，创建新分支并指定名称为cat ,创建新dog分支并**切换**（git checkout dog)到dog分支
-  假设cat，dog分支并行提交了commit，接下来将它们合并


```bash
git checkout master 
git merge cat  
git merge dog
git merge --abort

```
<br>

:::tip

1.为了合并到master，记得切换！

2.首先合并cat，该操作不会创建新的commit，而是使master指向和cat相同的commit

3.合并dog，出现合并冲突是常见的

4.撤回合并操作
实际开发环境，程序员需要解决合并冲突后，git add然后git merge --continue，合并完成
:::
### 远程仓库
>“如果推送至远程仓库不起作用，请尝试拉取远程仓库。”

远程仓库可以是github,gitlab,bitbucket,甚至是本地路径等等 
- 连接与推送
```bash
# 语法：git remote add <代号> <地址>
git remote add origin https://github.com/你的用户名/git-learning-lab.git
```

```bash
git push <remote> <local branch>:<remote branch>

git branch --set-upstream-to=<remote>/<remote branch>
#设置连接，从此只需要
git push
```

- 将远程克隆到本地
```bash
git clone <url> <folder name>
```

---
 想象另一用户将更改提交到了远程
  - `git fetch`: retrieve objects/references from a remote
  `git fetch`访问远程并更新了origin/master指针
  - `git merge <revision>`: merges into current branch
  让本地的master指针移动到origin/master，或者理解为将更新内容合并到本地master中
- `git pull`: same as `git fetch; git merge`

---
### 补充
- git具有高度可定制性
```bash
vim ~/.gitconfig
```

-  只克隆最新提交
```bash
git clone --shallow
```

- 交互式暂存特定片段
 ```bash
  git add -p <>
  ```

- 暂存区中显示更改
```bash
git diff --cashed
```

- 分别是剪切未提交的改动，粘贴他们（可在其他地方）
```bash
git stash
git stash pop
```

- 忽略特定文件
```bash
vim .gitignore
```
例如可以忽略编译时的.o文件（\*为通配符）
```bash
*.o
```
<br>


:::tip 总结
git的玩法非常广泛，尝试图形化界面，shell集成，以及插件，社区……
甚至自己实现一个git
:::