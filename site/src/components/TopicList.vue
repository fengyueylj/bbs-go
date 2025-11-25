<template>
  <ul class="topic-list">
    <li v-for="topic in topics" :key="topic.id" class="topic-item">
      <div class="topic-header">
        <div class="topic-header-main">
          <my-avatar :user="topic.user" />
          <div class="topic-userinfo">
            <a :href="`/user/${topic.user.id}`" class="topic-nickname">
              {{ topic.user.nickname }}
            </a>
            <div class="topic-time">
              {{ $t("component.topicList.publishedAt") }}&nbsp;{{
                usePrettyDate(topic.createTime)
              }}
            </div>
          </div>
        </div>
        <div class="topic-header-right">
          <span v-if="showSticky && topic.sticky" class="topic-sticky-icon">{{
            $t("component.topicList.sticky")
          }}</span>
        </div>
      </div>
      <div class="topic-content" :class="{ 'topic-tweet': topic.type === 1 }">
        <template v-if="topic.type === 0">
          <h1 class="topic-title">
            <nuxt-link :to="`/topic/${topic.id}`" target="_blank">
              {{ topic.title }}
            </nuxt-link>
          </h1>
          <nuxt-link
            :to="`/topic/${topic.id}`"
            class="topic-summary"
            target="_blank"
          >
            {{ topic.summary }}
          </nuxt-link>
        </template>
        <template v-if="topic.type === 1">
          <nuxt-link
            v-if="topic.content"
            :to="`/topic/${topic.id}`"
            class="topic-summary"
            target="_blank"
          >
            {{ topic.content }}
          </nuxt-link>
          <ul
            v-if="topic.imageList && topic.imageList.length"
            class="topic-image-list"
          >
            <li v-for="(image, index) in topic.imageList" :key="index">
              <nuxt-link
                :to="`/topic/${topic.id}`"
                class="image-item"
                target="_blank"
              >
                <img :src="image.preview" />
              </nuxt-link>
            </li>
          </ul>
        </template>
      </div>
      <div class="topic-bottom">
        <div class="topic-tags">
          <nuxt-link
            v-if="topic.node"
            class="topic-tag"
            target="_blank"
            :to="`/topics/node/${topic.node.id}`"
            :alt="topic.node.name"
          >
            <img v-if="topic.node.logo" :src="topic.node.logo" />
            <span>{{ topic.node.name }}</span>
          </nuxt-link>
        </div>

        <div class="topic-actions">
          <div
            class="btn EASE"
            :class="{ liked: topic.liked }"
            @click="like(topic)"
          >
            <i class="iconfont icon-like" />
            <span v-if="topic.likeCount > 0">{{ topic.likeCount }}</span>
          </div>
          <div class="btn EASE" @click="toTopicDetail(topic.id)">
            <i class="iconfont icon-comment" />
            <span v-if="topic.commentCount > 0">{{ topic.commentCount }}</span>
          </div>
          <!-- <div class="btn EASE" @click="toTopicDetail(topic.id)">
            <i class="iconfont icon-view" />
            <span v-if="topic.viewCount > 0">{{ topic.viewCount }}</span>
          </div> -->
        </div>
      </div>
    </li>
  </ul>
</template>
<script setup>
const { t } = useI18n();

