# 📱 Android APP 开发指南

## 🎯 项目结构

```
drone-app/
├── src/                    # 源代码
│   ├── views/             # 页面组件
│   ├── stores/            # 状态管理
│   ├── router/            # 路由配置
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── android/               # Android 原生项目
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/      # Java 代码
│   │   │   ├── res/       # 资源文件
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
├── dist/                  # 构建输出目录
├── capacitor.config.json  # Capacitor 配置
└── package.json           # 项目配置
```

## 🛠️ 开发环境要求

### 必需软件
1. **Node.js** >= 18.0.0
2. **JDK** >= 17
3. **Android Studio** >= 2023.1
4. **Android SDK**:
   - API Level 22+
   - Build Tools 33.0.0+

### 环境变量
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## 📦 安装步骤

### 1. 安装依赖
```bash
cd /home/admin/.openclaw/workspace/drone-app
npm install
```

### 2. 构建 Web 应用
```bash
npm run build
```

### 3. 同步到 Android
```bash
npx cap sync android
```

### 4. 打开 Android Studio
```bash
npx cap open android
```

## 🚀 开发流程

### 开发模式
```bash
# 1. 启动 Vite 开发服务器
npm run dev

# 2. 修改代码后，同步到 Android
npx cap sync android

# 3. 在 Android Studio 中运行
npx cap open android
```

### 调试模式
在 Android Studio 中：
1. 点击 **Run** → **Run 'app'**
2. 选择模拟器或真机
3. 应用会自动安装并启动

### Chrome 调试
在 Chrome 浏览器中打开：
```
chrome://inspect/#devices
```
可以看到连接的 Android 设备，点击 **inspect** 进行调试。

## 📱 打包 APK

### 开发版 APK
```bash
# 1. 构建 Web
npm run build

# 2. 同步
npx cap sync android

# 3. 在 Android Studio 中
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

APK 输出位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 发布版 APK（签名）

#### 1. 生成签名密钥
```bash
keytool -genkey -v -keystore drone-app.keystore -alias drone-app -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. 配置签名
编辑 `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('drone-app.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'drone-app'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. 构建发布版
在 Android Studio 中：
```
Build → Generate Signed Bundle / APK
选择 APK → release → 下一步 → 完成
```

APK 输出位置：
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🎨 APP 功能

### 1. 登录页面
- 用户名/密码登录
- Token 自动存储
- 401 自动跳转登录

### 2. 病害列表
- 按状态筛选（全部/待处理/已派单/已完成）
- 下拉刷新
- 上拉加载更多
- 点击查看详情

### 3. 病害详情
- 完整病害信息
- 照片预览
- **导航到病害位置**（调用高德地图）
- 支持打开第三方地图 APP

### 4. 任务单列表
- 显示分配给当前用户的任务
- 按状态筛选
- 接收任务按钮
- 完成任务按钮

### 5. 任务单详情
- 任务详细信息
- 关联病害列表
- 接收/完成任务
- **拍照上传**（待完善）

### 6. 个人中心
- 用户信息展示
- 统计数据（待处理/我的任务/已完成）
- 退出登录

## 📸 拍照功能

### 使用 Capacitor Camera
```javascript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  })
  
  // image.webPath 是照片路径
  // 可以上传到服务器
}
```

### 权限配置
编辑 `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 🗺️ 导航功能

### 调用高德地图
```javascript
const navigateTo = (lat, lng, name) => {
  const url = `androidamap://navi?sourceApplication=无人机巡检&lat=${lat}&lon=${lng}&dev=0&style=2`
  window.open(url, '_blank')
}
```

### 支持地图 APP
- 高德地图
- 百度地图
- 腾讯地图
- Google Maps

## 🔧 常见问题

### 1. 构建失败
```bash
# 清理缓存
rm -rf node_modules
npm install
npx cap clean android
npx cap sync android
```

### 2. 白屏问题
- 检查 `dist` 目录是否存在
- 检查 API 地址配置
- 检查网络权限

### 3. 热更新
修改代码后：
```bash
npm run build
npx cap sync android
```
然后在 Android Studio 中重新运行。

## 📊 API 配置

### 开发环境
编辑 `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://192.168.1.100:3000',  // 本地服务器 IP
    changeOrigin: true
  }
}
```

### 生产环境
打包后 API 地址硬编码在代码中，或使用环境变量：
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || '/api'
```

## 📱 真机测试

### 1. 启用 USB 调试
- 设置 → 关于手机 → 连续点击版本号 7 次
- 设置 → 开发者选项 → 开启 USB 调试

### 2. 连接电脑
```bash
adb devices
```
看到设备即连接成功。

### 3. 安装 APK
```bash
adb install app-debug.apk
```

## 🎯 下一步

- [ ] 完善拍照上传功能
- [ ] 添加离线缓存
- [ ] 添加消息推送
- [ ] 添加生物识别登录
- [ ] 添加深色模式
- [ ] 优化性能

## 📄 相关文档

- [Capacitor 官方文档](https://capacitorjs.com/)
- [Vant 组件库](https://vant-contrib.gitee.io/vant/)
- [Vue 3 文档](https://vuejs.org/)

---

**APP 开发完成！** 🎉

支持 Android 平台，可以打包成 APK 安装到手机上使用！
