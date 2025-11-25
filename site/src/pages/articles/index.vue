<template>
  <section class="main">
    <div class="container">
      <sidebar-layout :show-trending-articles="true">
        <div class="articles-main">
          <load-more-async v-slot="{ results }" url="/api/article/articles">
            <article-list :articles="results" />
          </load-more-async>
        </div>

        <template #right-sidebar>
          <check-in />
          <trending-articles class="sidebar-spacing" />
          <site-notice class="sidebar-spacing" />
          <score-rank class="sidebar-spacing" />
          <friend-links class="sidebar-spacing" />
        </template>
      </sidebar-layout>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();
useHead({
  title: useSiteTitle(t("pages.articles.title")),
  meta: [
    {
      hid: "description",
      name: "description",
      content: useSiteDescription(),
    },
    { hid: "keywords", name: "keywords", content: useSiteKeywords() },
  ],
});
</script>

<style lang="scss" scoped>
.articles-main {
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
}

.sidebar-spacing {
  margin-top: 10px;
}
</style>
