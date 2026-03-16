<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">
        <van-icon name="shield-o" size="60" color="#667eea" />
      </div>
      <h1 class="title">无人机巡检 APP</h1>
      <p class="subtitle">移动巡检 高效便捷</p>
    </div>

    <div class="login-form">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      />
      
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }]"
      />

      <van-button
        type="primary"
        size="large"
        round
        block
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </van-button>
    </div>

    <div class="login-footer">
      <p>© 2026 无人机公路巡检系统</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { showToast, showFailToast } from 'vant'

const router = useRouter()
const store = useAppStore()

const username = ref('admin')
const password = ref('123456')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showFailToast('请输入用户名和密码')
    return
  }

  try {
    loading.value = true
    await store.login(username.value, password.value)
    showToast('登录成功')
    router.push('/')
  } catch (error) {
    showFailToast(error.response?.data?.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-header {
  text-align: center;
  margin-bottom: 60px;
  margin-top: 60px;
}

.logo {
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

.login-form {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.login-form :deep(.van-cell) {
  padding: 16px 0;
}

.login-form :deep(.van-field__label) {
  color: #666;
  font-weight: 500;
}

.login-form :deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 50px;
  font-size: 16px;
  margin-top: 24px;
}

.login-footer {
  margin-top: auto;
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  padding-top: 40px;
}
</style>
