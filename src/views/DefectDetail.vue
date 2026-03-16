<template>
  <div class="page-container">
    <van-nav-bar
      title="病害详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <div v-if="defect" class="detail-content">
      <!-- 基本信息 -->
      <div class="card">
        <div class="card-title">基本信息</div>
        <van-descriptions :column="1" bordered>
          <van-descriptions-item label="编号">{{ defect.id }}</van-descriptions-item>
          <van-descriptions-item label="类型">
            <van-tag>{{ defect.type }}</van-tag>
          </van-descriptions-item>
          <van-descriptions-item label="等级">
            <van-tag :type="severityType(defect.severity)">
              {{ severityText(defect.severity) }}
            </van-tag>
          </van-descriptions-item>
          <van-descriptions-item label="状态">
            <van-tag :type="statusType(defect.status)">
              {{ statusText(defect.status) }}
            </van-tag>
          </van-descriptions-item>
        </van-descriptions>
      </div>

      <!-- 位置信息 -->
      <div class="card">
        <div class="card-title">位置信息</div>
        <van-cell-group inset>
          <van-cell title="路线" :value="defect.roadName" />
          <van-cell title="桩号" :value="`K${defect.mileage}`" />
          <van-cell title="面积" :value="`${defect.area} m²`" />
          <van-cell title="长度" :value="`${defect.length} m`" />
          <van-cell title="宽度" :value="`${defect.width} mm`" />
        </van-cell-group>

        <!-- 导航按钮 -->
        <van-button
          type="primary"
          size="large"
          round
          block
          @click="navigateToDefect"
        >
          <van-icon name="location-o" />
          导航到病害位置
        </van-button>
      </div>

      <!-- 描述 -->
      <div class="card" v-if="defect.description">
        <div class="card-title">病害描述</div>
        <div class="card-content">{{ defect.description }}</div>
      </div>

      <!-- 照片 -->
      <div class="card" v-if="defect.images && defect.images.length > 0">
        <div class="card-title">病害照片 ({{ defect.images.length }} 张)</div>
        <van-image-preview :images="defect.images" v-model:show="showPreview">
          <template #index>{{ currentIndex + 1 }} / {{ defect.images.length }}</template>
        </van-image-preview>
        <div class="photo-grid">
          <div
            v-for="(img, idx) in defect.images"
            :key="idx"
            class="photo-item"
            @click="showPreview = true; currentIndex = idx"
          >
            <img :src="img" mode="aspectFill" />
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="card">
        <div class="card-title">时间信息</div>
        <van-cell-group inset>
          <van-cell title="发现时间" :value="formatDate(defect.createdAt)" />
          <van-cell
            v-if="defect.completedAt"
            title="完成时间"
            :value="formatDate(defect.completedAt)"
          />
        </van-cell-group>
      </div>
    </div>

    <van-empty v-else description="未找到病害信息" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showImagePreview } from 'vant'

const route = useRoute()
const store = useAppStore()

const defect = ref(null)
const showPreview = ref(false)
const currentIndex = ref(0)

const severityType = (severity) => {
  const map = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' }
  return map[severity] || 'info'
}

const severityText = (severity) => {
  const map = { low: '低', medium: '中', high: '高', critical: '严重' }
  return map[severity] || severity
}

const statusType = (status) => {
  const map = { pending: 'warning', dispatched: 'primary', completed: 'success' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待处理', dispatched: '已派单', completed: '已完成' }
  return map[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const loadDefect = async () => {
  try {
    const defects = await store.fetchDefects()
    defect.value = defects.find(d => d.id === route.params.id)
  } catch (error) {
    console.error('加载病害详情失败:', error)
  }
}

const navigateToDefect = () => {
  if (!defect.value) return
  
  store.navigateTo(
    defect.value.location.lat,
    defect.value.location.lng,
    defect.value.roadName,
    defect.value.mileage
  )
}

onMounted(() => {
  loadDefect()
})
</script>

<style scoped>
.detail-content {
  padding-bottom: 20px;
}

.card {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.card-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 16px;
}
</style>
