<template>
  <nav
    class="navbar has-shadow is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item">
          <img
            v-if="config.siteLogo"
            :alt="config.siteTitle"
            :src="config.siteLogo"
          />
          <img v-else :alt="config.siteTitle" src="~/assets/images/logo.png" />
        </nuxt-link>
        <a
          :class="{ 'is-active': navbarActive }"
          class="navbar-burger burger"
          data-target="navbarBasic"
          @click="toggleNav"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
      <div :class="{ 'is-active': navbarActive }" class="navbar-menu">
        <div class="navbar-start">
          <!-- Topics Nav Dropdown -->
          <div class="navbar-item has-dropdown is-hoverable">
            <div class="navbar-link">
              <i class="iconfont icon-category"></i>
              <span >{{ $t('common.topicCategories') }}</span>
            </div>
            <div class="navbar-dropdown">
              <nuxt-link
                v-for="node in nodes"
                :key="node.id"
                :to="nodeUrl(node)"
                :class="['navbar-item', { active: envStore.currentNodeId === node.id, 'hovered': hoveredNode === node.id }]"
                @mouseenter="hoveredNode = node.id"
                @mouseleave="hoveredNode = null"
                style="transition: all 0.2s ease"
              >
                <!-- 为所有选项预留图标位置，确保名称对齐 -->
                <div style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;">
                  <!-- 只在选中或悬停状态显示分类图标 -->
                  <i v-if="envStore.currentNodeId === node.id || hoveredNode === node.id" 
                     class="iconfont icon-category node-active-icon"></i>
                  <!-- 只在有logo时显示logo -->
                  <img
                    v-else-if="node.logo"
                    :src="node.logo"
                    class="node-logo-dropdown"
                    :alt="node.name"
                    style="width: 100%; height: 100%;"
                  />
                </div>
                <span class="node-name-dropdown">{{ node.name }}</span>
              </nuxt-link>
            </div>
          </div>
          <nuxt-link
            v-for="(nav, index) in config.siteNavs"
            :key="index"
            :to="nav.url"
            class="navbar-item"
          >
            {{ nav.title }}
          </nuxt-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <search-input />
          </div>

          <div class="navbar-item">
            <create-topic-btn />
          </div>

          <msg-notice v-if="user" />

          <div
            v-if="user"
            class="navbar-item has-dropdown is-hoverable user-menus"
          >
            <div class="navbar-link">
              <MyAvatar :user="user" :size="24" />
              <span
                :to="`/user/${user.id}`"
                class="user-menus-nickname ellipsis"
                >{{ user.nickname }}</span
              >
            </div>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" :to="`/user/${user.id}`">
                <i class="iconfont icon-username" />
                <span>{{ $t("common.header.profile") }}</span>
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/user/favorites">
                <i class="iconfont icon-favorite" />
                <span>{{ $t("common.header.favorites") }}</span>
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/user/profile">
                <i class="iconfont icon-edit" />
                <span>{{ $t("common.header.editProfile") }}</span>
              </nuxt-link>
              <a class="navbar-item" @click="signout">
                <i class="iconfont icon-log-out" />
                <span>{{ $t("common.header.logout") }}</span>
              </a>
            </div>
          </div>
          <div v-else class="navbar-item">
            <div class="buttons">
              <nuxt-link class="button login-btn" to="/user/signin">
                {{ $t("common.header.login") }}
              </nuxt-link>
            </div>
          </div>
          <div class="navbar-item">
            <color-mode />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import iconNew from "~/assets/images/new.png";
import iconRecommend from "~/assets/images/recommend.png";
import iconFeed from "~/assets/images/feed.png";
import iconNode from "~/assets/images/node.png";

const userStore = useUserStore();
const configStore = useConfigStore();
const envStore = useEnvStore();
const router = useRouter();

const { user } = storeToRefs(userStore);
const { config } = storeToRefs(configStore);
const { t } = useI18n();

const navbarActive = ref(false);
const hoveredNode = ref(null);
const { data: nodes } = await useMyFetch("/api/topic/node_navs");

function toggleNav() {
  navbarActive.value = !navbarActive.value;
}

async function signout() {
  if (confirm(t("common.header.confirmLogout"))) {
    await userStore.signout();
    useLinkTo("/");
  }
}

function nodeUrl(node) {
  if (node.id > 0) {
    return `/topics/node/${node.id}`;
  } else if (node.id === 0) {
    return "/topics/node/newest";
  } else if (node.id === -1) {
    return "/topics/node/recommend";
  } else if (node.id === -2) {
    return "/topics/node/feed";
  }
  return "/";
}

function selectNode(nodeId) {
  envStore.setCurrentNodeId(nodeId);
}

function getNodeIconClass(nodeId) {
  if (nodeId === 0) {
    return 'iconfont icon-new';
  } else if (nodeId === -1) {
    return 'iconfont icon-recommend';
  } else if (nodeId === -2) {
    return 'iconfont icon-feed';
  }
  return 'iconfont icon-category';
}
</script>

<style lang="scss" scoped>
.navbar {
  /*opacity: 0.99;*/
  /*border-bottom: 1px solid #e7edf3;*/
  background-color: var(--bg-color);

  .navbar-item {
    font-weight: 700;
  }

  .publish {
    color: var(--text-color);
    background-color: #3174dc;
    width: 100px;
    &:hover {
      color: var(--text-color);
      background-color: #4d91fa;
    }
  }

  .login-btn {
    height: 32px;
    border-color: #000; // TODO
    &:hover {
      color: var(--text-color3);
      border-color: var(--text-color3);
    }
  }
}

.user-menus {
  .navbar-link {
    display: flex;
    align-items: center;

    .user-menus-nickname {
      margin-left: 5px;
      padding: 0 4px;
      font-size: 14px;
      color: var(--text-color);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .navbar-dropdown {
    border: 1px solid var(--border-color);

    a {
      display: flex;
      align-items: center;
      // padding: 8px 16px;
      img {
        width: 20px;
        height: 20px;
      }
      span {
        margin-left: 10px;
        width: 56px;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }
}

/* Topics Nav Dropdown Styles */
.navbar-dropdown {
  width: 220px;
  max-height: 300px;
  overflow-y: auto;
}

.node-logo-dropdown {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;
}

.node-icon-dropdown {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.node-active-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  color: #4a6cf7; /* 使用品牌色突出显示选中状态 */
  font-size: 16px;
}

/* 悬停状态的样式增强 */
.navbar-dropdown .navbar-item:hover,
.navbar-item.hovered {
  background-color: rgba(74, 108, 247, 0.08);
  padding-left: 12px;
  border-radius: 4px;
}

.node-name-dropdown {
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.navbar-dropdown a.active {
  background-color: var(--primary-50);
  color: var(--primary-6);
  font-weight: 500;
}

.navbar-dropdown a:hover {
  background-color: var(--bg-color-light);
}

/* Custom scrollbar for dropdown */
.navbar-dropdown::-webkit-scrollbar {
  width: 6px;
}

.navbar-dropdown::-webkit-scrollbar-track {
  background: var(--bg-color-light);
}

.navbar-dropdown::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.navbar-dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-light);
}
</style>
