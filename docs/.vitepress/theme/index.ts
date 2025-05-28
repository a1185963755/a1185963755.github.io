import { defineComponent, h, inject } from "vue";
import DefaultTheme from "vitepress/theme";
import { NConfigProvider } from "naive-ui";
import { setup } from "@css-render/vue3-ssr";
import { useRoute } from "vitepress";
import "./styles/global.css";
import { inBrowser } from "vitepress";
import busuanzi from "busuanzi.pure.js";
import ArticleHeader from "../components/ArticleHeader.vue";
import MyLayout from "./MyLayout.vue";
import "viewerjs/dist/viewer.min.css";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject<() => string>("css-render-collect");
    return {
      style: collect ? collect() : "",
    };
  },
  render() {
    return h("css-render-style", {
      innerHTML: this.style,
    });
  },
});

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute();
    return () => {
      return h("vitepress-path", null, [route.path]);
    };
  },
});

const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        default: () => [h(MyLayout, null, { default: this.$slots.default?.() }), import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null],
      }
    );
  },
});

export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app, router }) => {
    app.component("ArticleHeader", ArticleHeader);
    app.component("vImageViewer", vImageViewer);
    if (import.meta.env.SSR) {
      const { collect } = setup(app);
      app.provide("css-render-collect", collect);
    }
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
      };
    }
  },
  setup() {
    const route = useRoute();
    imageViewer(route);
  },
};
