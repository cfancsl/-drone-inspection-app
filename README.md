# 🚁 无人机巡检 APP

移动端巡检应用，支持病害查看、任务管理、导航、拍照等功能。

## 📱 功能特性

### 1. 病害管理
- ✅ 查看病害列表（支持筛选）
- ✅ 查看病害详情
- ✅ 导航到病害位置（调用高德地图）
- ✅ 查看病害照片

### 2. 任务单管理
- ✅ 查看我的任务
- ✅ 任务单详情
- ✅ 接收任务
- ✅ 完成任务
- ✅ 拍照上传修复照片

### 3. 个人中心
- ✅ 用户信息
- ✅ 统计数据
- ✅ 退出登录

## 🛠️ 技术栈

- **框架**: Vue 3 + Vite
- **UI 组件**: Vant 4 (移动端组件库)
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP**: Axios
- **打包**: 支持 PWA / APK / iOS

## 📦 安装

```bash
cd /home/admin/.openclaw/workspace/drone-app
npm install
```

## 🚀 开发

```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5174
```

## 📱 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📲 打包成 APP

### 方案 1: Capacitor (推荐)

```bash
# 安装 Capacitor
npm install @capacitor/core @capacitor/cli

# 初始化
npx cap init

# 添加平台
npx cap add android
npx cap add ios

# 构建并同步
npm run build
npx cap sync

# 打开 Android Studio
npx cap open android
```

### 方案 2: PWA

在 `vite.config.js` 中添加 PWA 插件：

```bash
npm install vite-plugin-pwa
```

### 方案 3: H5 嵌入

直接部署 dist 目录到服务器，通过 WebView 嵌入原生 APP。

## 🌐 API 配置

默认代理到后端 API 服务器：

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

生产环境请修改为实际 API 地址。

## 📱 页面结构

```
src/
├── views/
│   ├── Login.vue          # 登录页
│   ├── DefectList.vue     # 病害列表
│   ├── DefectDetail.vue   # 病害详情
│   ├── WorkOrderList.vue  # 任务列表
│   ├── WorkOrderDetail.vue# 任务详情
│   └── Profile.vue        # 个人中心
├── stores/
│   └── app.js             # 状态管理
├── router/
│   └── index.js           # 路由配置
├── App.vue                # 根组件
└── main.js                # 入口文件
```

## 🔐 登录认证

- 默认账号：`admin`
- 默认密码：`123456`

Token 存储在 localStorage 中，自动添加到请求头。

## 🗺️ 导航功能

调用高德地图 URI：

```javascript
const url = `https://uri.amap.com/navigation?destination=${lng},${lat}&destinationname=${title}&mode=driving`
window.open(url, '_blank')
```

支持：
- 高德地图
- 百度地图
- 腾讯地图

## 📸 拍照上传

使用 Vant Uploader 组件：

```vue
<van-uploader v-model="fileList" :max-count="9" multiple />
```

照片上传到后端服务器，返回 URL 存储到数据库。

## 📊 数据统计

个人中心显示：
- 待处理病害数量
- 我的任务数量
- 已完成任务数量

## 🎨 UI 设计

- 主色调：紫色渐变 (#667eea → #764ba2)
- 圆角：12px / 16px
- 阴影：轻微阴影效果
- 底部导航：3 个 Tab（病害/任务/我的）

## 📱 适配

- 响应式设计
- 支持 iOS / Android
- 支持各种屏幕尺寸
- 禁用缩放

## 🔗 相关项目

- **后端 API**: `/home/admin/.openclaw/workspace/drone-road-inspection/server`
- **Web 端**: `/home/admin/.openclaw/workspace/drone-road-inspection`
- **数据库**: PostgreSQL (阿里云 RDS)

## 📝 开发进度

- [x] 登录页面
- [x] 病害列表
- [x] 病害详情
- [x] 任务列表
- [x] 任务详情
- [x] 个人中心
- [x] 导航功能
- [ ] 拍照上传（待完善）
- [ ] 离线缓存
- [ ] 消息推送

## 📄 License

MIT
