/*
    安装第三方插件
    gulp-scss
    gulp-minify-css
    gulp-rename
 */
/*
    把.scss文件 》 css文件  》 mini.css
 */

const gulp = require("gulp");
// const scss = require("gulp-scss");
const scss = require("gulp-sass")(require('sass'))
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");

// gulp.task("scss",function(){
//     return gulp.src("stlyesheet/index.scss")
//     .pipe(scss())
//     // .pipe(gulp.dest("dist/css"))
//     .pipe(minifyCSS())
//     .pipe(rename("index.min.css"))
//     .pipe(gulp.dest("dist/css"))
//     // .pipe(connect.reload());
// })

gulp.task("scss", function(){
    return gulp.src("stylesheet/index.scss")
    .pipe(scss())//首先通过sass对文件进行编译
    .pipe(gulp.dest("dist/css"))//编译完后的存放路径
    .pipe(minifyCSS())//接着进行压缩
    .pipe(rename("index.min.css"))//然后重命名
    .pipe(gulp.dest("dist/css"))//再次存放
    .pipe(connect.reload());
})
/*
    如果不重命名，就可以选择批量处理
 */
//找到所有的sass文件，直接编译存放
gulp.task("scssAll", function(){
    return gulp.src("stylesheet/*.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

// 处理.js
gulp.task("scripts",function(){
    return gulp.src(["*.js","!gulpfile.js"])
    //gulpfile.js不能被编译，所以通过感叹号排除掉
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());

})

//处理html
gulp.task("copy-html",function(){
    return gulp.src("*.html")
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());

})

// 处理数据
gulp.task("data",function(){
    return gulp.src(["*.json","!package.json"])
    .pipe(gulp.dest("dist/data"))
    .pipe(connect.reload());

})

// 处理图片
gulp.task("images",function(){
    return gulp.src("images/**/*")
    //文件夹下的图片和里面文件的图片
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());
})

// 一次性执行多个任务 在终端输入 gulp build  ，就会根据gulpfile 执行所创建的任务
gulp.task("build",["scss","scripts", "scssAll","copy-html","data","images"],function(){
    console.log("项目建立成功");
})

/*
    建立监听，当文件被修改，自动执行任务。
*/

gulp.task("watch",function(){
    gulp.watch("stylesheet/index.scss",["scss"])//(被监听的文件名，[需要被执行的任务])
    gulp.watch("stylesheet/*.scss",["scssAll"])
    gulp.watch(["*.js","!gulpfile.js"],["scripts"])
    gulp.watch("*.html",["copy-html"])
    gulp.watch(["*.json","!package.json"],["data"])
    gulp.watch("images/**/*",["images"])

})

// 启动服务器 gulp-connect

const connect = require("gulp-connect");

gulp.task("server",function(){
    connect.server({
        root: "dist",
        port: 666,//0-65535
        livereload:true,//实时刷新，在每个任务结尾加入.pipe(connect.reload());
    })
})

// 启动一个默认的任务 在终端直接输入gulp，启动默认任务
gulp.task("default", ["watch", "server"]);