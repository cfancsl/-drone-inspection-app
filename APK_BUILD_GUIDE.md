# 📱 Android APK 构建指南

## ✅ 构建状态

**Web 构建**: ✅ 成功  
**Android 同步**: ✅ 成功  
**构建时间**: 2026-03-15 23:18

---

## 📦 构建输出

### Web 文件
```
dist/
├── index.html
└── static/
    ├── *.css (样式文件)
    └── *.js (JavaScript 文件)
```

### Android 项目
```
android/
└── app/
    └── build/
        └── outputs/
            └── apk/
                └── debug/
                    └── app-debug.apk  ← APK 文件位置
```

---

## 🚀 生成 APK 方法

### 方法 1: 使用 Android Studio（推荐）

1. **打开 Android Studio**
   ```bash
   cd /home/admin/.openclaw/workspace/drone-app
   npx cap open android
   ```

2. **等待 Gradle 同步完成**

3. **构建 APK**
   - 点击菜单：**Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - 等待构建完成

4. **获取 APK**
   - 构建完成后会提示 "APK(s) generated successfully"
   - 点击 **locate** 打开 APK 所在目录
   - 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法 2: 使用命令行

```bash
cd /home/admin/.openclaw/workspace/drone-app/android

# Linux/Mac
./gradlew assembleDebug

# Windows
gradlew.bat assembleDebug
```

APK 输出位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 安装 APK

### 方法 1: USB 传输
1. 将 APK 文件复制到手机
2. 在手机上打开 APK 文件
3. 允许安装未知来源应用
4. 点击安装

### 方法 2: ADB 安装
```bash
adb install app-debug.apk
```

### 方法 3: 二维码下载
1. 将 APK 上传到服务器
2. 生成下载二维码
3. 手机扫描二维码下载安装

---

## 🔧 常见问题

### 1. Gradle 同步失败
**解决**:
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### 2. 构建失败 - SDK 未找到
**解决**:
- 打开 Android Studio
- Tools → SDK Manager
- 安装 Android SDK Platform 33
- 安装 Android SDK Build-Tools 33.0.0

### 3. 构建失败 - JDK 版本
**要求**: JDK 17 或更高
**检查**:
```bash
java -version
```

### 4. APP 白屏
**原因**: API 地址配置错误
**解决**:
- 编辑 `vite.config.js`
- 修改 proxy target 为实际 API 地址
- 重新构建：`npm run build && npx cap sync android`

---

## 📊 APK 信息

### 开发版 APK
- **文件名**: app-debug.apk
- **大小**: 约 2-3 MB
- **签名**: Debug 签名
- **用途**: 开发测试

### 发布版 APK
- **文件名**: app-release.apk
- **大小**: 约 1-2 MB（压缩后）
- **签名**: 正式签名
- **用途**: 生产发布

---

## 🔐 签名配置（发布版）

### 1. 生成签名密钥
```bash
keytool -genkey -v \
  -keystore drone-app.keystore \
  -alias drone-app \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 2. 配置签名
编辑 `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('drone-app.keystore')
            storePassword 'your-password'
            keyAlias 'drone-app'
            keyPassword 'your-password'
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

### 3. 构建发布版
在 Android Studio 中：
```
Build → Generate Signed Bundle / APK
选择 APK → release → 下一步 → 选择签名 → 完成
```

---

## 📱 APP 信息

- **应用名称**: 无人机巡检
- **包名**: com.drone.inspection.app
- **版本**: 1.0.0
- **最低 Android 版本**: 5.1 (API 22)
- **目标 Android 版本**: 13 (API 33)

---

## 🎯 功能特性

- ✅ 登录认证
- ✅ 病害列表查看
- ✅ 病害详情
- ✅ 导航到病害位置
- ✅ 任务单列表
- ✅ 任务单详情
- ✅ 接收/完成任务
- ✅ 个人中心
- ✅ 统计数据

---

## 📄 相关文件

- `package.json` - 项目配置
- `vite.config.js` - Vite 配置
- `capacitor.config.json` - Capacitor 配置
- `ANDROID_APP_GUIDE.md` - Android 开发指南

---

## 🌐 API 配置

### 开发环境
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

### 生产环境
修改为实际服务器地址：
```javascript
proxy: {
  '/api': {
    target: 'http://47.109.39.127:3000',
    changeOrigin: true
  }
}
```

---

## ✅ 构建完成清单

- [x] Web 应用构建
- [x] Android 项目同步
- [ ] APK 构建（需手动执行）
- [ ] 签名配置（发布版需要）
- [ ] 真机测试

---

**下一步**: 打开 Android Studio 构建 APK！

```bash
cd /home/admin/.openclaw/workspace/drone-app
npx cap open android
```

然后在 Android Studio 中点击 **Build** → **Build APK**
