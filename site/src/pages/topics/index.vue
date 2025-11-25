<template>
  <section class="main">
    <div class="container">
      <sidebar-layout :show-trending-topics="true">
        <div class="topics-wrapper no-padding no-bg">
          <div class="topics-main">
            <load-more-async v-slot="{ results }" url="/api/topic/topics">
              <topic-list :topics="results" show-sticky />
            </load-more-async>
          </div>
        </div>
      </sidebar-layout>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();
useHead({
  title: useSiteTitle(t("pages.topics.title")),
});
</script>

<style scoped></style>