const props = defineProps({
  topics: {
    type: Array,
    default() {
      return [];
    },
    required: false,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showSticky: {
    type: Boolean,
    default: false,
  },
});

const like = async (topic) => {
  try {
    if (topic.liked) {
      await useHttpPost(
        "/api/like/unlike",
        useJsonToForm({
          entityType: "topic",
          entityId: topic.id,
        })
      );
      topic.liked = false;
      topic.likeCount = topic.likeCount > 0 ? topic.likeCount - 1 : 0;
      useMsgSuccess(t("component.topicList.unlikeSuccess"));
    } else {
      await useHttpPost(
        "/api/like/like",
        useJsonToForm({
          entityType: "topic",
          entityId: topic.id,
        })
      );
      topic.liked = true;
      topic.likeCount++;
      useMsgSuccess(t("component.topicList.likeSuccess"));
    }
  } catch (e) {
    useCatchError(e);
  }
};

const toTopicDetail = (topicId) => {
  useLinkTo(`/topic/${topicId}`);
};
</script>
<style lang="scss" scoped>
.topic-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  .topic-item {
    background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-color) 100%);
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    margin-bottom: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.05);

    /* 添加微妙的顶部高光效果 */
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

    &:not(:last-child):after {
      display: none;
    }

    .topic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent);

      .topic-header-main {
        display: flex;
        align-items: center;
        gap: 12px;

        .topic-userinfo {
          margin-left: 0;
          
          .topic-nickname {
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

          .topic-time {
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

      .topic-header-right {
        .topic-sticky-icon {
          font-size: 12px;
          line-height: 1;
          color: white;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border-radius: 20px;
          padding: 6px 14px;
          white-space: nowrap;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 4px;

          &::before {
            content: '📌';
            font-size: 11px;
          }
        }
      }
    }

    .topic-content {
      margin-top: 0;
      padding: 1.5rem;
      background: var(--bg-color);
      
      .topic-title {
        display: inline-block;
        margin-bottom: 1rem;
        word-wrap: break-word;
        word-break: break-all;
        width: 100%;

        a {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.5;
          letter-spacing: -0.02em;
          transition: all 0.2s ease;
          display: inline;
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
      }

      .topic-summary {
        font-size: 14px;
        margin-bottom: 1rem;
        width: 100%;
        text-decoration: none;
        color: #555;
        word-wrap: break-word;
        line-height: 1.7;

        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-align: justify;
        word-break: break-all;
        text-overflow: ellipsis;
        transition: color 0.2s ease;

        &:hover {
          color: var(--text-color);
        }
      }

      &.topic-tweet {
        .topic-summary {
          color: var(--text-color);
          white-space: pre-line;
        }
      }

      .topic-image-list {
        margin-top: 1rem;
        display: grid;
        gap: 10px;

        li {
          cursor: pointer;
          text-align: center;
          display: inline-block;
          vertical-align: middle;
          margin: 0;
          background-color: var(--bg-color2);
          background-size: 32px 32px;
          background-position: 50%;
          background-repeat: no-repeat;
          overflow: hidden;
          position: relative;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            transform: scale(1.02);
          }

          .image-item {
            display: block;
            overflow: hidden;
            transform-style: preserve-3d;

            & > img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

              &:hover {
                transform: scale(1.08);
                backface-visibility: hidden;
              }
            }
          }

          /* 只有一个图片时 */
          &:first-child:nth-last-child(1) {
            width: 240px;
            height: 240px;
            line-height: 240px;
            grid-column: span 3;

            .image-item {
              width: 240px;
              height: 240px;
            }
          }

          /* 只有两个图片时 */
          &:first-child:nth-last-child(2),
          &:first-child:nth-last-child(2) ~ li {
            width: 200px;
            height: 200px;
            line-height: 200px;

            .image-item {
              width: 200px;
              height: 200px;
            }
          }

          /*大于两个图片时*/
          &:first-child:nth-last-child(n + 3),
          &:first-child:nth-last-child(n + 3) ~ li {
            width: 130px;
            height: 130px;
            line-height: 130px;

            .image-item {
              width: 130px;
              height: 130px;
            }
          }
        }

        /* Grid layout for multiple images */
        &:has(li:nth-child(3)) {
          grid-template-columns: repeat(3, 1fr);
        }
        &:has(li:nth-child(2)):not(:has(li:nth-child(3))) {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }

    .topic-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);
      background: linear-gradient(to top, rgba(0, 0, 0, 0.01), transparent);

      .topic-tags {
        display: flex;
        gap: 8px;

        .topic-tag {
          display: flex;
          justify-content: center;
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

          img {
            display: block;
            width: 20px;
            height: 20px;
            margin: 0 6px 0 0;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        }
      }

      .topic-actions {
        display: flex;
        align-items: center;
        margin-top: 0;
        font-size: 12px;
        user-select: none;
        gap: 8px;

        .btn {
          color: var(--text-color3);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(74, 108, 247, 0.1);
            transform: translate(-50%, -50%);
            transition: width 0.4s ease, height 0.4s ease;
          }

          &:hover {
            color: #4a6cf7;
            background: rgba(74, 108, 247, 0.08);
            transform: translateY(-2px);
            border-color: rgba(74, 108, 247, 0.2);
            box-shadow: 0 4px 8px rgba(74, 108, 247, 0.15);

            &::before {
              width: 100%;
              height: 100%;
            }
          }

          &:active {
            transform: translateY(0);
          }

          i {
            font-size: 16px;
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
          }

          span {
            line-height: 1;
            font-size: 14px;
            font-weight: 500;
            position: relative;
            z-index: 1;
          }

          &.liked {
            color: #ff4757;
            background: rgba(255, 71, 87, 0.1);
            border-color: rgba(255, 71, 87, 0.2);
            animation: likeAnimation 0.4s ease;

            &:hover {
              background: rgba(255, 71, 87, 0.15);
              border-color: rgba(255, 71, 87, 0.3);
            }

            i {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
}

@keyframes likeAnimation {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media screen and (max-width: 768px) {
  .topic-list {
    gap: 1rem;
    padding: 0;

    .topic-item {
      border-radius: 12px;
      margin-bottom: 0;

      .topic-header {
        padding: 1rem;
      }

      .topic-content {
        padding: 1rem;

        .topic-title a {
          font-size: 1.2rem;
        }

        .topic-image-list {
          gap: 8px;

          li {
            &:first-child:nth-last-child(1) {
              width: 180px;
              height: 180px;

              .image-item {
                width: 180px;
                height: 180px;
              }
            }

            &:first-child:nth-last-child(2),
            &:first-child:nth-last-child(2) ~ li {
              width: 140px;
              height: 140px;

              .image-item {
                width: 140px;
                height: 140px;
              }
            }

            &:first-child:nth-last-child(n + 3),
            &:first-child:nth-last-child(n + 3) ~ li {
              width: 100px;
              height: 100px;

              .image-item {
                width: 100px;
                height: 100px;
              }
            }
          }
        }
      }

      .topic-bottom {
        padding: 0.75rem 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;

        .topic-actions {
          gap: 6px;

          .btn {
            padding: 6px 12px;
            font-size: 12px;

            i {
              font-size: 14px;
            }

            span {
              font-size: 12px;
            }
          }
        }
      }

      &:after {
        display: none !important;
      }
    }
  }
}
</style>
