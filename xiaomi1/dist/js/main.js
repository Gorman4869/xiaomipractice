/*
    配置当前这个项目用到了哪些模块
    遵从的都是AMD规范
    所有.js文件的后缀都可以省略
*/

require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        "jquery-cookie":"jquery.cookie",//注意这个cookie的配置，是jquery.cookie
        "nav":"nav",
        "slide":"slide",
        "data":"data",
    },
    shim:{
        // 设置依赖关系，因为jQuery-cookie是依赖jQuery开发的
        "jquery-cookie": ["jquery"]
    }
})

require(["nav","slide","data"],function(nav,slide,data){
    nav.download();
    nav.banner();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();

    // 商品列表数据

    slide.download();
    slide.slideTab();

    //主页数据
    data.download();
    data.menuTab();
})