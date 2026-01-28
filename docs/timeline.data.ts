import fs from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, createContentLoader } from 'vitepress'

export default {
  // 监听 moments.md 的变化
  watch: ['./_data/moments.md'],

  async load() {
    // ----------------------
    // 1. 获取所有博客文章
    // ----------------------
    // '**/*.md' 表示扫描 docs 下所有 markdown
    const postsLoader = createContentLoader('**/*.md', {
      excerpt: true, // 提取摘要
      transform(rawData) {
        // 过滤掉不需要的文章（比如首页、碎碎念页自己、隐藏的文章）
        return rawData.filter((page) => {
          return (
            page.url !== '/' &&             // 排除首页
            page.url !== '/timeline' &&        // 排除时间线页面自己
            page.frontmatter.article !== false && // 排除标记为非文章的
            page.frontmatter.publish !== false
          )
        }).sort((a, b) => {
          return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
        })
      }
    })
    
    const posts = await postsLoader.load()
    
    // 格式化文章数据，标记 type 为 'post'
    const formattedPosts = posts.map(post => ({
      type: 'post',
      date: formatDate(post.frontmatter.date), // 统一日期格式
      title: post.frontmatter.title || post.url,
      link: post.url,
      tags: post.frontmatter.tags || [],
      // 如果没有摘要，就不用
      excerpt: post.frontmatter.description || post.frontmatter.summary || post.excerpt 
    }))

    // ----------------------
    // 2. 获取碎碎念 (Moments)
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
      
      return {
        type: 'moment', // 标记 type 为 'moment'
        date: formatDate(dateStr),
        content: md.render(rawBody)
      }
    })

    // ----------------------
    // 3. 合并并排序
    // ----------------------
    const combined = [...formattedPosts, ...formattedMoments]
    
    // 按日期倒序排列
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

// 辅助函数：统一日期格式 YYYY-MM-DD HH:mm
function formatDate(date: string | Date) {
  const d = new Date(date)
  if(isNaN(d.getTime())) return date // 如果解析失败直接返回原字符串
  
  // 简单格式化，你可以根据需要调整
  return d.toISOString().replace('T', ' ').substring(0, 16)
}