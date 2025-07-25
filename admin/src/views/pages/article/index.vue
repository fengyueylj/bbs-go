<template>
  <div class="container">
    <div class="container-header">
      <a-form :model="filters" layout="inline" :size="appStore.table.size">
        <a-form-item>
          <a-input v-model="filters.id" :placeholder="$t('pages.article.id')" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="filters.userId"
            :placeholder="$t('pages.article.userId')"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="filters.title"
            :placeholder="$t('pages.article.title')"
          />
        </a-form-item>
        <a-form-item>
          <a-select
            v-model="filters.status"
            :placeholder="$t('pages.article.status')"
            allow-clear
            @change="list"
          >
            <a-option :value="0" :label="$t('pages.article.statusNormal')" />
            <a-option :value="1" :label="$t('pages.article.statusDeleted')" />
            <a-option :value="2" :label="$t('pages.article.statusPending')" />
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="filters.title"
            :placeholder="$t('pages.article.title')"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="list">
            <template #icon> <icon-search /> </template>
            {{ $t('pages.article.search') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="container-main">
      <div v-if="data && data.results">
        <article-list :results="data.results" @change="list" />
        <div style="margin-top: 10px; display: flex; justify-content: flex-end">
          <a-pagination
            :total="pagination.total"
            :current="pagination.current"
            :page-size="pagination.pageSize"
            :show-total="pagination.showTotal"
            :show-jumper="pagination.showJumper"
            :show-page-size="pagination.showPageSize"
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </div>
      </div>
      <a-empty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArticleList from './components/ArticleList.vue';

  const appStore = useAppStore();
  const loading = ref(false);
  const filters = reactive({
    limit: 20,
    page: 1,

    id: undefined,
    userId: undefined,
    title: undefined,
    status: 0,
  });

  const data = reactive({
    page: {
      page: 1,
      limit: 20,
      total: 0,
    },
    results: [],
  });

  const pagination = computed(() => {
    return {
      total: data.page.total,
      current: data.page.page,
      pageSize: data.page.limit,
      showTotal: true,
      showJumper: true,
      showPageSize: true,
    };
  });

  const list = async () => {
    loading.value = true;
    try {
      const ret = await axios.postForm<any>(
        '/api/admin/article/list',
        jsonToFormData(filters)
      );
      data.page = ret.page;
      data.results = ret.results;
    } finally {
      loading.value = false;
    }
  };

  list();

  const onPageChange = (page: number) => {
    filters.page = page;
    list();
  };

  const onPageSizeChange = (pageSize: number) => {
    filters.limit = pageSize;
    list();
  };
</script>

<style lang="less" scoped></style>
