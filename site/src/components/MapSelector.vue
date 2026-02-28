<template>
  <div class="map-selector">
    <!-- 地图标题 -->
    <div class="map-title">
      地理位置选择
    </div>
    
    <!-- 地址搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入地址、小区名称等"
        clearable
        @keyup.enter="handleSearch"
        @clear="clearSearch"
        :loading="searchLoading"
      >
        <template #append>
          <el-button @click="handleSearch" :loading="searchLoading">
            <i class="iconfont icon-search"></i>
          </el-button>
        </template>
      </el-input>
      
      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div
          v-for="(result, index) in searchResults"
          :key="index"
          class="search-result-item"
          @click="selectSearchResult(result)"
        >
          <i class="iconfont icon-nav"></i>
          <div class="result-info">
            <div class="result-name">{{ result.name }}</div>
            <div class="result-address">{{ result.address }}</div>
            <div class="result-type" v-if="result.type">{{ result.type }}</div>
          </div>
        </div>
      </div>
      
      <!-- 搜索无结果 -->
      <div v-else-if="searchKeyword && !searchLoading && !resultSelected" class="search-no-result">
        未找到相关地址，请尝试其他关键词
      </div>
    </div>
    
    <!-- 地址输入框 -->
    <div class="address-inputs">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="省">
            <el-input v-model="address.province" placeholder="请输入省份" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="市">
            <el-input v-model="address.city" placeholder="请输入城市" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区/县">
            <el-input v-model="address.district" placeholder="请输入区县" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址">
            <el-input v-model="address.detail" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    
    <!-- 地图容器 -->
    <div class="map-container-wrapper">
      <!-- 地图容器元素（始终存在） -->
      <div ref="mapContainer" class="map-container"></div>
      
      <!-- 地图加载中 -->
      <div v-if="mapLoading" class="map-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>地图加载中...</span>
      </div>
      
      <!-- 地图加载失败 -->
      <div v-else-if="mapError" class="map-error">
        <el-icon><Warning /></el-icon>
        <span>地图加载失败，请检查网络连接或API密钥是否正确</span>
        <el-button type="primary" size="small" @click="initMap">重新加载</el-button>
      </div>
      
      <!-- 地图未初始化 -->
      <div v-else-if="!map" class="map-not-initialized">
        <el-icon><InfoFilled /></el-icon>
        <span>地图初始化中，请稍候...</span>
      </div>
    </div>
    
    <!-- 地图控制按钮 -->
    <div class="map-controls">
      <el-button type="primary" @click="confirmSelection" :disabled="!isValidAddress">
        确认选择
      </el-button>
      <el-button @click="resetSelection">
        重置
      </el-button>
    </div>
    
    <!-- 提示信息 -->
    <div class="map-tips">
      <el-alert
        title="使用提示"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul>
            <li>1. 在搜索框中输入地址或小区名称进行搜索</li>
            <li>2. 点击搜索结果或在地图上直接点击选择位置</li>
            <li>3. 系统会自动填充省市县区等地址信息</li>
            <li>4. 确认无误后点击"确认选择"按钮</li>
            <li>5. 您可以拖动地图上的标记来调整位置</li>
          </ul>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Loading, Warning, InfoFilled } from '@element-plus/icons-vue';

// 搜索防抖定时器
let searchTimer = null;

// AMapLoader 实例（客户端动态加载）
let AMapLoader = null;

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      province: '',
      city: '',
      district: '',
      detail: '',
      location: {
        lat: 0,
        lng: 0
      }
    })
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// 地图实例
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);

// 状态管理
const mapLoading = ref(true);
const mapError = ref(false);
const searchLoading = ref(false);
const resultSelected = ref(false);

// 地址数据
const address = ref({
  province: props.modelValue.province || '',
  city: props.modelValue.city || '',
  district: props.modelValue.district || '',
  detail: props.modelValue.detail || '',
  location: props.modelValue.location || { lat: 0, lng: 0 }
});

