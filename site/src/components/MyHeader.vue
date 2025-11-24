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
            <div class="navbar-link topic-categories">
              <i class="iconfont icon-category"></i>
              <span>{{ $t('common.topicCategories') }}</span>
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
            <div class="navbar-link user-info">
              <MyAvatar :user="user" :size="24" />
              <span
                class="user-menus-nickname ellipsis"
                >{{ user.nickname }}</span
              >
            </div>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item dropdown-item" :to="`/user/${user.id}`">
                <div style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <i class="iconfont icon-username" />
                </div>
                <span>{{ $t("common.header.profile") }}</span>
              </nuxt-link>
              <nuxt-link class="navbar-item dropdown-item" to="/user/favorites">
                <div style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <i class="iconfont icon-favorite" />
                </div>
                <span>{{ $t("common.header.favorites") }}</span>
              </nuxt-link>
              <nuxt-link class="navbar-item dropdown-item" to="/user/profile">
                <div style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <i class="iconfont icon-edit" />
                </div>
                <span>{{ $t("common.header.editProfile") }}</span>
              </nuxt-link>
              <a class="navbar-item dropdown-item" @click="signout">
                <div style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <i class="iconfont icon-log-out" />
                </div>
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
  background: linear-gradient(135deg, #4a6cf7, #6a11cb);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;

  .navbar-item {
    font-weight: 500;
    color: white;
    border-radius: 50px;
    transition: all 0.3s ease;
    margin: 0 0.25rem;
  }

  .navbar-item:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  /* Topic Categories Dropdown Toggle */
  .navbar-link.topic-categories {
    display: flex;
    align-items: center;
    gap: 5px;
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    padding-right: 2rem; /* Add space for dropdown arrow */
    border-radius: 50px;
    transition: all 0.3s ease;
  }
  
  .has-dropdown:hover .navbar-link.topic-categories {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .publish {
    color: white;
    background-color: #3174dc;
    width: 100px;
    border-radius: 50px;
    &:hover {
      color: white;
      background-color: #4d91fa;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  .login-btn {
    height: 32px;
    border: 2px solid white;
    color: white;
    background-color: transparent;
    border-radius: 50px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}

.user-menus {
  .navbar-link.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.5rem 1rem;
    padding-right: 2rem; /* Add space for dropdown arrow */
    border-radius: 50px;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .user-menus-nickname {
      margin-left: 5px;
      padding: 0 4px;
      font-size: 14px;
      color: white;
      font-weight: 500;
      max-width: 100px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .navbar-dropdown {
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-top: 5px;
    padding: 0.5rem;
    background-color: white;

    a.dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      transition: all 0.2s ease;
      border-radius: 8px;
      margin: 0.25rem 0;
      color: var(--text-color);
      
      &:hover {
        background-color: rgba(74, 108, 247, 0.1);
        transform: translateX(2px);
      }
      
      i {
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: var(--text-color);
        flex: 1;
      }
    }
  }
}

/* Topics Nav Dropdown Styles */
.navbar-dropdown {
  width: 240px;
  max-height: 320px;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  background-color: white;
}

.node-logo-dropdown {
  width: 16px;
  height: 16px;
  border-radius: 4px;
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
  background-color: rgba(74, 108, 247, 0.1);
  padding-left: 12px;
  border-radius: 8px;
}

.node-name-dropdown {
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  color: var(--text-color);
}

.navbar-dropdown a.active {
  background-color: rgba(74, 108, 247, 0.15);
  color: #4a6cf7;
  font-weight: 500;
}

.navbar-dropdown a:hover {
  background-color: rgba(74, 108, 247, 0.08);
  transform: translateX(2px);
  transition: all 0.2s ease;
}

/* Custom scrollbar for dropdown */
.navbar-dropdown::-webkit-scrollbar {
  width: 6px;
}

.navbar-dropdown::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.navbar-dropdown::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.navbar-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 响应式优化 */
@media screen and (max-width: 1024px) {
  .navbar-dropdown {
    width: 200px;
    max-height: 250px;
  }
  
  .node-name-dropdown {
    font-size: 13px;
  }
}

@media screen and (max-width: 768px) {
  .navbar {
    padding: 0.25rem 0;
  }
  
  .navbar-dropdown {
    width: 180px;
    max-height: 200px;
  }
  
  .user-menus .navbar-link.user-info {
    padding: 0.25rem 0.75rem;
  }
}
</style>
