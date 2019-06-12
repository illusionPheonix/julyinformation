<template>
    <div class="top">
        <!-- 分栏 -->
        <el-row :gutter="20">
            <!-- 标题 -->
            <el-col :span="20">
                <h3><span class="el-icon-location"></span>成都新思维学校欢迎您！</h3>
            </el-col>
            <!-- 头像&设置 -->
            <el-col :span="4">
                <el-row :gutter="20">
                    <!-- 头像 -->
                    <el-col :span="8">
                        <div class="avatar">
                            <img :src="avatarUrl" alt="">
                        </div>    
                    </el-col>
                    <!-- 下拉菜单 -->
                    <el-col :span="16">
                        <el-dropdown @command="handleCommand" placement="top">
                            <span class="el-dropdown-link">
                                {{user}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                 </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// 引入local
import local from '@/utils/local/local';
export default {
    data(){
        return{
            avatarUrl:require("./ldy.jpg"),
            user:""
        }
    },
    methods:{
        // 下拉菜单
        handleCommand(command) {
            // 判断点击的是哪个框
            // 个人中心
            if(command ==="personalCenter" ){
                // 跳转路由
                this.$router.push('/home/personal');
            }else if(command==="logout"){//退出登录
                // 清除token
                local.remove('qike_2019_system');
                // 弹出退出提示
                this.$message({
                    type:"success",
                    message:"退出成功，江湖再见！",
                    duration:1000
                })
                // 跳转路由
                setTimeout(()=>{
                    this.$router.push('/login');
                },1000)
            }
        },
        getStaffInfo(){
            // 发送请求
            this.request.get('staff/staffinfo')
            .then(res=>{
              let { name,imgurl }=res;
              this.user=name;
              this.avatarUrl=`http://172.16.11.177:666/${imgurl}`;
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        // 调用函数，获取当前账号
        this.getStaffInfo();
    }
}
</script>

<style lang="less">
    @import "./top.less";
</style>


