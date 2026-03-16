import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = '/api'

// 配置 axios
axios.defaults.baseURL = API_BASE
axios.defaults.timeout = 30000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const useAppStore = defineStore('app', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    defects: [],
    workOrders: [],
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    pendingDefects: (state) => state.defects.filter(d => d.status === 'pending'),
    myWorkOrders: (state) => {
      if (!state.user) return []
      return state.workOrders.filter(w => w.assignee === state.user.realName)
    }
  },

  actions: {
    // 登录
    async login(username, password) {
      try {
        const response = await axios.post('/auth/login', { username, password })
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        return response
      } catch (error) {
        throw error
      }
    },

    // 登出
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 获取病害列表
    async fetchDefects(params = {}) {
      try {
        this.loading = true
        const response = await axios.get('/defects', { params })
        this.defects = response
        return response
      } catch (error) {
        console.error('获取病害列表失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // 获取工单列表
    async fetchWorkOrders(params = {}) {
      try {
        this.loading = true
        const response = await axios.get('/workorders', { params })
        this.workOrders = response
        return response
      } catch (error) {
        console.error('获取工单列表失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // 更新病害状态
    async updateDefect(id, data) {
      try {
        const response = await axios.put(`/defects/${id}`, data)
        const index = this.defects.findIndex(d => d.id === id)
        if (index !== -1) {
          this.defects[index] = response
        }
        return response
      } catch (error) {
        throw error
      }
    },

    // 更新工单状态
    async updateWorkOrder(id, data) {
      try {
        const response = await axios.put(`/workorders/${id}`, data)
        const index = this.workOrders.findIndex(w => w.id === id)
        if (index !== -1) {
          this.workOrders[index] = response
        }
        return response
      } catch (error) {
        throw error
      }
    },

    // 上传照片
    async uploadPhoto(file, type = 'defect') {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.url
      } catch (error) {
        throw error
      }
    },

    // 导航到病害位置
    navigateTo(lat, lng, roadName, mileage) {
      const title = encodeURIComponent(`${roadName} K${mileage}`)
      // 调用高德地图导航
      const url = `https://uri.amap.com/navigation?destination=${lng},${lat}&destinationname=${title}&mode=driving`
      window.open(url, '_blank')
    }
  }
})
