<script setup lang="ts">
import { data } from '../../../timeline.data.ts'

/** 判断是否需要显示年份分隔线 */
function isNewYear(index: number): boolean {
  if (index === 0) return true
  return data[index].year !== data[index - 1].year
}
</script>

<template>
  <div class="tl">
    <template v-for="(item, index) in data" :key="index">

      <!-- ──── 年份分隔线 ──── -->
      <div v-if="isNewYear(index)" class="tl-year">
        <span class="tl-year-num">{{ item.year }}</span>
        <span class="tl-year-line"></span>
      </div>

      <!-- ──── 条目 ──── -->
      <article
        class="tl-item"
        :class="item.type === 'post' ? 'is-post' : 'is-note'"
      >
        <!-- 左侧指示器 -->
        <div class="tl-indicator">
          <!-- Note 图标：气泡 -->
          <svg
            v-if="item.type !== 'post'"
            class="tl-icon"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <!-- Post 图标：文档 -->
          <svg
            v-else
            class="tl-icon"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
        </div>

        <!-- 右侧内容 -->
        <div class="tl-body">
          <!-- 元信息 -->
          <div class="tl-meta">
            <time class="tl-date">{{ item.date }}</time>
            <span
              class="tl-label"
              :class="item.type === 'post' ? 'label-post' : 'label-note'"
            >
              {{ item.type === 'post' ? 'Post' : 'Note' }}
            </span>
          </div>

          <!-- Post 卡片 -->
          <a v-if="item.type === 'post'" :href="item.link" class="tl-card">
            <h3 class="tl-card-title">{{ item.title }}</h3>
            <p v-if="item.excerpt" class="tl-card-desc" v-html="item.excerpt"></p>
            <span class="tl-card-more">阅读全文 →</span>
          </a>

          <!-- Note 正文（Markdown HTML） -->
          <div v-else class="tl-prose" v-html="item.content"></div>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped>
/* ===================== 容器 ===================== */
.tl {
  max-width: 660px;
  margin: 0 auto;
  padding: 8px 0 40px;
}

/* ===================== 年份分隔 ===================== */
.tl-year {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px 0 18px;
  user-select: none;
}
.tl-year:first-child {
  margin-top: 4px;
}
.tl-year-num {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
  flex-shrink: 0;
}
.tl-year-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

/* ===================== 条目 ===================== */
.tl-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 28px;
}
.tl-item:last-child {
  padding-bottom: 0;
}

/* 连接线（排除每组最后一条） */
.tl-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 13px;           /* 26px indicator / 2 */
  top: 30px;
  bottom: 0;
  width: 1px;
  background: var(--vp-c-divider);
  opacity: 0.6;
}

/* ===================== 指示器（图标圆点） ===================== */
.tl-indicator {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  transition: border-color 0.25s, color 0.25s;
}
.tl-icon {
  width: 13px;
  height: 13px;
}
.is-note > .tl-indicator {
  color: var(--vp-c-text-3);
}
.is-post > .tl-indicator {
  color: var(--vp-c-brand-1);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
}

/* ===================== 内容主体 ===================== */
.tl-body {
  flex: 1;
  min-width: 0;
  padding-top: 3px;
}

/* ── 元信息行 ── */
.tl-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.tl-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
}
.tl-label {
  font-size: 0.6rem;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.7;
}
.label-note {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}
.label-post {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* ===================== Note 碎碎念正文 ===================== */
.tl-prose {
  font-size: 0.9rem;
  line-height: 1.75;
  color: var(--vp-c-text-1);
}

/*
 * ★ :deep() 穿透 scoped，让 v-html 内的 Markdown HTML 正确渲染
 *   这是解决 "- 无法渲染为圆点" 问题的关键
 */
.tl-prose :deep(p)             { margin: 0.35em 0; }
.tl-prose :deep(p:first-child) { margin-top: 0; }
.tl-prose :deep(p:last-child)  { margin-bottom: 0; }

.tl-prose :deep(ul),
.tl-prose :deep(ol)            { padding-left: 1.4em; margin: 0.4em 0; }
.tl-prose :deep(ul)            { list-style: disc; }
.tl-prose :deep(ol)            { list-style: decimal; }
.tl-prose :deep(li)            { margin: 0.15em 0; }
.tl-prose :deep(li::marker)    { color: var(--vp-c-text-3); }

.tl-prose :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
  text-underline-offset: 2px;
  transition: text-decoration-color 0.2s;
}
.tl-prose :deep(a:hover) {
  text-decoration-color: var(--vp-c-brand-1);
}

.tl-prose :deep(strong) { font-weight: 600; }
.tl-prose :deep(em)     { font-style: italic; }

.tl-prose :deep(code) {
  background: var(--vp-c-default-soft);
  padding: 1.5px 5px;
  border-radius: 3px;
  font-size: 0.85em;
}

.tl-prose :deep(blockquote) {
  margin: 0.5em 0;
  padding: 2px 0 2px 0.8em;
  border-left: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.tl-prose :deep(img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 0.5em 0;
}

.tl-prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 0.8em 0;
}

/* ===================== Post 卡片 ===================== */
.tl-card {
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: inherit !important;
  border: 1px solid transparent;
  transition: background 0.25s, border-color 0.3s;
}
.tl-card:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider);
}
.tl-card-title {
  margin: 0 0 4px !important;
  padding: 0 !important;
  border: none !important;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--vp-c-text-1);
}
.tl-card-desc {
  margin: 0 0 6px !important;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tl-card-more {
  font-size: 0.78rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s;
}
.tl-card:hover .tl-card-more {
  opacity: 1;
}

/* ===================== 响应式 ===================== */
@media (max-width: 640px) {
  .tl-item { gap: 10px; }

  .tl-indicator {
    width: 22px;
    height: 22px;
  }
  .tl-icon {
    width: 11px;
    height: 11px;
  }
  .tl-item:not(:last-child)::after {
    left: 10px;
    top: 26px;
  }

  .tl-card-more { opacity: 1; }
}
</style>