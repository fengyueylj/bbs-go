<template>
  <section class="main">
    <div class="container topics-container">
      <!-- 左侧广告栏 -->
      <aside v-if="showAd" class="left-sidebar">
        <ad-banner @close-ad="closeAd" />
      </aside>

      <!-- 中间主内容区 -->
      <div class="main-content no-padding no-bg topics-wrapper">
        <div class="topics-main">
          <load-more-async v-slot="{ results }" url="/api/topic/topics">
            <topic-list :topics="results" show-sticky />
          </load-more-async>
        </div>
      </div>

      <!-- 右侧热门帖子排行榜 -->
      <aside class="right-sidebar">
        <trending-topics />
      </aside>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();
useHead({
  title: useSiteTitle(t("pages.topics.title")),
});

const showAd = ref(true);

const closeAd = () => {
  showAd.value = false;
};
</script>

<style lang="scss" scoped>
.topics-container {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;

  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr 300px;
    
    .left-sidebar {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    
    .left-sidebar,
    .right-sidebar {
      display: none;
    }
  }
}

.left-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}
</style>