// 搜索相关
const searchKeyword = ref('');
const searchResults = ref([]);
const placeSearch = ref(null);
const geocoder = ref(null);

// 计算属性
const isValidAddress = computed(() => {
  return address.value.location.lat !== 0 && address.value.location.lng !== 0 && 
         (address.value.province || address.value.city || address.value.district || address.value.detail);
});

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    address.value = {
      province: newValue.province || '',
      city: newValue.city || '',
      district: newValue.district || '',
      detail: newValue.detail || '',
      location: newValue.location || { lat: 0, lng: 0 }
    };
  }
}, { deep: true });

// 初始化地图
function initMap() {
  mapLoading.value = true;
  mapError.value = false;

  try {
    // 检查mapContainer是否存在
    if (!mapContainer.value) {
      console.error('地图容器不存在');
      mapLoading.value = false;
      mapError.value = true;
      return;
    }

    // 使用 AMapLoader 加载地图
    AMapLoader.load({
      key: "99d4a2c9bf7a8af7d7c3074aef81c743",
      version: "2.0",
      plugins: ['AMap.ToolBar', 'AMap.AutoComplete', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Geocoder']
    }).then((AMap) => {
      try {
        // 初始化地图实例
        map.value = new AMap.Map(mapContainer.value, {
          zoom: 13,
          center: [116.397428, 39.90923],
          resizeEnable: true,
          zoomEnable: true,
          dragEnable: true,
          doubleClickZoom: true,
          keyboardEnable: true
        });

        // 添加地图控件
        try {
          const toolbar = new AMap.ToolBar();
          map.value.addControl(toolbar);

          const scale = new AMap.Scale();
          map.value.addControl(scale);
        } catch (controlError) {
          console.warn('添加地图控件失败:', controlError);
        }

        // 初始化搜索服务（不绑定 map 和 panel，手动处理结果）
        placeSearch.value = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: '全国'
        });

        // 初始化地理编码服务
        geocoder.value = new AMap.Geocoder({
          city: '全国',
          radius: 1000
        });

        // 添加地图点击事件
        map.value.on('click', handleMapClick);

        // 如果有初始位置，显示标记
        if (address.value.location.lat && address.value.location.lng) {
          setMarker([address.value.location.lng, address.value.location.lat]);
          map.value.setCenter([address.value.location.lng, address.value.location.lat]);
          map.value.setZoom(15);
        }

        mapLoading.value = false;
      } catch (error) {
        console.error('地图初始化失败:', error);
        mapLoading.value = false;
        mapError.value = true;
      }
    });
  } catch (error) {
    console.error('地图初始化失败:', error);
    mapLoading.value = false;
    mapError.value = true;
  }
}

// 初始化地图
onMounted(async () => {
  // 客户端动态导入 AMapLoader
  if (process.client) {
    const module = await import('@amap/amap-jsapi-loader');
    AMapLoader = module.default || module;
  }

  // 延迟初始化，确保DOM已经渲染
  setTimeout(() => {
    initMap();
  }, 100);
});

// 地图点击事件处理
function handleMapClick(e) {
  const lnglat = e.lnglat;
  setMarker([lnglat.getLng(), lnglat.getLat()]);
  
  // 反向地理编码，获取地址信息
  geocoder.value.getAddress(lnglat, function(status, result) {
    if (status === 'complete' && result.regeocode) {
      const addressComponent = result.regeocode.addressComponent;
      address.value = {
        province: addressComponent.province || '',
        city: addressComponent.city || '',
        district: addressComponent.district || '',
        detail: result.regeocode.formattedAddress || '',
        location: {
          lat: lnglat.getLat(),
          lng: lnglat.getLng()
        }
      };
      emit('update:modelValue', address.value);
    }
  });
}

