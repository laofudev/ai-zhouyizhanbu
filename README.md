# 易经占卜 - AI 智能解卦

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo-name&env=VITE_DEEPSEEK_API_KEY&envDescription=DeepSeek%20API%20Key%20for%20AI%20divination&envLink=https%3A%2F%2Fplatform.deepseek.com%2F)

一个基于《易经》六爻法的在线占卜应用，结合传统易经智慧与现代 AI 技术，为用户提供深入的卦象解读。

## ✨ 为什么需要手动抛硬币？

**传统占卜强调"诚心"与"专注"**

1. **心诚则灵**：《易经》占卜的核心在于占卜者的诚心专注。手动抛硬币的过程，让你有足够的时间集中意念，冥想问题，这与内心建立连接的过程是自动化无法替代的。

2. **天人合一**：传统六爻法认为，占卜是连接天、地、人的过程。你亲手抛掷硬币的那一刻，意念与行动合一，才能真正体现"感而遂通"的易经哲学。

3. **更准确的卦象**：古人的智慧告诉我们，占卜的准确性不仅在于方法，更在于心法。手动抛币让你在每次抛掷时都保持专注，这种精神状态直接影响卦象的呈现。

4. **仪式感的意义**：六次抛币，从下至上，从初爻到上爻，这是一个完整的仪式过程。每一次抛掷都是一次与宇宙的对话，这种体验是随机生成无法提供的。

**本工具尊重传统，不提供"一键生成"功能，因为真正的占卜需要你的参与和专注。**

## 📚 制作依据

本工具并非随意制作，而是严格遵循以下经典文献和研究：

### 📖 参考文献与资料来源

1. **《周易》（易经）**
   - 六十四卦的卦辞、爻辞、象辞等核心内容
   - 本卦与变卦的推导原理

2. **《周易折中》**
   - 清代李光地等奉敕编纂，汇集历代易学研究成果
   - 提供了系统的卦象解析方法

3. **《增删卜易》**
   - 野鹤老人著，六爻占卜的经典之作
   - 详述了六爻法的具体操作步骤

4. **《系辞传》**
   - 解释了易经的哲学思想和占卜原理
   - "大衍之数五十，其用四十有九"等占卜理论基础

5. **现代易学研究**
   - 参考了多位现代易学专家的研究成果
   - 结合现代计算机技术实现传统算法

### 🔧 技术实现

- **64卦完整数据**：包含所有卦象的卦名、卦符、卦辞、象辞、爻辞
- **六爻推导算法**：严格遵循"老变少不变"的原则（老阴变少阳，老阳变少阴）
- **变卦计算**：准确计算变卦及其爻位变化
- **阴阳转换**：遵循易经阴阳消长规律

## 🎯 功能特色

- **传统六爻占卜**：遵循传统易经六爻法，通过抛掷三枚硬币六次成卦
- **可视化卦象**：直观展示本卦、变卦的爻位变化，清晰标注变爻
- **完整卦象信息**：包含卦辞、象曰、爻辞等传统文本
- **AI 智能解卦**：集成 DeepSeek AI，提供深入、个性化的卦象解读
- **精美界面**：使用 Tailwind CSS 和 shadcn/ui 构建的现代化界面
- **流畅动画**：基于 Framer Motion 的流畅过渡效果
- **响应式设计**：完美支持桌面端和移动端

## 🚀 快速开始

### 方式一：在线使用（推荐）

点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo-name&env=VITE_DEEPSEEK_API_KEY&envDescription=DeepSeek%20API%20Key%20for%20AI%20divination&envLink=https%3A%2F%2Fplatform.deepseek.com%2F)

**部署步骤：**
1. 点击上方按钮
2. 连接你的 GitHub 账号
3. 在环境变量配置中填入 `VITE_DEEPSEEK_API_KEY`（见下方获取方法）
4. 点击 Deploy，等待 1-2 分钟即可完成

### 方式二：本地运行

#### 环境要求

- Node.js 20+
- npm 或 yarn

#### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/laofudev/ai-zhouyizhanbu.git
cd ai-zhouyizhanbu
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件：
```bash
cp .env.example .env
```

#### 🔑 获取 DeepSeek API Key

**为什么需要 API Key？**

