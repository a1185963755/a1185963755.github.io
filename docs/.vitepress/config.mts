import { defineConfig } from "vitepress";
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import { generateSidebar } from "vitepress-sidebar";
import { HeaderPlugin } from "./plugins/headerPlugin";

const fileAndStyles: Record<string, string> = {};
const autoSidebar = () => {
  let result: any = generateSidebar({
    documentRootPath: "/docs",
    collapseDepth: 2,
    useTitleFromFrontmatter: true,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
  });
  return result.map((year) => ({
    ...year,
    items: year.items.reverse(),
  }));
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "th的博客",
  description: "分享技术，记录生活",
  themeConfig: {
    nav: [
      { text: "主页", link: "/" },
      { text: "前端", link: "/directory" },
    ],
    sidebar: autoSidebar(),
    socialLinks: [{ icon: "github", link: "https://github.com/a1185963755" }],
  },
  vite: {
    plugins: [
      pagefindPlugin({
        btnPlaceholder: "搜索",
        placeholder: "搜索文档",
        emptyText: "空空如也",
        heading: "共: {{searchResult}} 条结果",
        customSearchQuery(input) {
          return input
            .replace(/[\u4E00-\u9FA5]/g, " $& ")
            .replace(/\s+/g, " ")
            .trim();
        },
      }),
      HeaderPlugin(),
    ],
    ssr: {
      noExternal: ["naive-ui", "date-fns", "vueuc"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
        },
      },
    },
  },
  postRender(context) {
    const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/;
    const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/;
    const style = styleRegex.exec(context.content)?.[1];
    const vitepressPath = vitepressPathRegex.exec(context.content)?.[1];
    if (vitepressPath && style) {
      fileAndStyles[vitepressPath] = style;
    }
    context.content = context.content.replace(styleRegex, "");
    context.content = context.content.replace(vitepressPathRegex, "");
  },
  transformHtml(code, id) {
    const html = id.split("/").pop();
    if (!html) return;
    const style = fileAndStyles[`/${html}`];
    if (style) {
      return code.replace(/<\/head>/, `${style}</head>`);
    }
  },
});
