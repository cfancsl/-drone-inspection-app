<template>
  <div class="page-container">
    <van-nav-bar
      title="任务单详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <div v-if="workOrder" class="detail-content">
      <!-- 基本信息 -->
      <div class="card">
        <div class="card-title">任务信息</div>
        <van-descriptions :column="1" bordered>
          <van-descriptions-item label="任务单号">{{ workOrder.id }}</van-descriptions-item>
          <van-descriptions-item label="状态">
            <van-tag :type="statusType(workOrder.status)">
              {{ statusText(workOrder.status) }}
            </van-tag>
          </van-descriptions-item>
          <van-descriptions-item label="优先级">
            <van-tag :type="priorityType(workOrder.priority)">
              {{ priorityText(workOrder.priority) }}
            </van-tag>
          </van-descriptions-item>
          <van-descriptions-item label="处理人">{{ workOrder.assignee }}</van-descriptions-item>
        </van-descriptions>
      </div>

      <!-- 路线信息 -->
      <div class="card">
        <div class="card-title">巡检路线</div>
        <van-cell-group inset>
          <van-cell title="路线" :value="workOrder.roadName" />
          <van-cell title="桩号范围" :value="`K${workOrder.startMileage} - K${workOrder.endMileage}`" />
          <van-cell title="总面积" :value="`${workOrder.totalArea} m²`" />
        </van-cell-group>
      </div>

      <!-- 关联病害 -->
      <div class="card">
        <div class="card-title">
          关联病害 ({{ workOrder.defectIds?.length || 0 }} 个)
        </div>
        <div
          v-for="defectId in workOrder.defectIds"
          :key="defectId"
          class="defect-item"
          @click="goToDefect(defectId)"
        >
          <van-icon name="warning-o" color="#ff976a" />
          <span>{{ defectId }}</span>
          <van-icon name="arrow" />
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="card">
        <div class="card-title">时间信息</div>
        <van-cell-group inset>
          <van-cell title="创建时间" :value="formatDate(workOrder.createdAt)" />
          <van-cell title="截止时间" :value="formatDate(workOrder.dueDate)" />
          <van-cell
            v-if="workOrder.completedAt"
            title="完成时间"
            :value="formatDate(workOrder.completedAt)"
          />
        </van-cell-group>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
          v-if="workOrder.status === 'pending' || workOrder.status === 'dispatched'"
          type="primary"
          size="large"
          round
          block
          @click="acceptWorkOrder"
        >
          接收任务
        </van-button>

        <van-button
          v-if="workOrder.status === 'in_progress'"
          type="success"
          size="large"
          round
          block
          @click="showUploadDialog = true"
        >
          <van-icon name="photograph" />
          拍照上传并完成任务
        </van-button>

        <van-button
          v-if="workOrder.status === 'completed'"
          type="info"
          size="large"
          round
          block
          disabled
        >
          已完成
        </van-button>
      </div>
    </div>

    <van-empty v-else description="未找到任务单信息" />

    <!-- 拍照上传对话框 -->
    <van-dialog
      v-model:show="showUploadDialog"
      title="拍照上传"
      show-cancel-button
      @confirm="uploadAndComplete"
    >
      <van-uploader v-model="fileList" :max-count="9" multiple />
      <van-field
        v-model="repairDescription"
        rows="3"
        autosize
        label="修复说明"
        type="textarea"
        placeholder="请输入修复情况说明"
      />
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showToast, showFailToast, showImagePreview } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const workOrder = ref(null)
const showUploadDialog = ref(false)
const fileList = ref([])
const repairDescription = ref('')

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
  return new Date(date).toLocaleString('zh-CN')
}

const loadWorkOrder = async () => {
  try {
    const workOrders = await store.fetchWorkOrders()
    workOrder.value = workOrders.find(w => w.id === route.params.id)
  } catch (error) {
    console.error('加载任务单详情失败:', error)
  }
}

const acceptWorkOrder = async () => {
  try {
    await store.updateWorkOrder(workOrder.value.id, { status: 'in_progress' })
    showToast('任务已接收')
    loadWorkOrder()
  } catch (error) {
    showFailToast('接收失败')
  }
}

const uploadAndComplete = async () => {
  try {
    // TODO: 上传照片到服务器
    // const imageUrls = await Promise.all(fileList.value.map(f => store.uploadPhoto(f.file)))
    
    await store.updateWorkOrder(workOrder.value.id, { 
      status: 'completed',
      notes: repairDescription.value
    })
    
    showToast('任务已完成')
    showUploadDialog.value = false
    loadWorkOrder()
  } catch (error) {
    showFailToast('完成失败')
  }
}

const goToDefect = (defectId) => {
  router.push(`/defect/${defectId}`)
}

onMounted(() => {
  loadWorkOrder()
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

.defect-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.defect-item:active {
  background: #e8e8e8;
}

.defect-item span {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.action-buttons {
  margin-top: 24px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.van-uploader) {
  margin-bottom: 16px;
}
</style>
