import fs from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, createContentLoader } from 'vitepress'

export default {
  // 监听 moments.md 的变化
  watch: ['./_data/moments.md'],

    async load() {
    // ----------------------
    // 1. 处理文章 (Posts)
    // ----------------------
    const postsLoader = createContentLoader('**/*.md', {
      excerpt: true,
      transform(rawData) {
        return rawData.filter((page) => {
          return (
            page.url !== '/' &&
            page.url !== '/timeline' &&
            page.frontmatter.article !== false &&
            page.frontmatter.publish !== false
          )
        })
      }
    })
    
    const posts = await postsLoader.load()
    
    const formattedPosts = posts.map(post => {
      // 1. 获取原始日期对象
      const dateObj = new Date(post.frontmatter.date); 
      // 2. 检查日期是否有效，无效则给一个极小值，保证沉底，防止 NaN 破坏排序
      const timestamp = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

      return {
        type: 'post',
        timestamp: timestamp, // <--- 核心：保留数字用于排序
        date: formatDate(dateObj), // 仅用于展示
        title: post.frontmatter.title || post.url,
        link: post.url,
        tags: post.frontmatter.tags || [],
        excerpt: post.frontmatter.description || post.frontmatter.summary || post.excerpt 
      }
    })

    // ----------------------
    // 2. 处理碎碎念 (Moments)
    // ----------------------
    const filePath = path.resolve(__dirname, './_data/moments.md')
    const content = fs.readFileSync(filePath, 'utf-8')
    const config = global.VITEPRESS_CONFIG
    const md = await createMarkdownRenderer(config?.srcDir || process.cwd(), config?.markdown, config?.site?.base, config?.logger)

    const rawMoments = content.split(/^## /m).slice(1)
    const formattedMoments = rawMoments.map(item => {
      const lines = item.split('\n')
      const dateStr = lines[0].trim()
      const rawBody = lines.slice(1).join('\n').trim()
      
      const dateObj = new Date(dateStr);
      const timestamp = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

      return {
        type: 'moment',
        timestamp: timestamp, // <--- 核心：保留数字用于排序
        date: formatDate(dateObj),
        content: md.render(rawBody)
      }
    })

    // ----------------------
    // 3. 合并并排序
    // ----------------------
    const combined = [...formattedPosts, ...formattedMoments]
    
    // 直接比较数字，极快且不会出错
    return combined.sort((a, b) => b.timestamp - a.timestamp)
  }
}

// 辅助函数：统一日期格式 YYYY-MM-DD HH:mm
function formatDate(date: string | Date) {
  const d = new Date(date)
  if(isNaN(d.getTime())) return date // 如果解析失败直接返回原字符串
  
  // 简单格式化，你可以根据需要调整
  return d.toISOString().replace('T', ' ').substring(0, 16)
}