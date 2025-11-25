<template>
  <div class="article-list">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <!-- Article Header -->
      <div class="article-header">
        <div class="article-user">
          <my-avatar :user="article.user" :size="40" />
          <div>
            <nuxt-link :to="'/user/' + article.user.id" class="user-name">
              {{ article.user.nickname }}
            </nuxt-link>
            <div class="article-time">
              {{ $t("component.articleList.publishedAt") }} {{ usePrettyDate(article.createTime) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="article-content">
        <nuxt-link class="article-title" :to="'/article/' + article.id" target="_blank">
          {{ article.title }}
        </nuxt-link>
        
        <div class="article-summary">
          {{ article.summary }}
        </div>

        <!-- Cover Image -->
        <div v-if="article.cover" class="article-cover">
          <img :src="article.cover.url" :alt="article.title" />
        </div>
      </div>

      <!-- Article Actions -->
      <div class="article-actions">
        <div class="article-tags">
          <nuxt-link
            v-for="tag in article.tags"
            :key="tag.id"
            class="article-tag"
            :to="'/articles/tag/' + tag.id"
          >
            {{ tag.name }}
          </nuxt-link>
        </div>
        <div class="article-stats">
          <span class="stat-item">
            <i class="iconfont icon-view" />
            <span v-if="article.viewCount > 0">{{ article.viewCount }}</span>
          </span>
          <span class="stat-item">
            <i class="iconfont icon-comment" />
            <span v-if="article.commentCount > 0">{{ article.commentCount }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  articles: {
    type: Array,
    default() {
      return [];
    },
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.article-card {
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-color) 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);

  /* 顶部高光效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
    border-color: rgba(74, 108, 247, 0.2);
  }

  &:active {
    transform: translateY(-4px) scale(1.005);
  }

  .article-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent);

    .article-user {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-color);
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4a6cf7, #6a11cb);
          transition: width 0.3s ease;
        }

        &:hover {
          color: #4a6cf7;
          
          &::after {
            width: 100%;
          }
        }
      }

      .article-time {
        margin-top: 4px;
        font-size: 12px;
        color: var(--text-color3);
        display: flex;
        align-items: center;
        gap: 4px;

        &::before {
          content: '📅';
          font-size: 11px;
        }
      }
    }
  }

  .article-content {
    padding: 1.5rem;
    background: var(--bg-color);

    .article-title {
      display: block;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-color);
      line-height: 1.5;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
      transition: all 0.2s ease;
      background: linear-gradient(to right, transparent 0%, transparent 100%);
      background-size: 0% 2px;
      background-repeat: no-repeat;
      background-position: left bottom;

      &:hover {
        color: #4a6cf7;
        text-decoration: none;
        background: linear-gradient(to right, #4a6cf7 0%, #6a11cb 100%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: left bottom;
      }
    }

    .article-summary {
      font-size: 14px;
      color: #555;
      line-height: 1.7;
      margin-bottom: 1rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      text-align: justify;
      word-break: break-all;
      text-overflow: ellipsis;
    }

    .article-cover {
      margin-top: 1rem;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      max-width: 300px;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
      }

      img {
        width: 100%;
        height: auto;
        max-height: 180px;
        object-fit: cover;
        display: block;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  .article-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.01), transparent);

    .article-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .article-tag {
        display: inline-flex;
        align-items: center;
        padding: 7px 14px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(74, 108, 247, 0.08), rgba(106, 17, 203, 0.08));
        color: var(--text-color3);
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(74, 108, 247, 0.1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        &:hover {
          color: #4a6cf7;
          background: linear-gradient(135deg, rgba(74, 108, 247, 0.15), rgba(106, 17, 203, 0.15));
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
          border-color: rgba(74, 108, 247, 0.3);

          &::before {
            left: 100%;
          }
        }
      }
    }

    .article-stats {
      display: flex;
      align-items: center;
      gap: 1rem;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text-color3);
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(0, 0, 0, 0.02);
        border: 1px solid transparent;
        cursor: pointer;

        &:hover {
          color: #4a6cf7;
          background: rgba(74, 108, 247, 0.08);
          transform: translateY(-2px);
          border-color: rgba(74, 108, 247, 0.2);
          box-shadow: 0 4px 8px rgba(74, 108, 247, 0.15);
        }

        i {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        span {
          font-weight: 500;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .article-list {
    gap: 1rem;
    padding: 0;
  }

  .article-card {
    border-radius: 12px;

    .article-header {
      padding: 1rem;
    }

    .article-content {
      padding: 1rem;

      .article-title {
        font-size: 1.2rem;
      }

      .article-cover img {
        max-height: 200px;
      }
    }

    .article-actions {
      padding: 0.75rem 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;

      .article-stats {
        gap: 6px;

        .stat-item {
          padding: 6px 12px;
          font-size: 12px;

          i {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
