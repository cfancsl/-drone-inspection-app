<template>
  <div class="page-container">
    <h1 class="page-title">病害列表</h1>

    <!-- 筛选 -->
    <van-tabs v-model:active="activeTab" @change="filterDefects">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="pending" />
      <van-tab title="已派单" name="dispatched" />
      <van-tab title="已完成" name="completed" />
    </van-tabs>

    <!-- 列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadDefects"
    >
      <div
        v-for="defect in defectList"
        :key="defect.id"
        class="card defect-card"
        @click="goToDetail(defect.id)"
      >
        <div class="defect-header">
          <div class="defect-id">{{ defect.id }}</div>
          <van-tag :type="severityType(defect.severity)" size="medium">
            {{ severityText(defect.severity) }}
          </van-tag>
        </div>

        <div class="defect-type">{{ defect.type }}</div>

        <div class="defect-info">
          <van-icon name="location-o" />
          <span>{{ defect.roadName }} K{{ defect.mileage }}</span>
        </div>

        <div class="defect-info">
          <van-icon name="records" />
          <span>面积：{{ defect.area }} m²</span>
        </div>

        <div class="defect-footer">
          <van-tag :type="statusType(defect.status)">
            {{ statusText(defect.status) }}
          </van-tag>
          <span class="defect-time">{{ formatDate(defect.createdAt) }}</span>
        </div>
      </div>
    </van-list>

    <!-- 空状态 -->
    <van-empty v-if="!loading && defectList.length === 0" description="暂无病害数据" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const store = useAppStore()

const activeTab = ref('all')
const loading = ref(false)
const finished = ref(false)
const defectList = ref([])

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
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadDefects = async () => {
  try {
    const params = activeTab.value === 'all' ? {} : { status: activeTab.value }
    const data = await store.fetchDefects(params)
    defectList.value = data
    finished.value = true
  } catch (error) {
    console.error('加载病害列表失败:', error)
  } finally {
    loading.value = false
  }
}

const filterDefects = () => {
  defectList.value = []
  finished.value = false
  loadDefects()
}

const goToDetail = (id) => {
  router.push(`/defect/${id}`)
}

// 初始化加载
loadDefects()
</script>

<style scoped>
.defect-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.defect-card:active {
  transform: scale(0.98);
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.defect-id {
  font-size: 14px;
  color: #999;
  font-family: monospace;
}

.defect-type {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.defect-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.defect-info .van-icon {
  color: #667eea;
}

.defect-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.defect-time {
  font-size: 12px;
  color: #999;
}
</style>
