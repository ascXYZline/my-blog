
// .vitepress/plugins/obsidianCompat.ts

/** Obsidian type → VitePress container type */
const TYPE_ALIAS: Record<string, string> = {
  note:      'info',
  hint:      'tip',
  caution:   'warning',
  important: 'warning',
  // 直接通过的: info, tip, warning, danger, details
}

/** 检测 callout 起始行：> [!type] optional title */
const CALLOUT_START = /^>\s*\[!(\w+)\]\s*(.*)$/

/**
 * 逐行解析，将 Obsidian callout 转为 ::: container 语法
 * 
 * 支持：
 *  - 标准写法（每行 > 前缀）
 *  - callout 内空行（> 后续行继续）
 *  - 自定义标题
 */
export function transformObsidianCallouts(src: string): string {
  const lines = src.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const match = lines[i].match(CALLOUT_START)

    // ── 普通行，直接输出 ──
    if (!match) {
      out.push(lines[i])
      i++
      continue
    }

    // ── 检测到 callout 起始 ──
    const rawType = match[1].toLowerCase()
    const type = TYPE_ALIAS[rawType] || rawType
    const customTitle = match[2]?.trim()

    out.push(`::: ${type}${customTitle ? ' ' + customTitle : ''}`)
    i++ // 跳过 [!type] 行

    // ── 收集 body：所有以 > 开头的后续行 ──
    while (i < lines.length) {
      const line = lines[i]

      // 以 > 开头 → 属于 callout 内容
      if (/^>/.test(line)) {
        // 去掉行首的 "> " 或 ">"
        out.push(line.replace(/^>\s?/, ''))
        i++
        continue
      }

      // 空行 → 看下一行是否还以 > 开头（callout 内的空行）
      if (line.trim() === '' && i + 1 < lines.length && /^>/.test(lines[i + 1])) {
        out.push('')
        i++
        continue
      }

      // 其他情况 → callout 结束
      break
    }

    out.push(':::')
    out.push('') // 闭合后留一个空行，避免粘连
  }

  return out.join('\n')
}