<template>
  <div class="container">
    <div class="container-header">
      <a-form :model="filters" layout="inline" :size="appStore.table.size">
        <a-form-item>
          <a-input
            v-model="filters.title"
            :placeholder="$t('pages.link.title')"
          />
        </a-form-item>
        <a-form-item>
          <a-input v-model="filters.url" :placeholder="$t('pages.link.url')" />
        </a-form-item>
        <a-form-item>
          <a-select
            v-model="filters.status"
            :placeholder="$t('pages.link.status')"
            allow-clear
            @change="list"
          >
            <a-option :value="0" :label="$t('pages.link.statusNormal')" />
            <a-option :value="1" :label="$t('pages.link.statusDeleted')" />
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="list">
            <template #icon> <icon-search /> </template>
            {{ $t('pages.link.search') }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="action-btns">
        <a-button type="primary" :size="appStore.table.size" @click="showAdd">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('pages.link.add') }}
        </a-button>
      </div>
    </div>

    <div class="container-main">
      <a-table
        :loading="loading"
        :data="data.results"
        :size="appStore.table.size"
        :bordered="appStore.table.bordered"
        :pagination="pagination"
        :sticky-header="true"
        style="height: 100%"
        column-resizable
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column
            :title="$t('pages.link.id')"
            data-index="id"
          ></a-table-column>
          <a-table-column
            :title="$t('pages.link.title')"
            data-index="title"
          ></a-table-column>
          <a-table-column
            :title="$t('pages.link.url')"
            data-index="url"
          ></a-table-column>
          <a-table-column
            :title="$t('pages.link.summary')"
            data-index="summary"
          ></a-table-column>
          <a-table-column :title="$t('pages.link.status')" data-index="status">
            <template #cell="{ record }">
              {{
                record.status === 0
                  ? $t('pages.link.statusNormal')
                  : $t('pages.link.statusDeleted')
              }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pages.link.createTime')"
            data-index="createTime"
          >
            <template #cell="{ record }">
              {{ useFormatDate(record.createTime) }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('pages.link.actions')">
            <template #cell="{ record }">
              <a-button
                type="primary"
                :size="appStore.table.size"
                @click="showEdit(record.id)"
                >{{ $t('pages.link.edit') }}</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>

    <Edit ref="edit" @ok="list" />
  </div>
</template>

<script setup lang="ts">
  import Edit from './components/Edit.vue';

  const appStore = useAppStore();
  const loading = ref(false);
  const edit = ref();
  const filters = reactive({
    limit: 20,
    page: 1,

    title: '',
    url: '',
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
      pageSizeOptions: [20, 50, 100, 200, 300, 500],
    };
  });

  onMounted(() => {
    useTableHeight();
  });

  const list = async () => {
    loading.value = true;
    try {
      const ret = await axios.postForm<any>(
        '/api/admin/link/list',
        jsonToFormData(filters)
      );
      data.page = ret.page;
      data.results = ret.results;
    } finally {
      loading.value = false;
    }
  };

  list();

  const showAdd = () => {
    edit.value.show();
  };

  const showEdit = (id: any) => {
    edit.value.showEdit(id);
  };

  const onPageChange = (page: number) => {
    filters.page = page;
    list();
  };

  const onPageSizeChange = (pageSize: number) => {
    filters.limit = pageSize;
    list();
  };
</script>

<style scoped lang="less"></style>
