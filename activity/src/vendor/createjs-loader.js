/**
 * 方便百分比加载flash导出的createjs文件
 *
 * @使用说明
 *  新建目录和文件 static/flash/demo/demo.fla
 *  执行导出操作(无需修改任何导出的文件)
 *  gulpfile.js config.devVendorJs 中加入 "vendor/createjs.js"、"vendor/createjs-loader.min.js"
 */
// 拷贝以下代码，调用：
// CreatejsLoader.load({
//     selector: 'canvas', // 元素选择器或者元素对象
//     name: 'demo', // 导出的文件名
//     path: 'static/flash/demo', // 存放导出文件的目录
//     spritesheetLength: 4, // 导出的雪碧图数量,
//     spritesheetName: 'demo_atlas_', //导出的雪碧图名称
//     onProgress: function (value) {
//         console.log('加载 ' + ~~(value * 100) + '%')
//     },
//     onComplete: function (obj) {
//         console.log(obj) // 会回调stage, exportRoot等对象 用于后续操作
//     }
// })
;(function () {
    function loadScript(url, cb) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = cb
        script.src = url
        document.querySelector('head').appendChild(script)
    }

    function initScript(options) {
        var canvas, stage, exportRoot;

        function init() {
            canvas = $(options.selector)[0]
            canvas.crossOrigin = window.location.origin + "/crossdomain.xml";
            images = images || {};
            ss = ss || {};

            lib.properties.manifest = lib.properties.manifest.map(function (obj) {
                obj.src = options.path + '/' + obj.src
                return obj
            })

            if (options.spritesheetLength > 0) {
                loadSpritesheetResource(function (arr) {
                    if (lib.properties.manifest.length) {
                        arr = arr.concat(lib.properties.manifest)
                    }
                    loadImages(arr, options.onProgress, handleComplete)
                })
            } else {
                loadImages(lib.properties.manifest, options.onProgress, handleComplete)
            }

        }

        function loadSpritesheetResource(cb) {
            var arr = []
            var count = options.spritesheetLength

            for (var i = 1; i <= options.spritesheetLength; i++) {
                var id = options.spritesheetName + (i == 1 ? '' : i)
                var src = options.path + "/images/" + id + ".json";

                (function (id, src) {
                    loadSpritesheetJSON(src, function (json) {
                        ss[id] = new createjs.SpriteSheet(json)
                        json.images.forEach(function (src) {
                            //arr.push({id: id, src: src, isSpritesheet: true})

                            var obj = {
                                id: id,
                                src: src,
                                isSpritesheet: true
                            }

                            arr.push(obj)
                        })

                        if (--count == 0) {
                            cb(arr)
                        }
                    })
                })(id, src)
            }
        }

        function loadSpritesheetJSON(url, cb) {
            $.getJSON(url, function (data) {
                data.images = data.images.map(function (image) {
                    image = options.path + '/' + image
                    return image
                })
                cb(data)
            })
        }

        function loadImages(array, progress, complete) {
            var count = 0
            var len = array.length

            for (var i = 0; i < Math.min(len, 5); i++) {
                handle()
            }

            function handle() {
                if (!array.length || count == len) {
                    return
                }
                var item = array.shift()
                loadImage(item.src, function (image) {
                    if (!item.isSpritesheet) {
                        images[item.id] = image
                    }
                    progress && progress(++count / len)
                    if (count == len) {
                        complete()
                    } else {
                        handle()
                    }
                })
            }
        }

        function loadImage(src, cb) {
            var image = new Image()

            //image.crossOrigin = window.location.origin.replace(".com",".net")+"/crossdomain.xml";
            //console.log("aaa");

            image.onload = function () {
                cb(image)
            }
            image.src = src;
            //image.crossOrigin =
            //image.crossOrigin = "Anonymous";
        }

        function handleComplete() {


            exportRoot = new lib[options.name]();

            stage = new createjs.Stage(canvas);
            stage.addChild(exportRoot);
            stage.update();

            createjs.Touch.enable(stage);

            createjs.Ticker.setFPS(lib.properties.fps);
            createjs.Ticker.addEventListener("tick", stage);

            options.onComplete && options.onComplete({
                lib: lib,
                ss: ss,
                stage: stage,
                exportRoot: exportRoot,
                images: images
            })
        }

        init()
    }

    window.CreatejsLoader = {
        load: function (options) {
            loadScript(options.path + '/' + options.name + '.js', function () {
                initScript(options)
            })
        }
    }
})();