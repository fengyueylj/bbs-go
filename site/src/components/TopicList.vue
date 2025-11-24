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
  .topic-item {
    background-color: var(--bg-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 0;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    &:not(:last-child):after {
      display: none;
    }

    .topic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem;
      border-bottom: 1px solid var(--border-color);

      .topic-header-main {
        display: flex;
        align-items: center;
        gap: 10px;

        .topic-userinfo {
          margin-left: 0;
          .topic-nickname {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-color);
            transition: color 0.2s ease;

            &:hover {
              color: var(--text-link-color);
            }
          }

          .topic-time {
            margin-top: 3px;
            font-size: 13px;
            color: var(--text-color3);
          }
        }
      }

      .topic-header-right {
        .topic-sticky-icon {
          font-size: 13px;
          line-height: 13px;
          color: white;
          background: linear-gradient(135deg, #ff7827, #ff9e5f);
          border-radius: 50px;
          padding: 4px 12px;
          white-space: nowrap;
          font-weight: 600;
        }
      }
    }

    .topic-content {
      margin-top: 0;
      padding: 1.2rem;
      
      .topic-title {
        display: inline-block;
        margin-bottom: 0.8rem;
        word-wrap: break-word;
        word-break: break-all;
        width: 100%;

        a {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-color);
          line-height: 1.4;

          &:hover {
            color: var(--text-link-color);
            text-decoration: none;
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
        line-height: 1.6;

        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-align: justify;
        word-break: break-all;
        text-overflow: ellipsis;
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
        gap: 8px;

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
          border-radius: 8px;

          .image-item {
            display: block;
            overflow: hidden;
            transform-style: preserve-3d;

            & > img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: all 0.5s ease-out 0.1s;

              &:hover {
                transform: matrix(1.04, 0, 0, 1.04, 0, 0);
                backface-visibility: hidden;
              }
            }
          }

          /* 只有一个图片时 */
          &:first-child:nth-last-child(1) {
            width: 210px;
            height: 210px;
            line-height: 210px;
            grid-column: span 3;

            .image-item {
              width: 210px;
              height: 210px;
            }
          }

          /* 只有两个图片时 */
          &:first-child:nth-last-child(2),
          &:first-child:nth-last-child(2) ~ li {
            width: 180px;
            height: 180px;
            line-height: 180px;

            .image-item {
              width: 180px;
              height: 180px;
            }
          }

          /*大于两个图片时*/
          &:first-child:nth-last-child(n + 3),
          &:first-child:nth-last-child(n + 3) ~ li {
            width: 120px;
            height: 120px;
            line-height: 120px;

            .image-item {
              width: 120px;
              height: 120px;
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
      padding: 1rem 1.2rem;
      border-top: 1px solid var(--border-color);

      .topic-tags {
        display: flex;

        .topic-tag {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6px 12px;
          border-radius: 50px;
          background: var(--bg-color6);
          color: var(--text-color3);
          font-size: 13px;
          transition: all 0.2s ease;

          &:hover {
            color: var(--text-color3-hover);
            background: var(--bg-color6-hover);
            transform: translateY(-2px);
          }

          img {
            display: block;
            width: 20px;
            height: 20px;
            margin: 0 4px 0 0;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }

      .topic-actions {
        display: flex;
        align-items: center;
        margin-top: 0;
        font-size: 12px;
        user-select: none;
        gap: 1rem;

        .btn {
          color: var(--text-color3);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;

          &:hover {
            color: var(--text-link-color);
            background-color: rgba(74, 108, 247, 0.1);
          }

          i {
            font-size: 16px;
            position: relative;
          }

          span {
            line-height: 1;
            font-size: 15px;
          }

          &.liked {
            color: var(--color-red) !important;
            background-color: rgba(255, 68, 68, 0.1);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .topic-list {
    .topic-item {
      padding: 0;
      border-radius: 8px;
      margin-bottom: 1rem;

      .topic-header {
        padding: 1rem;
      }

      .topic-content {
        padding: 1rem;
      }

      .topic-bottom {
        padding: 0.75rem 1rem;
      }

      &:after {
        display: none !important;
      }
    }
  }
}
</style>
