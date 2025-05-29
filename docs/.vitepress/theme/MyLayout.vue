<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, ref } from 'vue'
import Loading from '../components/Loading.vue'
const loading = ref(true)
const { Layout } = DefaultTheme
onMounted(() => {
  loading.value = false
})
</script>

<template>
  <Loading v-show="loading" />
  <Layout v-show="!loading">
    <template #layout-bottom>
      <div class="bottom">
        <div>
          本站总访问量
          <span id="busuanzi_value_site_pv" class="font-bold">--</span> 次 本站访客数
          <span id="busuanzi_value_site_uv" class="font-bold">--</span> 人次
        </div>
        <p>前端狗都不如 © 2021-2025 th</p>
      </div>
    </template>
  </Layout>
  <!-- ... -->
</template>

<style lang="scss" scoped>
.bottom {
  margin-left: 5%;
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color-1);
  text-align: center;

  p {
    margin-top: 5px;
  }
}
</style>