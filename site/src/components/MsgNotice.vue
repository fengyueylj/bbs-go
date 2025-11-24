<template>
  <div class="navbar-item dropdown is-hoverable is-right msg-notice">
    <div class="dropdown-trigger">
      <nuxt-link
        :class="{ 'msg-flicker': msgcount > 0 }"
        to="/user/messages"
        class="msgicon"
        :title="$t('common.message')"
      >
        <i class="iconfont icon-message"></i>
        <span>{{ $t("common.message") }}</span>
        <sup v-if="msgcount > 0">{{ msgcount > 9 ? "9+" : msgcount }}</sup>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const { data } = await useMyFetch("/api/user/msg_recent");
const msgcount = ref(data.value?.count || 0);
// const messages = ref(data.value?.messages || []);
</script>

<style lang="scss" scoped>
.msg-notice {
  .msgicon {
    font-size: 15px;
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    transition: all 0.3s ease;

    display: flex;
    align-items: center;
    column-gap: 6px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    sup {
      background-color: #ff4444;
      color: white;
      padding: 0.1rem 0.4rem;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }
  }

  // 闪烁
  .msg-flicker {
    animation: msgnotice 1s infinite;
  }

  @keyframes msgnotice {
    50% {
      background-color: rgba(255, 68, 68, 0.2);
    }
  }
}
</style>
