<template>
    <div class="GiftExchange">
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span class="iconfont icon-guanli"></span>
                <span>礼品兑换</span>
            </div>
            <div class="text item">
                <div class="text item">
                    <el-form
                    :model="giftExchangeForm"
                    status-icon
                    :rules="rules"
                    ref="giftExchangeForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    size="small"
                    style="width:600px"
                    >
                        <!-- 学生编号 -->
                        <el-form-item label="学生编号" prop="stuNum">
                            <el-input type="text" style="width:280px" v-model="giftExchangeForm.stuNum" auto-complete="on"></el-input>
                            <span>{{studentname}}</span>  
                            <span style="margin-left:20px">{{studentscore}}</span> 
                        </el-form-item>
                        <!-- 礼品码 -->
                        <el-form-item label="礼品码" prop="giftCode">
                            <el-input type="text" v-model="giftExchangeForm.giftCode" style="width:280px" auto-complete="on"></el-input>
                        </el-form-item>
                        <!-- 数量 -->
                        <el-form-item label="数量" prop="saleNum">
                            <el-input-number 
                            v-model="giftExchangeForm.saleNum" 
                            :min="1" 
                            label="描述文字">
                            </el-input-number>
                        </el-form-item>
                        <!-- 按钮组 -->
                        <div class="btn">
                            <el-form-item>
                            <el-button type="success" @click="submitForm('giftExchangeForm')">加入订单</el-button>
                            <el-button @click="resetForm('giftExchangeForm')">重置</el-button>
                        </el-form-item>
                        </div>       
                    </el-form>
                </div>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="giftTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    header-align="center"
                    show-summary
                    :summary-method="getSummaries"
                >
                    <!-- 礼品名称 -->
                    <el-table-column
                    prop="giftname"
                    label="礼品名称"
                    align="center"
                    >
                    </el-table-column>
                     <!--礼品码  -->
                    <el-table-column
                    prop="giftcode"
                    align="center"
                    label="礼品码"
                    show-overflow-tooltip>
                    </el-table-column>
                    <!--礼品所需积分  -->
                    <el-table-column
                    prop="costscore"
                    align="center"
                    label="礼品所需积分"
                    show-overflow-tooltip>
                    </el-table-column>
                     <!--数量  -->
                    <el-table-column
                    prop="outnum"
                    align="center"
                    label="数量"
                    show-overflow-tooltip>
                    </el-table-column>
                      <!--小计  -->
                    <el-table-column
                    prop="total"
                    align="center"
                    :span-method="getSummary"
                    show-summary
                    label="小计(积分)"
                    show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入验证函数
import { feesReg } from "@/utils/validator/validator.js";
export default {
    data(){
         // 礼品码验证
        const validateCode=(rule, value, callback) => {
            if(!value){
                callback(new Error("礼品码不能为空"));//输出错误提示
            }else if(!feesReg(value)){
                callback(new Error("礼品码必须为大于0的正整数"));//输出错误提示
            }else{
                // 发送请求判断礼品码是否正确
                let params = {
                    code:this.giftExchangeForm.giftCode
                }
                // 发送
                this.request.get('/gift/checkcode',params)
                .then(res=>{
                    // 接收后端传回来的数据
                    let { code,data }=res;
                    if(code===0){
                        // 将data数据赋值给currentGift
                        this.currentGift=data;                        
                        callback();
                    }else if(code===1){
                        callback(new Error(data));//输出错误提示
                    } 
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
        // 验证数量
        const validateNum=(rule, value, callback) =>{
            // 获取当前商品的库存
            let number = this.currentGift.stocknum;
            // 判断数量和库存做对比
            if(number<value){
                callback(new Error("库存不足"));//输出错误提示
            }else{
                callback();
            }     
        }
        // 验证学生编号
        const validateStuNum=(rule, value, callback)=>{
            if(!value){
                callback(new Error("学生编号不能为空"));//输出错误提
            }else{
                // 发送请求到后端去验证该学生是否存在
                let params = {
                    stunum:this.giftExchangeForm.stuNum
                }
                // 发送
                this.request.post('/gift/checkstudent',params)
                .then(res=>{
                    // 接收后端传回来的数据
                    let { code,data }=res;
                    if(code===0){
                        // currentStudent
                        this.studentname=data.name; 
                        this.studentscore=data.score;                      
                        callback();
                    }else if(code===1){
                        callback(new Error(data));//输出错误提示
                    } 
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
        return{
            // 学生编号
            studentForm:{
                stuNum:""
            },
            // 商品交换
            giftExchangeForm:{
                giftCode:"",
                saleNum:"",
                stuNum:""
            },
            // 商品分类
            giftClassify:"",
            // 当前礼品
            currentGift:"",
            // 当前学生
            studentname:"",
            studentscore:"",
            // 关键字
            keyword:"",
            giftTableData: [],//存放礼品表格
            multipleSelection: [],
            // 默认页
            currentPage: 1,
              // 商品分类
            giftClassifyOptions: [
                {
                value: '学习用品',
                label: '学习用品'
                }, {
                value: '食品类',
                label: '食品类'
                }, {
                value: '代金券',
                label: '代金券'
                }, {
                value: '玩具类',
                label: '玩具类'
                }, {
                value: '电子产品',
                label: '电子产品'
                }, {
                value: '日用品',
                label: '日用品'
                }
            ],  
            // 验证规则
            rules:{
                // 礼品码验证
                giftCode:[
                     {required:true,validator: validateCode,trigger: 'blur'}
                ],
                // 数量验证
                saleNum:[
                    {required:true,validator: validateNum, trigger: 'change'}
                ],
                 // 学生编号验证
                stuNum:[
                    {required:true,validator:validateStuNum, trigger: 'blur'}
                ]
            } ,
        }
    },
    methods:{
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
          // 重置按钮事件
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
          //   提交按钮事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                // 如果成功
            if (valid) {
                // 提交数据给后端
                let params = {
                    giftname: this.currentGift.giftname,
                    giftcode:this.giftExchangeForm.giftCode,
                    costscore:this.currentGift.costscore,
                    outnum :this.giftExchangeForm.saleNum,
                    total :this.currentGift.costscore*this.giftExchangeForm.saleNum,
                    id:this.currentGift.id,//商品id，用作库存减少操作
                    stocknum:this.currentGift.stocknum-this.giftExchangeForm.saleNum,
                    studentnum:this.giftExchangeForm.stuNum,
                    studentname:this.studentname,
                    studentscore:this.studentscore-this.currentGift.costscore*this.giftExchangeForm.saleNum
                };                     
                //向后端发送数据
                    this.request.post('/gift/giftsaleout',params)    
                    .then(res=>{
                        console.log(res);
                        
                        // 接收数据
                        let { code,score } = res;
                        if(code===0){
                            this.giftTableData.push(params);
                            this.studentscore=score;
                        }else if(code===1){
                            this.$message.error("添加错误");
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            } else {
                return false;
            }
            });
        },
        // 合计
       getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(index === 1|index === 2){
            sums[index] = '';
            return;
          }
          let values = data.map(item => Number(item[column.property]));          
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' ';
          } else {
            sums[index] = '';
          }
        });
        return sums;
        },
    },
    computed:{
        getSummary(){
            this.giftTableData.forEach(val=>{
               val.saleTotal = val.costScore*val.saleNum;            
            })    
      }
    }
}
</script>


<style lang="less">
 @import "./GiftExchange.less";
</style>
