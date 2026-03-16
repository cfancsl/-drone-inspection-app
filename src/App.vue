<template>
  <div class="app-container">
    <router-view />
    <!-- 底部导航栏 -->
    <van-tabbar v-if="isLoggedIn" v-model="activeTab" route>
      <van-tabbar-item to="/defects" icon="warning-o">病害</van-tabbar-item>
      <van-tabbar-item to="/workorders" icon="records">任务</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref(0)

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
  background: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  padding-bottom: 50px;
}

.page-container {
  padding: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.card-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-success { background: #e7f9f0; color: #07c160; }
.tag-warning { background: #fff7e6; color: #ff976a; }
.tag-danger { background: #ffebe6; color: #ee0a24; }
.tag-info { background: #f2f3f5; color: #969799; }

.btn-block {
  width: 100%;
  margin-top: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state .icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state .text {
  font-size: 14px;
}
</style>
