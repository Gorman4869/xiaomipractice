// goodsDesc.html商品详情页的配置文件，
// 跟其他页面通用的数据和页面也是在这个文件中加载，不用重新写。例如导航条，侧边栏等

require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        "jquery-cookie":"jquery.cookie",
        "nav":"nav",
        "goodsDesc":"goodsDesc",
        
    },
    //设置依赖关系
    shim:{
        "jquery-cookie":["jquery"]
    }
})


require(['nav',"goodsDesc"], function(nav,goodsDesc){
    nav.topNavDownload();
    nav.leftNavDownload();
    nav.topNavTab();
    nav.leftNavTab();
    nav.searchTab();
    nav.allGoodsTab();


    goodsDesc.download();
    goodsDesc.banner();

})