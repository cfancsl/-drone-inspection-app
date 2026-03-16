# 🚀 GitHub Actions 自动构建 APK 指南

## 📋 前提条件

- ✅ GitHub 账号（免费）
- ✅ 代码已推送到 GitHub 仓库

---

## 🔧 设置步骤

### 第 1 步：初始化 Git 仓库（如果还没有）

```bash
cd /home/admin/.openclaw/workspace/drone-app

# 初始化 Git
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: Drone Inspection App"
```

---

### 第 2 步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称：`drone-inspection-app`
3. 选择 **Public** 或 **Private**
4. **不要** 勾选 "Initialize this repository with a README"
5. 点击 **Create repository**

---

### 第 3 步：关联远程仓库并推送

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/drone-inspection-app.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

### 第 4 步：查看构建状态

1. 访问你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看构建进度（通常 5-10 分钟）

---

### 第 5 步：下载 APK

构建完成后，有两种方式下载：

#### 方式 A：从 Artifacts 下载（保留 30 天）

1. 在 Actions 页面点击最近的构建
2. 滚动到页面底部 **Artifacts** 区域
3. 点击 `app-debug` 下载

#### 方式 B：从 Releases 下载（永久保留）

1. 点击仓库的 **Releases** 标签
2. 选择最新的版本
3. 下载 `app-debug.apk`

---

## 📱 安装 APK

### 方法 1: USB 传输
1. 将 APK 文件复制到手机
2. 在手机上打开 APK 文件
3. 允许安装未知来源应用
4. 点击安装

### 方法 2: 二维码下载
1. 在 GitHub Release 页面复制 APK 下载链接
2. 使用二维码生成器生成二维码
3. 手机扫描二维码下载安装

### 方法 3: ADB 安装
```bash
adb install app-debug.apk
```

---

## ⚙️ 自定义配置

### 修改 APP 信息

编辑 `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.drone.inspection.app"  // 包名
        versionCode 1                              // 版本号
        versionName "1.0"                          // 版本名称
    }
}
```

### 修改 API 地址

编辑 `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://你的服务器 IP:3000',  // 修改为实际 API 地址
        changeOrigin: true
      }
    }
  }
}
```

---

## 🔐 签名配置（可选 - 发布正式版）

### 1. 生成签名密钥（本地执行）

```bash
keytool -genkey -v \
  -keystore drone-app.keystore \
  -alias drone-app \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 2. 将密钥上传到 GitHub Secrets

1. 仓库 → Settings → Secrets and variables → Actions
2. 添加以下 Secrets:
   - `KEYSTORE_BASE64`: `base64 drone-app.keystore`
   - `KEYSTORE_PASSWORD`: 你的密钥库密码
   - `KEY_ALIAS`: 密钥别名
   - `KEY_PASSWORD`: 密钥密码

### 3. 更新工作流文件

在 `.github/workflows/android-build.yml` 中添加签名配置。

---

## 📊 构建时间

| 阶段 | 预计时间 |
|------|---------|
| 环境准备 | 2 分钟 |
| 安装依赖 | 1 分钟 |
| Web 构建 | 1 分钟 |
| Android 同步 | 1 分钟 |
| APK 构建 | 3-5 分钟 |
| **总计** | **8-10 分钟** |

---

## 🆘 常见问题

### Q1: 构建失败 - Gradle 超时
**解决**: 在仓库 Settings → Actions 中增加超时时间

### Q2: 构建失败 - 内存不足
**解决**: GitHub Actions 默认 7GB 内存，通常足够。如仍失败，优化构建配置。

### Q3: APK 安装失败 - 解析包错误
**解决**: 检查 Android 版本是否满足最低要求（Android 7.0+）

### Q4: APP 白屏 - 无法连接 API
**解决**: 修改 `vite.config.js` 中的 API 地址为公网可访问的地址

---

## 📈 免费额度

| 资源 | 免费额度 | 说明 |
|------|---------|------|
| Actions 分钟 | 2000 分钟/月 | 约可构建 200 次 |
| 存储空间 | 500 MB | Artifacts + Releases |
| 带宽 | 无限制 | 下载 APK 不限速 |

---

## 🎯 自动触发

构建会在以下情况自动触发：

1. **推送到 main/master 分支** - 自动构建并创建 Release
2. **Pull Request** - 自动构建测试
3. **手动触发** - Actions 页面点击 "Run workflow"

---

## 📞 需要帮助？

1. 查看 GitHub Actions 日志
2. 检查构建错误信息
3. 参考官方文档：https://docs.github.com/en/actions

---

**祝你构建顺利！** 🎉
