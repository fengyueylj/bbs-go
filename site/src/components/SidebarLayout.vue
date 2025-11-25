<template>
  <div class="sidebar-layout">
    <!-- 左侧广告栏 -->
    <aside v-if="showLeftSidebar && showAd" class="left-sidebar">
      <ad-banner @close-ad="closeAd" />
    </aside>

    <!-- 主内容区 -->
    <div class="main-content-area">
      <slot />
    </div>

    <!-- 右侧栏 -->
    <aside v-if="showRightSidebar" class="right-sidebar">
      <slot name="right-sidebar">
        <!-- 默认右侧内容 -->
        <trending-topics v-if="showTrendingTopics" />
        <trending-articles v-if="showTrendingArticles" class="sidebar-spacing" />
      </slot>
    </aside>
  </div>
</template>

<script setup>
const props = defineProps({
  showLeftSidebar: {
    type: Boolean,
    default: true,
  },
  showRightSidebar: {
    type: Boolean,
    default: true,
  },
  showTrendingTopics: {
    type: Boolean,
    default: false,
  },
  showTrendingArticles: {
    type: Boolean,
    default: false,
  },
  leftWidth: {
    type: String,
    default: '280px',
  },
  rightWidth: {
    type: String,
    default: '320px',
  },
});

const showAd = ref(true);

const closeAd = () => {
  showAd.value = false;
};
</script>

<style lang="scss" scoped>
.sidebar-layout {
  display: grid;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;

  /* 三栏布局 */
  grid-template-columns: v-bind(leftWidth) 1fr v-bind(rightWidth);

  /* 两栏布局（仅右侧） */
  &:not(:has(.left-sidebar)) {
    grid-template-columns: 1fr v-bind(rightWidth);
  }

  /* 两栏布局（仅左侧） */
  &:not(:has(.right-sidebar)) {
    grid-template-columns: v-bind(leftWidth) 1fr;
  }

  /* 单栏布局 */
  &:not(:has(.left-sidebar)):not(:has(.right-sidebar)) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr v-bind(rightWidth);
    
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

.left-sidebar,
.right-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.main-content-area {
  min-width: 0;
}

.sidebar-spacing {
  margin-top: 1.5rem;
}
</style>