// 设置标记
function setMarker(lnglat) {
  if (marker.value) {
    marker.value.setPosition(lnglat);
  } else {
    marker.value = new AMap.Marker({
      position: lnglat,
      map: map.value,
      draggable: true
    });
    
    // 标记拖拽结束事件
    marker.value.on('dragend', function(e) {
      const lnglat = e.lnglat;
      address.value.location = {
        lat: lnglat.getLat(),
        lng: lnglat.getLng()
      };
      
      // 反向地理编码
      geocoder.value.getAddress(lnglat, function(status, result) {
        if (status === 'complete' && result.regeocode) {
          const addressComponent = result.regeocode.addressComponent;
          address.value = {
            province: addressComponent.province || '',
            city: addressComponent.city || '',
            district: addressComponent.district || '',
            detail: result.regeocode.formattedAddress || '',
            location: {
              lat: lnglat.getLat(),
              lng: lnglat.getLng()
            }
          };
          emit('update:modelValue', address.value);
        }
      });
    });
  }
}

// 地址搜索
function handleSearch() {
  if (!searchKeyword.value || searchKeyword.value.trim() === '') return;

  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchLoading.value = true;
  searchResults.value = [];
  resultSelected.value = false;

  // 检查placeSearch是否初始化
  if (!placeSearch.value) {
    console.error('搜索服务未初始化，请等待地图加载完成');
    searchLoading.value = false;
    return;
  }

  // 使用防抖延迟搜索
  searchTimer = setTimeout(() => {
    try {
      const keyword = searchKeyword.value.trim();

      placeSearch.value.search(keyword, function(status, result) {
        searchLoading.value = false;

        if (status === 'complete' && result.info === 'OK' && result.poiList && result.poiList.pois) {
          const pois = result.poiList.pois;
          searchResults.value = pois.map(item => ({
            name: item.name,
            address: item.address || '',
            location: {
              lat: item.location ? item.location.lat : 0,
              lng: item.location ? item.location.lng : 0
            },
            type: item.type || '',
            tel: item.tel || '',
            distance: item.distance || ''
          }));
        } else if (status === 'complete' && result.info === 'NO_DATA') {
          // 没有搜索到结果
          searchResults.value = [];
        } else if (status === 'error') {
          console.error('搜索失败:', result);
          searchResults.value = [];
        } else {
          searchResults.value = [];
        }
      });
    } catch (error) {
      console.error('搜索失败:', error);
      searchLoading.value = false;
      searchResults.value = [];
    }
  }, 300); // 300ms 防抖延迟
}

// 清除搜索
function clearSearch() {
  searchResults.value = [];
  resultSelected.value = false;
}

// 选择搜索结果
function selectSearchResult(result) {
  const lnglat = [result.location.lng, result.location.lat];
  setMarker(lnglat);
  map.value.setCenter(lnglat);
  
  // 反向地理编码，获取详细地址
  geocoder.value.getAddress(lnglat, function(status, geoResult) {
    if (status === 'complete' && geoResult.regeocode) {
      const addressComponent = geoResult.regeocode.addressComponent;
      address.value = {
        province: addressComponent.province || '',
        city: addressComponent.city || '',
        district: addressComponent.district || '',
        detail: result.address || '',
        location: result.location
      };
      emit('update:modelValue', address.value);
    }
  });
  
  searchResults.value = [];
  searchKeyword.value = result.name;
  resultSelected.value = true;
}

// 确认选择
function confirmSelection() {
  emit('confirm', address.value);
}

// 重置选择
function resetSelection() {
  address.value = {
    province: '',
    city: '',
    district: '',
    detail: '',
    location: { lat: 0, lng: 0 }
  };
  
  if (marker.value) {
    marker.value.setMap(null);
    marker.value = null;
  }
  
  map.value.setCenter([116.397428, 39.90923]);
  map.value.setZoom(13);
  
  emit('update:modelValue', address.value);
}
</script>

<style scoped>
.map-selector {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 24px;
  margin-bottom: 24px;
}

