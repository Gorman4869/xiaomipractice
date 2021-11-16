// 处理首页导航部分 声明模块要遵从AMD规范

define([
    'jquery'
], function($) {
    function download(){
        $.ajax({
            type:"get",
            url: "../data/nav.json",
            success:function(result){
                var bannerArr = result.banner;// 通过get请求在URL下的数据拿到，然后放在result里面
                for(var i = 0; i <bannerArr.length; i++){
                    $(`<a href="${bannerArr[i].url}">
                    <img class="swiper-lazy swiper-lazy-loaded" src="../images/banner/${bannerArr[i].img}" alt="">
                </a>`).appendTo("#J_homeSwiper .swiper-slide");

                    var node = $(`<a href="#" class = 'swiper-pagination-bullet'></a>`)
                    if(i==0){
                        node.addClass("swiper-pagination-bullet-active")
                    }
                    node.appendTo("#J_homeSwiper .swiper-pagination")
                }
            },
            error:function(msg){
                console.log(msg);
            }
        });
        leftNavDownload();
        topNavDownload();
    }

    // 实现轮播图的轮播效果
    function banner(){
        var iNow = 0; // 当前显示图片的下标
        var aImags = null;//记录图片
        var aBtns = null;//记录小图标
        var timer = setInterval(function(){
            iNow++;
            tab();
        },2500);

        // 封装个切换函数
        function tab(){
            if(!aImags){
                aImags = $("#J_homeSwiper .swiper-slide").find("a");
            }
            if(!aBtns){
                aBtns = $("#J_homeSwiper .swiper-pagination").find("a");
            }
            if(iNow == 5){
                iNow = 0;
            }
            
            //图片切换
            aImags.hide().css("opacity",0.2).eq(iNow).show().animate({opacity:1},500);
            // 小圆点的切换
            aBtns.removeClass("swiper-pagination-bullet-active").eq(iNow).addClass("swiper-pagination-bullet-active");

        }

        // 添加鼠标的移入移出
        $("#J_homeSwiper,.swiper-button-prev,.swiper-button-next").mouseenter(function(){
            clearInterval(timer);
        })
        $("#J_homeSwiper,.swiper-button-prev,.swiper-button-next").mouseleave(function(){
            // clearInterval(timer);
            timer = setInterval(function(){
                iNow++;
                tab();
            },2500);
        })

        // 点击小圆圈，实现图片切换
        // 这些小圆圈是通过ajax异步加载进来的，是在下面这行代码执行完后才加载进来的。
        //直接添加点击事件给给小圆圈（a标签）是后添加事件，是无法执行的
        // alert($("#J_homeSwiper .swiper-pagination").find("a").size()) 得出的结果是0；
        // 解决这类问题，可以通过事件委托，给后添加的节点添加点击事件——先找到其父节点，通过委托，让子节点响应
        $("#J_homeSwiper .swiper-pagination").on("click","a",function(){
            iNow = $(this).index();
            tab();
            return false;//阻止a标签默认行为
        })
        $(".swiper-button-prev,.swiper-button-next").click(function(){
            if(this.className == "swiper-button-prev"){
                iNow--;
                if(iNow == -1){
                    iNow = 4;
                }
            }else{
                iNow++;
            }
            tab();
        })
    }

    function leftNavDownload(){
        $.ajax({
            url:"../data/nav.json",
            // type:"get",
            success:function(result){
                var sideArr = result.sideNav;
                for(var i = 0; i<sideArr.length;i++){
                    var node = $(`<li class = 'category-item'>
                    <a href="/index.html" class = 'title'>
                        ${sideArr[i].title}
                        <em class = 'iconfont-arrow-right-big'></em>
                    </a>
                    <div class="children clearfix children-col-4">

                    </div>
                </li>`)
                    node.appendTo('#J_categoryList')

                    // 取出当前这个选项对应的子节点
                    var childArr = sideArr[i].child;
                    var col = Math.ceil(childArr.length / 6);//六个一列，向上取整，7个就是两列
                    node.find("div.children").addClass("children-col-" + col);//找到属性为children的div标签
                    // 通过循环，创建右侧上面的每一个数据
                    for(var j = 0;j< childArr.length;j++){
                        if(j%6 ==0){
                            var newUl =$(`<ul class="children-list children-list-col children-list-col-${parseInt(j/6)}">

                        </ul>`)
                            newUl.appendTo(node.find("div.children"));
                        }
                         $(`<li>
                        <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                            <img src="${childArr[j].img}" width="40" height="40" alt="" class="thumb">
                            <span class="text">${childArr[j].title}</span>
                        </a>
                    </li>`).appendTo(newUl)
                    }

                }
            },
            error:function(msg){
                console.log(msg)
            }
        })
    }

    // 给侧边导航添加移入移出效果，即使选项卡
    function leftNavTab(){
        // 通过事件委托，来给侧边栏添加移入移出事件
        $("#J_categoryList").on("mouseenter",".category-item" ,function(){
            $(this).addClass("category-item-active");
        })
        $("#J_categoryList").on("mouseleave",".category-item" ,function(){
            $(this).removeClass("category-item-active");
        })
    }

    // 下载顶部导航数据
    function topNavDownload(){
        $.ajax({
            url:"../data/nav.json",
            success:function(result){
                var topNavArr = result.topNav;
                topNavArr.push({title:"服务"},{title:"社区"});
                for(var i = 0; i < topNavArr.length;i++){
                    $(`<li data-index="${i}" class="nav-item">
                    <a href="javascript: void(0);" class="link">
                        <span class="text">${topNavArr[i].title}</span>
                    </a>
                </li>`).appendTo(".site-header .header-nav .nav-list");

                    var node =$(`<ul class="children-list clearfix" style="display: ${i==0 ? "block":"none"}"> </ul>`)
                    node.appendTo("#J_navMenu .container")

                // 取出所有子菜单
                    if(topNavArr[i].childs){
                        var childArr = topNavArr[i].childs;
                        for(j = 0; j< childArr.length; j++){
                            $(`<li>
                            <a href="#">
                                <div class="figure figure-thumb">
                                    <img src="../images/${childArr[j].img}" alt="">
                                </div>
                                <div class="title">${childArr[j].a}</div>
                                <p class="price">${childArr[j].i}</p>
                            </a>
                        </li>`).appendTo(node);
                        }
                    }
                }


            },
            error:function(msg){
                console.log(msg);
            }
        })
    }

    // 顶部导航的添加移入移出效果
    function topNavTab(){
        $(".header-nav .nav-list").on("mouseenter",".nav-item",function(){
            $(this).addClass("nav-item-active");
            // 找出当前移入这个a标签的下标，这个下标和下面部分显示的ul下标一致；
            var index = $(this).index() - 1;
            // alert(index)

            // $("#J_navMenu").css({display:"block"}).removeClass("slide-up").addClass("slide-down");
            $("#J_navMenu .container").find("ul").eq(index).css({display:"block"}).siblings("ul").css({display:"none"});
            $("#J_navMenu").css({display:"block"}).slideDown(2000).removeClass("slide-up").addClass("slide-down");

            
            if(index>6){
                $("#J_navMenu").css({display:"none"}).removeClass("slide-down").addClass("slide-up")
            };


        })
        $(".header-nav .nav-list").on("mouseleave",".nav-item",function(){
            $(this).removeClass("nav-item-active");
        })
        $(".site-header").mouseleave(function(){
            $("#J_navMenu").css({display:"none"}).removeClass("slide-down").addClass("slide-up")
        })
    }

    // 搜索框
    function searchTab(){
        $("#search").focus(function(){
            $("#J_keywordList").removeClass("hide").addClass("show");
        }).blur(function(){
            $("#J_keywordList").removeClass("show").addClass("hide");
        })
    }

    //给list.html的侧边栏添加移入移出效果
    function allGoodsTab(){
        $(".header-nav .nav-list").on("mouseenter",".nav-category",function(){
            $(this).addClass("nav-category-active");
            $(this).find(".site-category").css("display","block");
            // $(this).find(".site-category").css({display:"block"}).slideDown(2000).removeClass("slide-up").addClass("slide-down");
            $("#J_navMenu").css({display:"none"}).removeClass("slide-down").addClass("slide-up")
            
        })
        $(".header-nav .nav-list").on("mouseleave",".nav-category",function(){
            $(this).removeClass("nav-category-active");
            $(this).find(".site-category").css("display","none");
        })
    }

    return {
        download:download,
        banner:banner,
        leftNavTab:leftNavTab,
        topNavTab:topNavTab,
        searchTab:searchTab,
        leftNavDownload:leftNavDownload,
        topNavDownload:topNavDownload,
        allGoodsTab:allGoodsTab,

    }// 暴露函数，便于外面调用（maim.js里面调用)
});