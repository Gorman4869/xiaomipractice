// console.log("Done")

require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        "jquery-cookie":"jquery.cookie",
        "goodsCar":"goodsCar"
    },
    shim:{
        // 设置依赖关系，因为jQuery-cookie是依赖jQuery开发的
        "jquery-cookie": ["jquery"]
    }
})

require(["goodsCar",], function(goodsCar){
    goodsCar.download();
    goodsCar.carHover();
    goodsCar.loadCarData();
    goodsCar.checkFunc();
    goodsCar.isCheckAll();
    goodsCar.changeCars();
    // goodsCar.();

})