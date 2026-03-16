<template>
  <div class="page-container">
    <h1 class="page-title">我的任务</h1>

    <!-- 筛选 -->
    <van-tabs v-model:active="activeTab" @change="filterWorkOrders">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="pending" />
      <van-tab title="进行中" name="in_progress" />
      <van-tab title="已完成" name="completed" />
    </van-tabs>

    <!-- 列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadWorkOrders"
    >
      <div
        v-for="wo in workOrderList"
        :key="wo.id"
        class="card workorder-card"
        @click="goToDetail(wo.id)"
      >
        <div class="wo-header">
          <div class="wo-id">{{ wo.id }}</div>
          <van-tag :type="priorityType(wo.priority)">
            {{ priorityText(wo.priority) }}
          </van-tag>
        </div>

        <div class="wo-route">
          <van-icon name="location-o" />
          <span>{{ wo.roadName }} K{{ wo.startMileage }}-K{{ wo.endMileage }}</span>
        </div>

        <div class="wo-info">
          <span>病害数：{{ wo.defectIds?.length || 0 }} 个</span>
          <span>面积：{{ wo.totalArea }} m²</span>
        </div>

        <div class="wo-footer">
          <van-tag :type="statusType(wo.status)">
            {{ statusText(wo.status) }}
          </van-tag>
          <span class="wo-time">{{ formatDate(wo.createdAt) }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="wo-actions" v-if="wo.status === 'pending' || wo.status === 'dispatched'">
          <van-button
            type="primary"
            size="small"
            block
            @click.stop="acceptWorkOrder(wo)"
          >
            接收任务
          </van-button>
        </div>
        <div class="wo-actions" v-else-if="wo.status === 'in_progress'">
          <van-button
            type="success"
            size="small"
            block
            @click.stop="completeWorkOrder(wo)"
          >
            完成任务
          </van-button>
        </div>
      </div>
    </van-list>

    <van-empty v-if="!loading && workOrderList.length === 0" description="暂无任务数据" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showDialog, showToast, showFailToast } from 'vant'

const router = useRouter()
const store = useAppStore()

const activeTab = ref('all')
const loading = ref(false)
const finished = ref(false)
const workOrderList = ref([])

const priorityType = (priority) => {
  const map = { low: 'info', medium: 'warning', high: 'danger' }
  return map[priority] || 'info'
}

const priorityText = (priority) => {
  const map = { low: '低', medium: '中', high: '高' }
  return map[priority] || priority
}

const statusType = (status) => {
  const map = { pending: 'warning', in_progress: 'primary', completed: 'success' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待处理', in_progress: '进行中', completed: '已完成' }
  return map[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadWorkOrders = async () => {
  try {
    const data = await store.fetchWorkOrders()
    // 只显示当前用户的任务
    workOrderList.value = data.filter(wo => 
      wo.assignee === store.user?.realName || !wo.assignee
    )
    finished.value = true
  } catch (error) {
    console.error('加载任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

const filterWorkOrders = () => {
  workOrderList.value = []
  finished.value = false
  loadWorkOrders()
}

const acceptWorkOrder = async (wo) => {
  try {
    await showDialog({
      title: '接收任务',
      message: '确定接收此任务？',
      confirmButtonText: '接收',
      cancelButtonText: '取消'
    })
    await store.updateWorkOrder(wo.id, { status: 'in_progress' })
    showToast('任务已接收')
    loadWorkOrders()
  } catch (error) {
    if (error.message !== 'cancel') {
      showFailToast('接收失败')
    }
  }
}

const completeWorkOrder = async (wo) => {
  try {
    await showDialog({
      title: '完成任务',
      message: '确定完成任务？请确保所有病害已修复并拍照上传。',
      confirmButtonText: '完成',
      cancelButtonText: '取消'
    })
    await store.updateWorkOrder(wo.id, { status: 'completed' })
    showToast('任务已完成')
    loadWorkOrders()
  } catch (error) {
    if (error.message !== 'cancel') {
      showFailToast('完成失败')
    }
  }
}

const goToDetail = (id) => {
  router.push(`/workorder/${id}`)
}

loadWorkOrders()
</script>

<style scoped>
.workorder-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.workorder-card:active {
  transform: scale(0.98);
}

.wo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.wo-id {
  font-size: 14px;
  color: #999;
  font-family: monospace;
}

.wo-route {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.wo-route .van-icon {
  color: #667eea;
}

.wo-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.wo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.wo-time {
  font-size: 12px;
  color: #999;
}

.wo-actions {
  margin-top: 16px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>