/* 标题样式 */
.map-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

/* 搜索区域 */
.search-section {
  position: relative;
  margin-bottom: 24px;
}

.search-section .el-input {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.search-section .el-input__wrapper {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-section .el-input__wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  border-color: #409eff;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 8px;
}

.search-result-item {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f5f7fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f0f9ff;
  color: #409eff;
}

.search-result-item i {
  font-size: 18px;
  color: #409eff;
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-address {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 搜索无结果 */
.search-no-result {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  text-align: center;
  color: #909399;
  margin-top: 8px;
}

/* 搜索提示 */
.search-tip {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  z-index: 1000;
  padding: 16px;
  text-align: center;
  color: #909399;
  font-size: 13px;
  margin-top: 8px;
}

/* 搜索结果类型 */
.result-type {
  font-size: 11px;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 4px;
}

/* 地图未初始化 */
.map-not-initialized {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.map-not-initialized .el-icon {
  font-size: 32px;
  color: #409eff;
}

.map-not-initialized span {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

/* 地址输入框区域 */
.address-inputs {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.address-inputs .el-row {
  margin-bottom: 0;
}

.address-inputs .el-form-item {
  margin-bottom: 0;
}

.address-inputs .el-form-item__label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  padding-right: 8px;
  width: auto;
  flex: none;
}

.address-inputs .el-form-item__content {
  flex: 1;
}

.address-inputs .el-input {
  width: 100%;
}

.address-inputs .el-input__wrapper {
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 地图容器包装器 */
.map-container-wrapper {
  position: relative;
  width: 100%;
  height: 450px;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.map-container {
  width: 100%;
  height: 100%;
}

/* 地图加载中 */
.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.map-loading .is-loading {
  font-size: 40px;
  color: #409eff;
  animation: rotate 1s linear infinite;
}

.map-loading span {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 地图加载失败 */
.map-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 10;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(2px);
}

.map-error .el-icon {
  font-size: 48px;
  color: #f56c6c;
}

.map-error span {
  color: #606266;
  line-height: 1.6;
  font-size: 16px;
  max-width: 400px;
}

.map-error .el-button {
  margin-top: 8px;
}

/* 地图控制按钮 */
.map-controls {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 0;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.map-controls .el-button {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.map-controls .el-button--primary {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.map-controls .el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}

.map-controls .el-button--default {
  background: white;
  border: 1px solid #dcdfe6;
  color: #606266;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.map-controls .el-button--default:hover {
  border-color: #409eff;
  color: #409eff;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
}

/* 提示信息 */
.map-tips {
  margin-top: 20px;
  background: #ecf5ff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #d9ecff;
}

.map-tips .el-alert {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}

.map-tips .el-alert__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.map-tips ul {
  margin: 12px 0 0 0;
  padding-left: 20px;
}

.map-tips li {
  margin-bottom: 6px;
  color: #606266;
  line-height: 1.5;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-selector {
    padding: 20px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .map-title {
    font-size: 15px;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
  
  .search-section {
    margin-bottom: 20px;
  }
  
  .address-inputs {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .el-row {
    flex-direction: column;
  }
  
  .el-col {
    width: 100% !important;
    margin-bottom: 12px;
  }
  
  .address-inputs .el-form-item {
    margin-bottom: 0;
  }
  
  .map-container-wrapper {
    height: 350px;
    margin-bottom: 20px;
    border-radius: 6px;
  }
  
  .map-loading,
  .map-error {
    padding: 20px;
  }
  
  .map-loading .is-loading,
  .map-error .el-icon {
    font-size: 32px;
  }
  
  .map-controls {
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
  }
  
  .map-controls .el-button {
    width: 100%;
    padding: 12px;
  }
  
  .map-tips {
    margin-top: 16px;
    padding: 12px;
  }
  
  .map-tips li {
    margin-bottom: 4px;
    font-size: 12px;
  }
}

/* 滚动条样式 */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>