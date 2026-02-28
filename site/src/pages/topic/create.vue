<template>
  <section class="main">
    <div class="container">
      <article v-if="isNeedEmailVerify" class="message is-warning">
        <div class="message-header">
          <p>{{ $t("pages.topic.create.needEmailTitle") }}</p>
        </div>
        <div class="message-body">
          {{ $t("pages.topic.create.needEmailBody") }}
          <strong>
            <nuxt-link
              to="/user/profile/account"
              style="color: var(--text-link-color)"
              >{{ $t("pages.topic.create.goVerify") }}</nuxt-link
            ></strong
          >
        </div>
      </article>
      <div v-else class="publish-form">
        <div class="form-title">
          <div class="form-title-name">
            {{ 
              postForm.type === 0
                ? $t("pages.topic.create.post")
                : $t("pages.topic.create.tweet")
            }}
          </div>
        </div>

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

        <div v-if="postForm.type === 0" class="editor-container">
          <div class="editor-content">
            <input
              v-model="postForm.title"
              class="input topic-title"
              type="text"
              :placeholder="$t('pages.topic.create.titlePlaceholder')"
            />
          </div>
        </div>

        <div v-if="postForm.type === 0">
          <!-- 地理位置选择 -->
          <MapSelector v-model="postForm.location" @confirm="handleLocationConfirm" />
        </div>

        <div v-if="postForm.type === 0" class="editor-container">
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
              :placeholder="$t('pages.topic.create.contentPlaceholder')"
            />
            <MEditor
              v-else
              v-model="postForm.content"
              :uploadImage="useUploadImage"
            />
          </div>
        </div>

        <div v-if="postForm.type === 0 && isEnableHideContent" class="editor-container">
          <div class="editor-content">
            <MEditor v-model="postForm.hideContent" height="200px" />
          </div>
        </div>

        <div v-if="postForm.type === 1" class="editor-container">
          <div class="editor-content">
            <simple-editor
              ref="simpleEditorComponent"
              :placeholder="$t('pages.topic.create.contentPlaceholder')"
              v-model:content="postForm.content"
              v-model:imageList="postForm.imageList"
            />
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-content">
            <tag-input v-model="postForm.tags" />
          </div>
        </div>

        <div class="form-footer">
          <a :class="{ 'is-loading': publishing }"
            class="button is-primary btn-publish"
            @click="publish">
            {{postForm.type === 1 ? $t("pages.topic.create.tweetBtn") : $t("pages.topic.create.postBtn")}}
          </a>
        </div>
      </div>
    </div>

    <CaptchaDialog ref="captchaDialog" />
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import MapSelector from "~/components/MapSelector.vue";

definePageMeta({
  middleware: "auth",
});

const userStore = useUserStore();
const configStore = useConfigStore();
const route = useRoute();
const router = useRouter();

const type = Number.parseInt(route.query.type) || 0;
const nodeId =
  parseInt(route.query.nodeId) || configStore.config.defaultNodeId || 0;

if (type === 1 && !configStore.config.modules.tweet) {
  showError("😱 Tweet module is not enabled");
}
if (type === 0 && !configStore.config.modules.topic) {
  showError("😱 Topic module is not enabled");
}

const postForm = ref({
  type: type,
  nodeId: nodeId,
  title: "",
  tags: [],
  contentType: "html",
  content: "",
  hideContent: "",
  imageList: [],
  
  // 地理位置信息
  location: {
    province: "",
    city: "",
    district: "",
    detail: "",
    roomNumber: "",
    location: {
      lat: 0,
      lng: 0
    }
  },

  captchaId: "",
  captchaCode: "",
  captchaProtocol: 2,
});

const publishing = ref(false);
const simpleEditorComponent = ref(null);
const captchaDialog = ref(null);

const { t } = useI18n();

const isNeedEmailVerify = computed(() => {
  return (
    configStore.config.createTopicEmailVerified && !userStore.user.emailVerified
  );
});

const isEnableHideContent = computed(() => {
  return configStore.config.enableHideContent;
});

const topicCaptchaEnabled = computed(() => {
  return configStore.config.topicCaptcha;
});

const { data: nodes } = await useMyFetch("/api/topic/nodes");

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    init();
  },
  { deep: true }
);

const init = () => {
  postForm.value.type = Number.parseInt(route.query.type) || 0;

  let contentType = route.query.contentType;
  if (!contentType) {
    contentType = "html";
  }
  postForm.value.contentType = contentType;

  useHead({
    title: useSiteTitle(
      type === 0 ? t("pages.topic.create.post") : t("pages.topic.create.tweet")
    ),
  });
};

init();

const switchEditor = () => {
  useConfirm(t("pages.topic.create.switchEditorConfirm"), {
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
    .catch(() => {}); // 空的错误处理函数
};

const publish = () => {
  if (publishing.value) {
    return;
  }

  if (topicCaptchaEnabled.value) {
    captchaDialog.value.show().then((captcha) => {
      publishSubmit(captcha);
    });
  } else {
    publishSubmit();
  }
};

// 处理地理位置确认
function handleLocationConfirm(location) {
  postForm.value.location = location;
  console.log('地理位置已确认:', location);
}

const publishSubmit = async (captcha) => {
  if (publishing.value) {
    return;
  }

  if (postForm.value.type === 1) {
    if (simpleEditorComponent.value.loading) {
      useMsgWarning(t("pages.topic.create.imageUploading"));
      return;
    }
  }

  if (captcha) {
    postForm.value.captchaId = captcha.captchaId;
    postForm.value.captchaCode = captcha.captchaCode;
    postForm.value.captchaProtocol = 2;
  }

  publishing.value = true;
  try {
    const topic = await useHttpPost("/api/topic/create", postForm.value);
    router.push(`/topic/${topic.id}`);
  } catch (e) {
    useMsgError(e.message || e);
    publishing.value = false;
  }
};
</script>

<style scoped>
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
  transition: transform 0.3s ease;
}

.editor-switch:hover .icon-switch {
  color: #409eff;
  transform: rotate(180deg);
}

/* 编辑器内容样式 */
.editor-content {
  width: 100%;
}

/* 标题输入框样式 */
.topic-title {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.topic-title:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.topic-title::placeholder {
  color: #909399;
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .editor-title {
    font-size: 15px;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
}
</style>