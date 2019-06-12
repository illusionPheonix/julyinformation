<template>
    <div class="GiftExchangeManage">
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span class="iconfont icon-guanli"></span>
                <span>礼品管理</span>
            </div>
            <div class="text item">
                <!-- 筛选器 -->
                <div class="filterBox">
                    <div class="time">
                        时间查询：
                        <el-date-picker
                            v-model="pickerTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="small"
                            align="right">
                        </el-date-picker>
                    </div>
                    <!-- 关键字 -->
                    关键字：
                    <el-input type="text" v-model="keyword" auto-complete="off" size="small" placeholder="礼品名称，学生姓名"></el-input>
                    <el-button type="info" size="small" @click="getListByPages">查询</el-button>    
                </div>
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="giftTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    header-align="center"
                >
                   <!-- 订单号 -->
                    <el-table-column
                    prop="ordernum"
                    label="订单号"
                    align="center"
                    >
                    </el-table-column>
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
                    <!--单个积分  -->
                    <el-table-column
                    prop="costscore"
                    align="center"
                    label="单个积分"
                    show-overflow-tooltip>
                    </el-table-column>
                    <!--数量  -->
                    <el-table-column
                    prop="outnum"
                    align="center"
                    label="数量"
                    show-overflow-tooltip>
                    </el-table-column>
                      <!--支付积分  -->
                    <el-table-column
                    align="center"
                    prop="total"
                    label="支付积分"
                    show-overflow-tooltip>
                    </el-table-column>
                     <!--兑换学生  -->
                    <el-table-column
                    prop="studentname"
                    align="center"
                    label="兑换学生"
                    show-overflow-tooltip>
                    </el-table-column>
                    <!--兑换时间  -->
                    <el-table-column
                    prop="create_time"
                    align="center"
                    label="兑换时间"
                    show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[3, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes,prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data(){
        return{
            pickerTime:"",
            pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
            },
            // 商品分类
            giftClassify:"",
            currentPage: 1,//当前页码
            total:0,//总页数
            pageSize:3,//每页显示数量
            keyword:"",
            giftTableData: []
        }
    },
    methods:{
        getListByPages(){
             // 收集参数
            let params={
                pageSize:this.pageSize,
                currentPage:this.currentPage,
                pickerTime:this.pickerTime,
                keyword:this.keyword
            }
            // 向后端发送请求
            this.request.get('/gift/giftexchangelist',params)
            .then(res=>{
                // 接收后端发送回来的数据
                let {total,data}=res;
                // 改时间格式
                data.forEach(item => {
                    item.create_time=moment(item.create_time).format("YYYY/MM/DD")
                });
                // 赋值给页面总条数
                this.total=total;
                // 赋值给表格数据
                this.giftTableData=data;
                // 判断当前页中数据是否为空，或当前页是否为第一页
                if(data.length===0&&this.currentPage!==1){
                    this.currentPage-=1;
                    // 调用自己
                    this.getListByPages();
                }
            })
            .catch(err=>{
                console.log(err);              
            })
        },
        // 分页函数
        handleSizeChange(val) {
            // 获取每页显示数量
            this.pageSize=val;
            // 刷新页面
            this.getListByPages();
        },
        handleCurrentChange(val) {
             // 获取当前页
            this.currentPage=val;
            // 刷新页面
            this.getListByPages();
        }
    },
    // 钩子函数
    created(){
        this.getListByPages()
    }
}
</script>


<style lang="less">
 @import "./GiftExchangeManage.less";
</style>