本工具使用 DeepSeek AI 进行智能解卦，需要调用 DeepSeek 的 API。API 采用按量计费模式，新用户有免费额度，之后按实际使用量付费（非常便宜）。

**获取步骤：**

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入「API Keys」页面
4. 点击「创建 API Key」
5. 复制生成的 API Key（格式如：`sk-xxxxxxxxxxxxx`）

**配置 API Key：**

编辑 `.env` 文件，将获取的 API Key 填入：

```env
# DeepSeek API 配置
# 获取 API Key: https://platform.deepseek.com/
VITE_DEEPSEEK_API_KEY=sk-你的实际API密钥
```

**费用说明：**

- 新用户赠送一定免费额度
- 解卦一次约消耗 100-200 tokens
- 1 元 ≈ 100 万 tokens（足够使用数百次）
- 可以在控制台设置使用限额，避免超额消费

4. **启动开发服务器**
```bash
npm run dev
```

应用将在 http://localhost:5173 启动

5. **构建生产版本**
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 📖 使用方法

### 占卜流程

1. **诚心默念**
   - 找一个安静的环境，平心静气
   - 在输入框中写下你想占卜的问题
   - 诚心默念问题，集中意念

2. **抛掷硬币**
   - 准备三枚相同的硬币
   - 按照屏幕提示，每次抛掷三枚硬币
   - 观察每枚硬币的正反面

3. **记录结果**
   - 点击屏幕上的硬币，选择正面（字）或反面（背）
   - 正面（有字的一面）= 3 点
   - 反面（有花纹的一面）= 2 点
   - 系统会自动计算爻的类型和是否变爻

4. **重复六次**
   - 从下到上，依次完成六爻
   - 每一爻代表不同的位置和含义
   - 六爻完成后，系统会自动生成卦象

5. **查看结果**
   - 查看本卦（初始卦象）和变卦（变化后的卦象）
   - 阅读卦辞、象曰、爻辞等传统解释
   - 了解变爻的位置和含义

6. **AI 智能解卦**
   - 点击"AI 智能解卦"按钮
   - AI 会结合你的问题，提供详细的个性化解读
   - 包括卦象总论、问题分析、吉凶判断、行动建议等

### 占卜注意事项

- **心诚则灵**：占卜前请平心静气，诚心默念问题
- **问题明确**：问题要具体明确，不宜过于模糊
- **一次一问**：每次占卜只问一个问题
- **理性看待**：占卜结果仅供参考，最终决定权在自己
- **不可重复**：同一问题不宜反复占卜

## 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion
- **AI 集成**: DeepSeek API

## 📁 项目结构

```
app/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui 组件库
│   ├── data/
│   │   └── gua64.ts         # 64卦完整数据（卦辞、爻辞等）
│   ├── services/
│   │   └── deepseek.ts      # DeepSeek API 集成
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── hooks/
│   │   └── use-mobile.ts    # 移动端检测 Hook
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 应用样式
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── public/                  # 静态资源
│   └── gzh.png             # 公众号二维码
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── .env.example            # 环境变量示例
└── package.json            # 项目依赖
```

## 🧰 开发

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 组件使用

项目使用 shadcn/ui 组件，可以这样导入：

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
```

## 👨‍💻 关于作者

**只工作不上班 | 95后一人公司**

写代码做产品，以定投滚雪球，目标是提前退休，践行自由生活。

### 联系方式

- **邮箱**: laofudev@foxmail.com
- **公众号**: 资源老夫

![公众号二维码](public/gzh.png)

**欢迎关注我的公众号，获取更多有趣的项目和分享！**

## 📄 许可证

MIT License

Copyright (c) 2025 资源老夫 <laofudev@foxmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 致谢

- 易经数据参考了《周易》《周易折中》《增删卜易》等传统文献
- 感谢 shadcn/ui 提供优秀的 UI 组件库
- 感谢 DeepSeek 提供 AI 能力支持
- 感谢所有为传承和发扬易经文化做出贡献的学者和研究者

## ⚖️ 免责声明

本工具仅供娱乐和文化研究参考，占卜结果不应作为人生决策的唯一依据。请理性对待，相信科学，做出自己的判断。

---

**如果觉得这个项目有帮助，请给个 ⭐ Star 支持一下！**
