<template>
  <section class="main">
    <div class="container">
      <div class="donate-container">
        <div class="donate-header">
          <h1>{{ t('pages.donate.title') }}</h1>
        </div>
        
        <div class="donate-content">
          <div class="qrcode-section">
            <div class="qrcode-container">
              <img src="~/assets/images/donate.jpg" alt="微信打赏码" class="qrcode-image" />
            </div>
            <div class="qrcode-description">
              <p class="donate-text">感谢您的支持与打赏！</p>
              <p class="donate-thanks">您的打赏将帮助我们持续改进和维护这个社区平台，为大家提供更好的服务。</p>
            </div>
          </div>
          
          <div class="donate-info">
            <h3>{{ t('pages.donate.thanks') }}</h3>
            <p>{{ t('pages.donate.appreciation') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

useHead({
  title: useSiteTitle(t('pages.donate.pageTitle')),
});
</script>

<style lang="scss" scoped>
.donate-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.donate-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
}

.donate-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qrcode-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .qrcode-image {
    width: 300px;
    height: 300px;
    object-fit: contain;
  }
}

.qrcode-description {
  text-align: center;
  
  .donate-text {
    font-size: 18px;
    font-weight: 600;
    color: #e74c3c;
    margin-bottom: 10px;
  }
  
  .donate-thanks {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
  }
}

.donate-info {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
  }
}

@media screen and (max-width: 768px) {
  .donate-container {
    margin: 20px;
    padding: 20px;
  }
  
  .qrcode-container {
    padding: 15px;
    
    .qrcode-image {
      width: 250px;
      height: 250px;
    }
  }
}
</style>