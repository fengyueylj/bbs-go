<template>
  <section class="main">
    <div class="container">
      <div class="publish-form" v-if="postForm">
        <div class="form-title">
          <div class="form-title-name">{{ t('pages.topic.edit.title') }}</div>
        </div>

        <!--
        <div class="topic-tags">
          <div
            v-for="node in nodes"
            :key="node.id"
            class="topic-tag"
            :class="{ selected: postForm.nodeId === node.id }"
            @click="postForm.nodeId = node.id"
          >
            <span>{{ node.name }}</span>
          </div>
        </div>
    -->

        <div class="editor-container">
          <div class="editor-content">
            <input
              v-model="postForm.title"
              class="input topic-title"
              type="text"
              :placeholder="t('pages.topic.edit.titlePlaceholder')"
            />
          </div>
        </div>

        <!-- 地理位置选择 -->
        <MapSelector v-model="location" @confirm="handleLocationConfirm" />

        <div class="editor-container">
          <div class="editor-title">
            <span>{{ postForm.contentType === 'markdown' ? 'Markdown 编辑器' : 'HTML 编辑器' }}</span>
            <div class="editor-switch" @click="switchEditor">
              <div class="editor-type">
                <img v-if="postForm.contentType === 'markdown'" src="~/assets/images/markdown.svg" />
                <img v-else src="~/assets/images/html.svg" />
                <span>{{ postForm.contentType === 'markdown' ? 'Markdown' : 'HTML' }}</span>
              </div>
              <i class="iconfont icon-switch" />
            </div>
          </div>
          <div class="editor-content">
            <markdown-editor
              v-if="postForm.contentType === 'markdown'"
              v-model="postForm.content"
              :placeholder="t('pages.topic.edit.contentPlaceholder')"
            />
            <MEditor
              v-else
              v-model="postForm.content"
              :uploadImage="useUploadImage"
            />
          </div>
        </div>

        <div v-if="isEnableHideContent || postForm.hideContent" class="editor-container">
          <div class="editor-content">
            <MEditor v-model="postForm.hideContent" height="200px" />
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-content">
            <tag-input v-model="postForm.tags" />
          </div>
        </div>

        <div class="form-footer">
          <a
            :class="{ 'is-loading': publishing }"
            class="button is-primary btn-publish"
            @click="submitCreate"
          >
            {{ t('pages.topic.edit.submitBtn') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import MapSelector from "~/components/MapSelector.vue";
const { t } = useI18n();

definePageMeta({
  middleware: "auth",
});

useHead({
  title: useSiteTitle(t('pages.topic.edit.pageTitle')),
});

const route = useRoute();
const configStore = useConfigStore();

const isEnableHideContent = computed(() => {
  return configStore.config.enableHideContent;
});

const { data: nodes } = await useMyFetch("/api/topic/nodes");
const { data: postForm } = await useMyFetch(`/api/topic/edit/${route.params.id}`);
const publishing = ref(false);

// 地理位置数据
const location = ref({
  province: "",
  city: "",
  district: "",
  detail: "",
  roomNumber: "",
  location: {
    lat: 0,
    lng: 0
  }
});

// 处理地理位置确认
function handleLocationConfirm(loc) {
  location.value = loc;
  console.log('地理位置已确认:', loc);
}

// 从postForm加载地理位置数据
watch(() => postForm.value, (newValue) => {
  if (newValue && newValue.location) {
    location.value = {
      province: newValue.location.province || "",
      city: newValue.location.city || "",
      district: newValue.location.district || "",
      detail: newValue.location.detail || "",
      roomNumber: newValue.location.roomNumber || "",
      location: {
        lat: newValue.location.location?.lat || 0,
        lng: newValue.location.location?.lng || 0
      }
    };
  }
}, { immediate: true });

const switchEditor = () => {
  useConfirm(t('pages.topic.edit.switchEditorConfirm'), {
    confirmButtonText: t("component.dialog.ok"),
    cancelButtonText: t("component.dialog.cancel")
  })
    .then(() => {
      postForm.value.content = "";
      if (postForm.value.contentType === "markdown") {
        postForm.value.contentType = "html";
      } else {
        postForm.value.contentType = "markdown";
      }
    })
    .catch(() => {});
};

async function submitCreate() {
  if (publishing.value) {
    return;
  }
  publishing.value = true;

  try {
    useHttpPost(
      `/api/topic/edit/${postForm.value.id}`,
      useJsonToForm({
        nodeId: postForm.value.nodeId,
        title: postForm.value.title,
        content: postForm.value.content,
        hideContent: postForm.value.hideContent,
        tags: postForm.value.tags ? postForm.value.tags.join(",") : "",
        location: location.value,
      })
    );
    useMsg({
      message: t('pages.topic.edit.success'),
      onClose() {
        useLinkTo(`/topic/${postForm.value.id}`);
      },
    });
  } catch (e) {
    publishing.value = false;
    useMsgError(t('pages.topic.edit.failed', { msg: e.message || e }));
  }
}
</script>

<style lang="scss" scoped>
/* 编辑器容器样式 */
.editor-container {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 24px;
  margin-bottom: 24px;
}

/* 编辑器标题样式 */
.editor-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 编辑器切换按钮样式 */
.editor-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.editor-switch:hover {
  background: #ecf5ff;
  border-color: #d9ecff;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
}

.editor-switch .editor-type {
  display: flex;
  align-items: center;
  gap: 6px;
}

.editor-switch .editor-type img {
  width: 16px;
  height: 16px;
}

.editor-switch .editor-type span {
  color: #606266;
  font-weight: 500;
}

.editor-switch .icon-switch {
  font-size: 14px;
  color: #909399;
}

/* 编辑器内容样式 */
.editor-content {
  width: 100%;
}

/* 表单底部按钮样式 */
.form-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}

.btn-publish {
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-publish:hover {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}
</style>