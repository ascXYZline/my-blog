import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import { transformObsidianCallouts } from './.vitepress/plugins/obsidianCompat'


/* ── markdown-it 实例（直接可靠，无需依赖 VitePress 内部状态） ── */
const md = new MarkdownIt({
  html: true,
  breaks: true,     // 单换行 → <br>，适合碎碎念的随意书写
  linkify: true,    // 自动识别 URL
})

const containerTypes = ['info', 'tip', 'warning', 'danger', 'details'] 
                                                                         
containerTypes.forEach(type => {                                          
  md.use(container, type, {                                               
    render(tokens: any[], idx: number) {                                 
      const token = tokens[idx]                                         
      // token.info 的值类似 "info 自定义标题"                           
      const rawInfo = token.info.trim()                                
      const customTitle = rawInfo.slice(type.length).trim()              
                                                                        
      if (token.nesting === 1) {                                        
        // 开标签                                                          
        const title = customTitle                                     
          || type.charAt(0).toUpperCase() + type.slice(1)              
        return [                                                        
          `<div class="callout callout-${type}">`,                      
          `  <div class="callout-title">${title}</div>`,               
          `  <div class="callout-body">`,                             
        ].join('\n') + '\n'                                            
      }                                                                 
      // 闭标签                                                           
      return `  </div>\n</div>\n`                                        
    },                                                                 
  })                                                                  
}) 


/* ── 类型定义 & 导出 ── */
export interface TimelineItem {
  type: 'post' | 'note'
  timestamp: number
  date: string       // 展示用短日期 "MM-DD HH:mm"
  year: number        // 年份分组用
  title?: string
  link?: string
  tags?: string[]
  excerpt?: string    // post 摘要（纯文本 / 行内 HTML）
  content?: string    // note 正文（块级 HTML）
}

declare const data: TimelineItem[]
export { data }

/* ── 主加载器 ── */
export default {
  watch: ['./_data/moments.md'],

  async load(): Promise<TimelineItem[]> {

    // ━━━━━━━━ 1. 文章 (Posts) ━━━━━━━━
    const postsLoader = createContentLoader('**/*.md', {
      excerpt: true,
      transform(rawData) {
        return rawData.filter(page =>
          page.url !== '/'
          && page.url !== '/timeline'
          && page.url !== '/essay'
          && page.frontmatter.article !== false
          && page.frontmatter.publish !== false
        )
      },
    })

    const posts = await postsLoader.load()

    const postItems: TimelineItem[] = posts.map(post => {
      const d = safeDate(post.frontmatter.date)

      // 摘要优先级：frontmatter 手写 > 自动提取（去 HTML 后截断）
      const rawExcerpt =
        post.frontmatter.description
        || post.frontmatter.summary
        || stripHtml(post.excerpt ?? '').slice(0, 120)

      return {
        type: 'post',
        timestamp: d.getTime(),
        date: fmtShort(d),
        year: d.getFullYear(),
        title: post.frontmatter.title || post.url,
        link: post.url,
        tags: post.frontmatter.tags || [],
        excerpt: rawExcerpt || '',
      }
    })

    // ━━━━━━━━ 2. 碎碎念 (Notes) ━━━━━━━━
    const momentsPath = path.resolve(__dirname, './_data/moments.md')
    const raw = fs.readFileSync(momentsPath, 'utf-8')
    
    const noteItems: TimelineItem[] = raw
      .split(/^## /m)          // 按 ## 日期 分割
      .slice(1)                // 丢弃第一段空白
      .map(block => {
        const [dateLine, ...bodyLines] = block.split('\n')
        const d = safeDate(dateLine.trim())
        const body = bodyLines.join('\n').trim()

        return {
          type: 'note',
          timestamp: d.getTime(),
          date: fmtShort(d),
          year: d.getFullYear(),
          // ★ 核心修复：用 md.render() 将 markdown 正确转为 HTML
          // "- item" → <ul><li>item</li></ul>  ✓
          // "**bold**" → <strong>bold</strong>  ✓
          content: md.render(transformObsidianCallouts(body)),
        }
      })

    // ━━━━━━━━ 3. 合并 & 按时间倒序 ━━━━━━━━
    return [...postItems, ...noteItems]
      .sort((a, b) => b.timestamp - a.timestamp)
  },
}

/* ── 工具函数 ── */

function safeDate(v: unknown): Date {
  const d = new Date(v as string)
  return isNaN(d.getTime()) ? new Date(0) : d
}

/** 短格式日期：MM-DD HH:mm（年份由组件中的 year header 提供） */
function fmtShort(d: Date): string {
  if (d.getTime() === 0) return ''
  const M = String(d.getMonth() + 1).padStart(2, '0')
  const D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${M}-${D} ${h}:${m}`
}

/** 去除 HTML 标签 */
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim()
}

