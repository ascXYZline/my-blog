<script setup>
import { data } from '../../../timeline.data.ts'

// 定义一个跳转函数（或者直接用 a 标签）
</script>

<template>
  <div class="timeline-container">
    <div v-for="(item, index) in data" :key="index" class="timeline-item">
      <div class="timeline-marker"></div>
      
      <div class="timeline-content">
        <div class="timeline-date">{{ item.date }}</div>

        <!-- 情况 A: 如果是博客文章 (Post) -->
        <div v-if="item.type === 'post'" class="post-card">
            <a :href="item.link" class="post-link">
                <span class="post-tag">文章发布</span>
                <h3 class="post-title">{{ item.title }}</h3>
                <div v-if="item.excerpt" class="post-excerpt" v-html="item.excerpt"></div>
                <div class="read-more">阅读全文 →</div>
            </a>
        </div>

        <!-- 情况 B: 如果是碎碎念 (Moment) -->
        <div v-else class="moment-body" v-html="item.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 0;
  position: relative;
}

/* 轴线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-divider);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-left: 50px;
}

/* 圆点 */
.timeline-marker {
  position: absolute;
  left: 15px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand); /* 主题色 */
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand);
  z-index: 1;
}

.timeline-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  font-family: monospace;
}

/* --- 碎碎念样式 --- */
.moment-body {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt); /* 浅灰色背景 */
  padding: 15px;
  border-radius: 8px;
  position: relative;
}
/* 小三角，让它看起来像气泡 */
.moment-body::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 10px;
    width: 0; 
    height: 0; 
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent; 
    border-right: 6px solid var(--vp-c-bg-alt); 
}

/* --- 文章卡片样式 --- */
.post-card {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 16px;
    background: var(--vp-c-bg);
    transition: transform 0.2s, box-shadow 0.2s;
}
.post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.05);
    border-color: var(--vp-c-brand);
}
.post-link {
    text-decoration: none !important;
    display: block;
    color: inherit !important;
}
.post-tag {
    font-size: 0.75rem;
    background: var(--vp-c-brand-dimm);
    color: var(--vp-c-brand-dark);
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 8px;
    display: inline-block;
}
.post-title {
    margin: 5px 0 10px 0 !important;
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
}
.post-excerpt {
    font-size: 0.9rem;
    color: var(--vp-c-text-2);
    margin-bottom: 10px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 最多显示2行摘要 */
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.read-more {
    font-size: 0.85rem;
    color: var(--vp-c-brand);
    font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .timeline-container::before { left: 10px; }
  .timeline-marker { left: 5px; }
  .timeline-item { padding-left: 30px; }
}
</style>