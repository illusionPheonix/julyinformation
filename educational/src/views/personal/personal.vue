<template>
    <div class="personal">
         <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span class="iconfont icon-guanli"></span>
                <span>个人中心</span>
            </div>
            <div class="text item">
                <!-- 头像上传 -->
                <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :http-request="upLoad"
                :before-upload="beforeAvatarUpload">
                     <!-- 图像 -->
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" title="点击换头像">
                    <!-- 图标 -->
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <!-- 用户信息 -->
                <div class="staffInfo">
                    <p>账号：{{staffinfo.account}}</p>
                    <p>姓名：{{staffinfo.name}}</p>
                    <p>性别：{{staffinfo.sex}}</p>
                    <p>出生年月：{{staffinfo.birthdate}}</p>
                    <p>入职日期：{{staffinfo.entrydate}}</p>
                    <p>工作职位：{{staffinfo.staffgrounp}}</p>
                    <p>电话号码：{{staffinfo.tel}}</p>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入axios
import axios from 'axios';
export default {
    data() {
      return {
        staffinfo:"",//员工信息
        imageUrl: ''
      };
    },
    methods: {
        // 获取信息函数
        getStaffInfo(){
            this.request.get('staff/staffinfo')
            .then(res=>{
                this.staffinfo=res;
                this.imageUrl=`http://172.16.11.177:666${res.imgurl}`
            })
            .catch(err=>{
                console.log(err);
            })
        },
    //   上传之前做判定
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 自定义上传
        upLoad(file){
            // 创建一个formData对象
            let formData = new FormData();
            // 被文件数据放入formdata中
            formData.append('file',file.file);
            // 发送请求，把文件传递给后端
            axios.post('/staff/uploadavatar',formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response=>{
                // 接收后端响应回来的数据
                let {code,reason,path}=response.data;
                if(code===0){
                     this.$message({
                      type: 'success',
                      message: reason
                  })
                //   回填头像
                this.imageUrl=`http://172.11.16.177:666${path}`;
                // 触发父组件
                this.$emit('upload');
                }else if(code===1){
                     this.$message.error(reason)
                }
                
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        this.getStaffInfo();
    }
}
</script>
<style lang="less">
    @import 'personal.less';
</style>
