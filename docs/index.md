---
layout: doc
sidebar: false
aside: false
title: 首页
article: false 
hidden: true   
lastUpdated: false
editLink: false
---

<div class="home-container custom-landing-page">
<!-- 背景层 -->
<div class="bg-layer"></div>

<!-- 内容主体 -->
<div class="content-wrapper">

<!-- 左侧：头像区域 -->
<div class="avatar-section">
<div class="avatar-circle"></div>
</div>

<!-- 右侧：文字列表区域 -->
<div class="info-section">
<p class="intro-text">
欢迎来到 <span class="highlight">@ASCLINE</span> 的个人网站！
</p>

<ul class="feature-list">

<!--
<li>
<strong>查找</strong>
<p>可以点击顶栏左侧的搜索栏或者使用快捷键 <code>ctrl + K</code> 进行笔记内容的搜索. 如果没什么想法，可以点击 此处 随机跳转到一个页面.</p>
</li>

暂时注释-->
<!--
<li>
<strong>评论</strong>
<p>已经配置了 Twikoo 评论系统，评论的回复会用邮件进行通知，请及时查收；同时欢迎发表观点.</p>
</li>

暂时注释-->

<li class="bigsize strong">
<strong>博客</strong>
<p>
点击 
<!-- 【关键修改】加上 target="_self" 修复偏移 BUG -->
<a href="/blog/" target="_self" class="active-link">此处</a> 
进入 blog 文章页面.
</p>
</li>

<!--
<li>
<strong>「 开往 」</strong>
<p>可以点击 开往 随机穿梭至组织成员的网站，为大家带来更多流量，助力中文博客圈的发展.</p>
</li>
暂时注释-->
<li class="bigsize">
<strong>「 未来 」</strong>
<p>也许会有更多的笔记，博客，以及友链，灵感？</p>
</li>

</ul>
</div>

</div>
</div>

<style>
/* 
  使用 .custom-landing-page 包裹所有样式
  防止跳转后影响博客页面 
*/

:root {
  --my-avatar-url: url('/logo.png');
  --my-bg-image-url: url('/background.jpg');
  --my-bg-opacity: 0.3;
  
  /* [新增接口] 首页内容整体向右移动的距离 */
  /* 正数向右移，负数向左移。例如: 50px, 100px, 5vw */
  --home-content-offset-x: 180px; 
}

/*容器设置*/
.custom-landing-page.home-container {
  position: relative;
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center; /* 保持 flex 居中 */
  padding: 20px 0;
  
  /* 防止移出屏幕产生横向滚动条 (可选) */
  overflow-x: hidden; 
}

/* 背景层 - 修改版 */
.custom-landing-page .bg-layer {
  /* 关键修改 1：由 absolute 改为 fixed */
  /* fixed 意味着它相对于“浏览器窗口”定位，而不是相对于父容器 */
  position: fixed;
  
  top: 0; 
  left: 0; 
  
  /* 关键修改 2：强制宽高撑满整个屏幕 */
  width: 100vw;   /* 100% 视口宽度 */
  height: 100vh;  /* 100% 视口高度 */
  
  /* 保持原有的背景配置 */
  background-image: var(--my-bg-image-url);
  background-size: cover;
  background-position: center;
  opacity: var(--my-bg-opacity);
  z-index: -1;
  pointer-events: none;
}

/* 内容包装器 - 修改版 */
.custom-landing-page .content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 100px;
  max-width: 900px;
  width: 100%;
  
  /* 核心修改：应用偏移量 */
  position: relative; /* 开启相对定位 */
  left: var(--home-content-offset-x); /* 调用接口变量 */
}

/* 头像 */
.custom-landing-page .avatar-section {
  flex-shrink: 0;
}

.custom-landing-page .avatar-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-image: var(--my-avatar-url);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 右侧文字 */
.custom-landing-page .info-section {
  flex: 1;
  padding-top: 10px;
}

/* 欢迎文本 - 设置为较大字体 */
.custom-landing-page .intro-text {
  font-size: 1.5rem; /* 从原来的1.1rem改为1.5rem，使其更大 */
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.custom-landing-page .highlight {
  color: var(--vp-c-brand);
  font-weight: bold;
}

/* 列表 */
.custom-landing-page .feature-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.custom-landing-page .feature-list li {
  margin-bottom: 20px;
  position: relative;
  padding-left: 15px;
  list-style: none !important;
}

/* 为bigsize类添加稍大字体 */
.custom-landing-page .feature-list li.bigsize {
  font-size: 1.15rem; /* 稍大的基础字体大小 */
}

.custom-landing-page .feature-list li.bigsize strong {
  font-size: 1.2rem; /* 比普通strong更大 */
  margin-bottom: 6px; /* 稍微增加下边距以匹配更大字体 */
}

.custom-landing-page .feature-list li.bigsize p {
  font-size: 1.05rem; /* 比普通段落更大 */
}

/* 普通列表项样式保持不变 */
.custom-landing-page .feature-list li:not(.bigsize) {
  /* 保持原有的字体大小 */
}

.custom-landing-page .feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-text-2);
}

.custom-landing-page .feature-list strong {
  display: block;
  font-size: 1.05rem;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.custom-landing-page .feature-list p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 链接 */
.custom-landing-page .active-link {
  color: var(--vp-c-brand);
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 移动端适配 - 修改版 */
@media (max-width: 768px) {
  
  /* 移动端强制归零，防止内容偏出屏幕 */
  :root {
      --home-content-offset-x: 0px;
  }
   .custom-landing-page .content-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    text-align: center;
    
    /* 移动端再次确保归位 */
    left: 0 !important;
  }


  .custom-landing-page .feature-list li {
    padding-left: 0;
  }
  
  .custom-landing-page .feature-list li::before {
    display: none;
  }
  
  /* 移动端字体适当调整 */
  .custom-landing-page .intro-text {
    font-size: 1.3rem; /* 移动端稍小一点 */
  }
  
  .custom-landing-page .feature-list li.bigsize {
    font-size: 1.05rem; /* 移动端稍小 */
  }
  
  .custom-landing-page .feature-list li.bigsize strong {
    font-size: 1.1rem; /* 移动端稍小 */
  }
  
  .custom-landing-page .feature-list li.bigsize p {
    font-size: 1rem; /* 移动端稍小 */
  }
}
</style>

