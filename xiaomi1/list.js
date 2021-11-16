//引入当前页面要使用的模块
require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        //用到首页导航部分的js模块
        "nav":"nav",
        "goodList":"goodList",
    }
});

require(['nav',"goodList"], function(nav,goodList){
    nav.leftNavDownload();
    nav.topNavDownload();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();
    nav.allGoodsTab();

    // list.html
    goodList.download();
    goodList.banner();

})