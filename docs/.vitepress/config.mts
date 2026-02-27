import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Alugard-Drop",
  base: '/alugard/',
  description: "Modern drag and drop library — zero dependencies, TypeScript-first",
  themeConfig: {
    logo: '/logo.png',
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'API Reference', link: '/api/options' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Frameworks',
          items: [
            { text: 'React', link: '/guide/react' },
            { text: 'Vue.js', link: '/guide/vue' },
            { text: 'Angular', link: '/guide/angular' },
            { text: 'Svelte', link: '/guide/svelte' }
          ]
        },
        {
          text: 'Advanced Guides',
          items: [
            { text: 'Column Layouts', link: '/guide/column-layout' },
            { text: 'Grid Layouts', link: '/guide/grid-layout' },
            { text: 'Dragging Components', link: '/guide/components' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Configuration Options', link: '/api/options' },
            { text: 'Events', link: '/api/events' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alugard/alugard-drop' }
    ]
  }
})
