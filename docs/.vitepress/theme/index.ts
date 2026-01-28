// 1. 引入原主题
import BlogTheme from '@sugarat/theme'

// 2. 引入你的自定义组件
import Timeline from './components/Timeline.vue'

// 3. 引入样式
import './style.css'
import './custom.css'
// import './user-theme.css'

export default {
  // Key Point 1: 继承 BlogTheme，而不是 vitepress 的 DefaultTheme
  // 这样你才能保留 @sugarat/theme 的所有功能（导航、布局、搜索等）
  extends: BlogTheme,

  enhanceApp(ctx) {
    // Key Point 2: 调用原主题的 enhanceApp
    // 这非常重要！如果不写这一行，@sugarat/theme 注册的全局组件和功能会失效
    if (BlogTheme.enhanceApp) {
      BlogTheme.enhanceApp(ctx)
    }

    // Key Point 3: 注册你的 Timeline 组件
    // 解构出 app 实例
    const { app } = ctx
    app.component('Timeline', Timeline)
  }
}


