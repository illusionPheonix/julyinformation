<template>
    <div class="asideNav">
        <!-- logo -->
        <div class="logo">
            <img :src="logo" >
        </div>
        <!-- 导航目录 -->
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#32446e"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            unique-opened
            >
               <!-- 子菜单模板 -->
             <el-submenu :index="(index+1)+''" v-for="(menu,index) in menus" :key="index">
                <template slot="title">
                    <i :class="menu.icoClass"></i>
                    <span>{{menu.title}}</span>
                </template>
                <el-menu-item :index="submenu.path" v-for="(submenu,i) in menu.children" :key="i">{{submenu.subtitle}}</el-menu-item>
            </el-submenu>
        </el-menu>    
    </div>
</template>
<script>
export default {
    data(){
        return{
            leftImg:require("@/assets/img/rabbit.gif"),
            logo:require("@/assets/img/qike_ogo.png"),
            // 导航数据
            menus:[]
        }
    },
    methods:{
         handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        getMenus(){
            this.request.get('/staff/getmenus')
            .then(res=>{
               this.menus=res;
                
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        this.getMenus();
    }
}
</script>

<style lang="less">
   @import "./asideNav.less";
</style>
