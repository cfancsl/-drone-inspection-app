<template>
  <div class="page-container">
    <!-- 用户信息 -->
    <div class="user-card">
      <van-image
        round
        width="80"
        height="80"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
      <div class="user-info">
        <div class="user-name">{{ store.user?.realName || '用户' }}</div>
        <div class="user-role">{{ store.user?.username || '' }}</div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-value">{{ stats.pendingDefects }}</div>
        <div class="stat-label">待处理病害</div>
      </div>
      <div class="stat-divider" />
      <div class="stat-item">
        <div class="stat-value">{{ stats.myWorkOrders }}</div>
        <div class="stat-label">我的任务</div>
      </div>
      <div class="stat-divider" />
      <div class="stat-item">
        <div class="stat-value">{{ stats.completedWorkOrders }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <van-cell-group inset>
      <van-cell title="病害列表" is-link to="/defects">
        <template #icon>
          <van-icon name="warning-o" color="#667eea" size="20" />
        </template>
      </van-cell>
      <van-cell title="我的任务" is-link to="/workorders">
        <template #icon>
          <van-icon name="records" color="#667eea" size="20" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 设置 -->
    <van-cell-group inset style="margin-top: 16px">
      <van-cell title="关于我们" is-link />
      <van-cell title="检查更新" is-link />
    </van-cell-group>

    <!-- 退出登录 -->
    <van-button
      type="danger"
      size="large"
      round
      block
      style="margin-top: 24px"
      @click="handleLogout"
    >
      退出登录
    </van-button>

    <div class="version">Version 1.0.0</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showDialog, showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

const stats = ref({
  pendingDefects: 0,
  myWorkOrders: 0,
  completedWorkOrders: 0
})

const loadStats = async () => {
  try {
    const [defects, workOrders] = await Promise.all([
      store.fetchDefects(),
      store.fetchWorkOrders()
    ])
    
    stats.value.pendingDefects = defects.filter(d => d.status === 'pending').length
    stats.value.myWorkOrders = workOrders.filter(w => 
      w.assignee === store.user?.realName
    ).length
    stats.value.completedWorkOrders = workOrders.filter(w => 
      w.assignee === store.user?.realName && w.status === 'completed'
    ).length
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const handleLogout = async () => {
  try {
    await showDialog({
      title: '退出登录',
      message: '确定退出登录？',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })
    store.logout()
    showToast('已退出登录')
    router.push('/login')
  } catch (error) {
    if (error.message !== 'cancel') {
      console.error('退出登录失败:', error)
    }
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(102,126,234,0.3);
}

.user-info {
  flex: 1;
  color: #fff;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-role {
  font-size: 14px;
  opacity: 0.8;
}

.stats-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e5e5e5;
}

.version {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 24px;
  padding-bottom: 20px;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-button--danger) {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  border: none;
  height: 50px;
  font-size: 16px;
}
</style>
