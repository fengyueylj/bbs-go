<template>
  <div class="ad-container">
    <button class="ad-close" @click="closeAd">
      <i class="iconfont icon-close"></i>
    </button>
    <h3 class="ad-title">发现更多精彩内容</h3>
    <p class="ad-text">加入我们的社区，分享你的想法和经验</p>
    <button class="ad-btn" @click="handleAdClick">立即探索</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['close-ad']);

const closeAd = () => {
  emit('close-ad');
};

const handleAdClick = () => {
  // 可以添加广告点击逻辑
  console.log('Ad clicked');
};
</script>

<style lang="scss" scoped>
.ad-container {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 10s linear infinite;
  }
}

.ad-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  i {
    font-size: 12px;
  }
}

.ad-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.ad-text {
  margin-bottom: 1rem;
  opacity: 0.95;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.ad-btn {
  background-color: white;
  color: #6a11cb;
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
