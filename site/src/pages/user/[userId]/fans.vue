<template>
  <section class="main">
    <div class="container">
      <user-profile :user="user" />

      <div class="container main-container right-main size-320">
        <user-center-sidebar :user="user" />
        <div class="right-container">
          <div class="tabs-warp">
            <div class="tabs">
              <ul>
                <li :class="{ 'is-active': activeTab === 'fans' }">
                  <nuxt-link :to="`/user/${user.id}/fans`">
                    <span class="icon is-small">
                      <i class="iconfont icon-fans" aria-hidden="true" />
                    </span>
                    <span>{{ $t("pages.user.fans") }}</span>
                  </nuxt-link>
                </li>
                <li :class="{ 'is-active': activeTab === 'followed' }">
                  <nuxt-link :to="`/user/${user.id}/followed`">
                    <span class="icon is-small">
                      <i class="iconfont icon-follow" aria-hidden="true" />
                    </span>
                    <span>{{ $t("pages.user.followed") }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>

            <load-more-async
              v-slot="{ results }"
              url="/api/fans/fans"
              :params="{ userId: user.id }"
            >
              <user-follow-list :users="results" />
            </load-more-async>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute();
const user = await useHttpGet(`/api/user/${route.params.userId}`);
const activeTab = ref("fans");
const { t } = useI18n();

useHead({
  title: useSiteTitle(t("pages.user.fans"), user.nickname),
});
</script>

<style lang="scss" scoped>
.tabs-warp {
  background-color: var(--bg-color);
  padding: 0 10px 10px;
  border-radius: var(--border-radius);

  .tabs {
    margin-bottom: 5px;
  }

  .more {
    text-align: right;
  }
}
</style>
