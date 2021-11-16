define([
    'jquery',
    'jquery-cookie'
], function($) {
        /* 加载已经加入购物车的数据，数据需要有图片，价格等其它信息
        cookie里只有id和num
        所以需要重新加载数据源，两个json文件
        但是ajax的URL是不能同时写两个路径，为了能保证数据加载成功
        使用new Promise处理两次按顺序加载的数据，串行加载
        */
       function loadCarData(){
            $("#J_cartListBody .J_cartGoods").html("");
           new Promise(function(resolve, reject){
               $.ajax({
                   url:'../data/goodsCarList.json',
                   success:function(obj){
                       resolve(obj.data);//相当于then后面的function？
                   },
                   error:function(msg){
                       reject(msg);
                   }
               })
           }).then(function(arr1){
            //    console.log(arr1);
                return  new Promise(function(resolve, reject){
                    $.ajax({
                        url:'../data/goodsList2.json',
                        success:function(arr2){
                            var newArr = arr1.concat(arr2);
                            resolve(newArr);//相当于then后面的function？
                        },
                        error:function(msg){
                            reject(msg);
                        }
                    })
                }).then(function(arr){
                    // console.log(arr);
                    // 拿到服务器上，所有的商品数据，然后找出cookie中有的数据
                    var cookieStr = $.cookie("goods");
                    if(cookieStr){
                        var cookieArr = JSON.parse(cookieStr);
                        var newArr = [];
                        for(var i = 0; i < cookieArr.length; i++){
                            for(var j = 0; j < arr.length; j++){
                                if(cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid){
                                    arr[j].num = cookieArr[i].num;
        
                                    //设置商品id一致
                                    arr[j].id = arr[j].product_id ? arr[j].product_id : arr[j].goodsid;
                                    newArr.push(arr[j]);
                                }
                            }
                        }

                        // console.log(newArr)
                        // 通过循环，把加入购物车的数据添加在页面上
                        for(i = 0; i < newArr.length; i++){
                            var node = $(` <div class="item-row clearfix" id = ${newArr[i].id}> 
                            <div class="col col-check">  
                                <i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="2192300031_0_buy" data-status="1">√</i>  
                            </div> 
                            <div class="col col-img">  
                                <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                    <img alt="" src="${newArr[i].image}" width="80" height="80"> 
                                </a>  
                            </div> 
                            <div class="col col-name">  
                                <div class="tags">   
                                </div>     
                                <div class="tags">  
                                </div>   
                                <h3 class="name">  
                                    <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                        ${newArr[i].name}
                                    </a>  
                                </h3>        
                            </div> 
                            <div class="col col-price"> 
                                ${newArr[i].price}元 
                                <p class="pre-info">  </p> 
                            </div> 
                            <div class="col col-num">  
                                <div class="change-goods-num clearfix J_changeGoodsNum"> 
                                    <a href="javascript:void(0)" class="J_minus">
                                        <i class="iconfont"></i>
                                    </a> 
                                    <input tyep="text" name="2192300031_0_buy" value="${newArr[i].num}" data-num="1" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum" "=""> 
                                    <a href="javascript:void(0)" class="J_plus"><i class="iconfont"></i></a>   
                                </div>  
                            </div> 
                            <div class="col col-total"> 
                                ${(newArr[i].price * newArr[i].num).toFixed(1)}元 
                                <p class="pre-info">  </p> 
                            </div> 
                            <div class="col col-action"> 
                                <a id="2192300031_0_buy" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont"></i></a> 
                            </div> 
                        </div> `);
                        node.appendTo($("#J_cartListBody .J_cartGoods"));
                        }
                        isCheckAll();
                        // loadCarData();
                        // alert(123);
                    }
                     
                }) 
           }) 
        }




    function download(){
        $.ajax({
            url:"../data/goodsCarList.json",
            type:"get",
            success:function(obj){
                // alert(obj)
                var arr = obj.data;
                for(i = 0; i < arr.length ; i++){
                    $(`<li class="J_xm-recommend-list span4">    
                    <dl> 
                        <dt> 
                            <a href="#"> 
                                <img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="小米净水器1A（厨下式）"> 
                            </a> 
                        </dt> 
                        <dd class="xm-recommend-name"> 
                            <a href="#"> 
                                ${arr[i].name}
                            </a> 
                        </dd> 
                        <dd class="xm-recommend-price">${arr[i].price}元</dd> 
                        <dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
                            <a class="btn btn-small btn-line-primary J_xm-recommend-btn" href="#" style="display: none;" id = "${arr[i].goodsid}">加入购物车</a>  
                        </dd> 
                        <dd class="xm-recommend-notice">

                        </dd> 
                    </dl>  
                </li>`).appendTo($("#J_miRecommendBox .xm-recommend ul.row"));
                }
            },
            error:function(msg){
                console.log(msg)
            }
        })
    }
        //添加移入移出效果，显示加入购物车按钮
        function carHover(){
            $("#J_miRecommendBox .xm-recommend ul.row").on("mouseenter", ".J_xm-recommend-list", function(){
                $(this).find(".xm-recommend-tips a").css("display", "block");
            })
            $("#J_miRecommendBox .xm-recommend ul.row").on("mouseleave", ".J_xm-recommend-list", function(){
                $(this).find(".xm-recommend-tips a").css("display", "none");
            });

            // 通过事件委托实现加入购物车操作
            $("#J_miRecommendBox .xm-recommend ul.row").on("click", ".xm-recommend-tips .btn", function(){
                var id  = this.id;

                var first = $.cookie("goods") == null ? true : false;
            if(first){
                var cookieArr = [{id:id,num:1}];
                $.cookie("goods", JSON.stringify(cookieArr),{
                    expires:7
                    })
                }else{
                    // 判断之前是否添加过
                    var same = false;
                    var cookieStr = $.cookie("goods");
                    var cookieArr = JSON.parse(cookieStr);
                    for(var i = 0; i< cookieArr.length; i++){
                        if(cookieArr[i].id == id){
                            cookieArr[i].num++;
                            same = true;
                            break;
                        }
                    }
                    if(!same){
                        var obj = {id:id , num:1};
                        cookieArr.push(obj);
                    }
                    $.cookie("goods",JSON.stringify(cookieArr),{
                        expires:7
                    })
                }
                // alert($.cookie("goods"));
                // isCheckAll();
                loadCarData();
                return false;
            });
        }

        //全选按钮 和 单选按钮的点击实现
        function checkFunc(){
            $(".list-head .col-check").find("i").click(function(){

                // 获取每个商品自己的选项框
                var allChecks = $(".list-body").find(".item-row").find(".col-check i");
                if($(this).hasClass("icon-checkbox-selected")){
                    // 把获取到的选项框，与这次点击事件绑定在一起，实现全选与全取消。
                    $(this).add(allChecks).removeClass("icon-checkbox-selected");
                    
                }else{
                    $(this).add(allChecks).addClass("icon-checkbox-selected");
                }

            isCheckAll();
            return false;
            })

            //给每一个商品的复选框设置

            $("#J_cartListBody .J_cartGoods").on("click", ".col-check i", function(){
                if($(this).hasClass("icon-checkbox-selected")){
                    $(this).removeClass("icon-checkbox-selected");
                }else{
                    $(this).addClass("icon-checkbox-selected");
                }
                isCheckAll();
                return false;
            })


        }

        // 判断有多少个被选中
        function isCheckAll(){
            var allChecks = $(".list-body").find(".item-row");
        
            var isAll = true;
            var total = 0; 
            var count = 0;//记录被选中的数量
            var totalCount = 0; //记录总数
            allChecks.each(function(index, item){
           
            if(!$(item).find(".col-check i").hasClass("icon-checkbox-selected")){
                // 判断这个商品没有被选中。
                isAll = false;
            }else{ // html()拿到价格内容    trim()将首尾空格删掉
                total += parseFloat($(item).find(".col-price").html().trim()) * parseFloat($(item).find(".col-num input").val());
                // 计算被选中的商品
                count += parseInt($(item).find(".col-num input").val());
            }
            
            // 计算在购物车里面的商品
            totalCount += parseInt($(item).find(".col-num input").val());
            });
            //设置总价
            $("#J_cartTotalPrice").html(total);
            $("#J_selTotalNum").html(count);
            $("#J_cartTotalNum").html(totalCount);

            //判断是否全选
            if(isAll){
                $(".list-head .col-check").find("i").addClass("icon-checkbox-selected");
            }else{
                $(".list-head .col-check").find("i").removeClass("icon-checkbox-selected");
            }
        }

        // 给购物车上面添加删除增减操作
        function changeCars(){
            //给每一个删除按钮添加事件
            $("#J_cartListBody .J_cartGoods").on("click", ".col-action .J_delGoods", function(){
                //删除页面上的数据，并且
                var id = $(this).closest(".item-row").remove().attr("id");
                //在cookie中删除数据
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                for(var i = 0; i < cookieArr.length; i++){
                    if(id == cookieArr[i].id){
                        //删除数据
                        cookieArr.splice(i, 1);
                        break;
                    }
                }
    
                cookieArr.length == 0 ? $.cookie("goods", null) : $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7
                })
                isCheckAll();
    
                return false;
                
            })
    
            //给每一个+和-添加事件
            $("#J_cartListBody .J_cartGoods").on("click", ".J_minus,.J_plus", function(){
                //1、先找出当前+和-按钮所在商品的id
                var id = $(this).closest(".item-row").attr("id");
                //找出cookie
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        //说明该用户找到了
                        if(this.className == "J_minus"){
                            //数量-1
                            cookieArr[i].num == 1 ? alert("数量已经为1，不能再减少！") : cookieArr[i].num--;
                        }else{
                            cookieArr[i].num++;
                        }
                        break;
                    }
                }
                //更新页面上的数量
                // alert(cookieArr[0].id);
                $(this).siblings("input").val(cookieArr[i].num);

                //更新页面上的单个商品价格
                var price = parseFloat($(this).closest(".col-num").siblings(".col-price").html().trim());
                $(this).closest(".col-num").siblings(".col-total").html((price * cookieArr[i].num).toFixed(1) + "元");
    
                //最后将更改后的数据存储到cookie中
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7
                })
    
                //每次更改一次数据，重新计算一次总价
                isCheckAll();
    
                return false;
            })
        }



    return{
        download:download,
        carHover:carHover,
        loadCarData:loadCarData,
        checkFunc:checkFunc,
        isCheckAll:isCheckAll,
        changeCars:changeCars,

    }
});