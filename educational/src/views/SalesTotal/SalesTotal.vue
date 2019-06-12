<template>
    <div class="SalesTotal">
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span class="iconfont icon-xiaoshoubaobiao"></span>
                <span>销售统计</span>
            </div>
            <div class="text item">
               <!-- 筛选器 -->
                <div class="time">
                    时间：
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
                    <el-button type="info" size="small">查询</el-button>   
                </div>
                <!-- 统计表 -->
                <div class="charts">
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 事件选择器
            pickerTime:"",
            pickerOptions: {
                shortcuts: [
                {
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
                 }
                 ]
            },
        }
    },
    methods:{
        drawSalesCharts(categoryData=[],value=[]){
             // 初始化
        const mycharts = this.echarts.init(document.querySelector(".charts"));
        // 写配置
        let option = {
            tooltip: {},
            legend: {
                data:['销量'],
                borderColor:"red"
            },
            xAxis: {
                data: categoryData
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: value
            }]
        }
       //   使用配置生成报表
        mycharts.setOption(option);   
        }
    },
    // 操作dom
    mounted(){
    //后端响应回来的数据
    let res={
        categoryData:['04/01','04/02','04/03','04/04','04/05','04/06'],
        value:[30,60,40,50,50,80]
    } 
    // 解构参数
    let { categoryData,value }=res;
    //    调用函数生成报表
    this.drawSalesCharts(categoryData,value);    
    }
}
</script>

<style lang="less">
 @import "./SalesTotal.less";
</style>
