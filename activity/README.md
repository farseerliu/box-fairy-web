## 命名规范

- js, less, html 文件名遵循小写连词符形式，不要出现大写和下划线，比如 hello-world.html
- .directive('pageHelloWorld', func) 这个字符串必须是小写开头驼峰形式

## 文件、目录说明

- dist 编译产出目录
- mock 本地模拟线上接口的 json 文件
- src 源代码
    - common 公共的 css、js 文件
    - component 组件
    - filter 数据格式化
    - page 页面
    - service 业务逻辑、公共服务、工具方法
    - vendor 依赖的第三方库（需要在 gulpfile.js 中配置 config.devVendorJs）
    - main.js 入口文件，可以做一些初始化的操作
    - template.html 页面文件的模板
    
- static 不做任何处理的静态文件
- *.html 编译产出的 html 文件
- gulpfile.js 编译脚本

src/template.html 中的 ued.js 放在 `<head>` 中，
并且是 CSS 文件之前引入，原因是让 rem() 这个方法优先执行，保证画面显示正确
