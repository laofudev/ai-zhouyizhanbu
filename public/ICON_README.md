# 网站图标说明

## 当前图标

项目已包含以下SVG格式的图标：

- `favicon.svg` - 主图标（推荐，现代浏览器支持）
- `safari-pinned-tab.svg` - Safari标签页图标

## 图标设计

图标采用传统太极八卦设计：
- **主色调**：朱红色 (#C0392B)
- **装饰色**：金色 (#D4AF37)
- **图案**：太极阴阳鱼 + 八卦符号

## 生成PNG图标（可选）

如果需要PNG格式的图标以支持老版本浏览器，可以使用以下在线工具：

1. 访问 https://realfavicongenerator.net/
2. 上传 `favicon.svg`
3. 选择需要的图标尺寸
4. 下载生成的图标包
5. 将以下文件放到 `public/` 目录：
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`

## 验证图标

启动项目后，浏览器标签页应该显示太极八卦图标。

如果图标没有更新，请尝试：
1. 清除浏览器缓存
2. 强制刷新（Ctrl+Shift+R 或 Cmd+Shift+R）
3. 检查浏览器控制台是否有图标加载错误
