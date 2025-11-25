<template>
  <div class="trending-card">
    <h3 class="trending-header">
      <i class="iconfont icon-article"></i>
      <span>热门文章</span>
    </h3>
    <div class="trending-list">
      <nuxt-link
        v-for="(item, index) in trendingArticles"
        :key="item.id"
        :to="`/article/${item.id}`"
        class="trending-item"
      >
        <div class="trending-rank" :class="getRankClass(index)">{{ index + 1 }}</div>
        <div class="trending-content">
          <div class="trending-title">{{ item.title }}</div>
          <div class="trending-meta">
            <span><i class="iconfont icon-view"></i> {{ item.viewCount || 0 }}</span>
            <span><i class="iconfont icon-comment"></i> {{ item.commentCount || 0 }}</span>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const trendingArticles = ref([]);

// 获取热门文章
const { data } = await useMyFetch('/api/article/articles', {
  params: {
    page: 1,
    limit: 10,
  }
});

if (data.value?.results) {
  trendingArticles.value = data.value.results.slice(0, 10);
}

const getRankClass = (index) => {
  if (index === 0) return 'rank-1';
  if (index === 1) return 'rank-2';
  if (index === 2) return 'rank-3';
  return '';
};
</script>

<style lang="scss" scoped>
.trending-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.trending-header {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #4a6cf7;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-weight: 600;

  i {
    color: #4a6cf7;
    font-size: 1.2rem;
  }
}

.trending-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trending-item {
  display: flex;
  gap: 10px;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border-radius: 6px;
  text-decoration: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(74, 108, 247, 0.05);
    transform: translateX(5px);
  }
}

.trending-rank {
  font-weight: bold;
  font-size: 1rem;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1));
  color: var(--text-color3);
  flex-shrink: 0;

  &.rank-1 {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #d4a017;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  &.rank-2 {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
    color: #808080;
    box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
  }

  &.rank-3 {
    background: linear-gradient(135deg, #cd7f32, #e5a158);
    color: #8b4513;
    box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
  }
}

.trending-content {
  flex: 1;
  min-width: 0;
}

.trending-title {
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 3px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.trending-meta {
  display: flex;
  gap: 10px;
  font-size: 0.7rem;
  color: var(--text-color3);

  span {
    display: flex;
    align-items: center;
    gap: 3px;

    i {
      font-size: 0.75rem;
    }
  }
}

@media screen and (max-width: 1024px) {
  .trending-card {
    display: none;
  }
}
</style>
