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
            page.url !== '/timeline' && // 确保排除你的时间线页面本身
            page.url !== '/essay' &&    // 如果你的时间线页面叫 essay 也排除
            page.frontmatter.article !== false &&
            page.frontmatter.publish !== false
          )
        })
      }
    })
    
    const posts = await postsLoader.load()
    
    const formattedPosts = posts.map(post => {
      // 获取日期对象
      const dateObj = new Date(post.frontmatter.date); 
      // 检查日期是否有效
      const timestamp = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

      return {
        type: 'post',
        timestamp: timestamp, // 用于排序
        date: formatDate(dateObj), // 用于展示 (修复了时区)
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
        timestamp: timestamp, // 用于排序
        date: formatDate(dateObj), // 用于展示 (修复了时区)
        content: md.render(rawBody)
      }
    })

    // ----------------------
    // 3. 合并并排序
    // ----------------------
    const combined = [...formattedPosts, ...formattedMoments]
    
    // 按时间戳倒序
    return combined.sort((a, b) => b.timestamp - a.timestamp)
  }
}

// ==========================================
// 重点修复了这里：不再使用 toISOString
// ==========================================
function formatDate(date: string | Date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date

  // 手动拼接本地时间，保证“所见即所得”，不会被减去8小时
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}