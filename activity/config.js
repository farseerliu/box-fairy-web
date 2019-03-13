module.exports = {
    // 配置要打包在 vendor.js 中的 js 路径数组
    vendorJs: [
        'src/vendor/angular.js',
        'src/vendor/weui.js'
    ],

    // 设置需要编译的主题，默认的 default 不需要写进去。
    // 比如 page/index@demo.html 那么主题就是 demo
    themes: ['demo'],

    // 本地调试的 HTTP 服务器根目录，不填默认获取 public 下作为根
    rootPath: '',

    // 本地调试 自动打开浏览器 访问的地址
    openFile: 'index.html',

    // 如果有需求 HTML 和 资源是分开的，可以设置这个参数来决定 HTML 写到什么位置，如填写 ../ 则写在上一层，默认是当前
    htmlPath: '',

    // 默认 HTML 文件名是和 page/index.html 的 index.html 同名的，
    // 如果有需求修改生成的文件名，可以在这里处理，比如 return 'app-' + name ，那么结果就是 app-index.html
    htmlName: function (name) {
        return name
    },

    // 页面标签自动附加的 class 名
    pageClassName: 'ued-page'
}
