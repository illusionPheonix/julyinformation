var express = require('express');
var router = express.Router();

//连接数据库
const connection = require('./js/connect');
//引入jwt
const jwt = require('jsonwebtoken');
//引入express-jwt
const expressJwt = require('express-jwt')

//设置响应头
router.all('*',(req,res,next)=>{
    // 设置响应头解决跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
//  放行
    next();
})

/*---------验证token合法性------*/
//准备一个签名（密钥）
const secretKey = 'qikesystem';
//验证token的合法性，设置需要保护的API
router.use(expressJwt({
    secret:secretKey
}).unless({
    path:['/login/checklogin']//排除掉这个地址，其他的url都需要验证（其他的请求都要带上token，才能获得数据，否则不能得到数据）
}));
//路由器拦截,校验token失败时的处理
router.use((err,req,res,next)=>{
//    如果前端发送的请求没有token或者是错误的token就抛出错误
    if(err.name==="UnauthorizedError"){
        res.status(401).send({code:2,msg:"登录过期，请重新登录！"})
    }
})
/*---------验证token合法性------*/

//增加课程
router.post('/courseadd',(req,res)=>{
  //接收传过来的数据
    let { courseName ,coursePeriod,courseFees,CourseLength,fitStudent,courseDesc,initiateMode  } = req.body;
//    写sql
    const sqlStr = `insert into coursedata(coursename,courseperiod,coursefees,fitstudent,Courselength,coursedesc,initiatemode) values('${courseName}','${coursePeriod}','${courseFees}','${fitStudent}','${CourseLength}','${courseDesc}','${initiateMode}') `;
//    执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:"添加数据成功"});
        }else {
            res.send({code:0,msg:"添加数据失败"});
        }
    })
})
//分页刷新列表
router.get('/coursemanage',(req,res)=>{
    //接收前端传过来的参数
    let {pageSize,currentPage}=req.query;
    //准备sql
    let sqlStr = "select * from coursedata order by create_time desc";
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        // 获得总条数
        let total=data.length;
        //    跳过多少条
        let n=(currentPage-1)*pageSize;
        //    每页显示多少条
        let m=pageSize;
        //    写sql
        sqlStr+=` limit ${n},${m}`
        // 执行sql
        connection.query(sqlStr,(err,data)=>{
            if(err) throw err;
            //    发送数据回前端
            res.send({total,data});
        })
    })
})
//删除数据
router.get('/coursedel',(req,res)=>{
    // 获取前端传过来的参数
    let {id}=req.query;
    //    写sql
    const sqlStr=`delete from coursedata where id='${id}'`;
    console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:"删除数据成功"})
        }else {
            res.send({code:1,msg:"删除数据失败"})
        }
    })
})
//修改回填数据
router.get('/editcourse',(req,res)=>{
    //    接收参数
    let {id}=req.query;
    //    写sql
    const sqlStr=`select * from coursedata where id=${id}`;
    //    执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
})
//保存数据
router.post('/savecourse',(req,res)=>{
    // 接收参数
    let { id,coursename,courseperiod,coursefees,Courselength,fitstudent,coursedesc,initiatemode} = req.body;
//    写sql
    const sqlStr = `update coursedata set coursename="${coursename}",courseperiod="${courseperiod}",coursefees="${coursefees}",Courselength="${Courselength}",fitstudent="${fitstudent}",coursedesc="${coursedesc}",initiatemode="${initiatemode}" where id=${id}`;
    console.log(sqlStr);
//    执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:"修改数据成功"});
        }else {
            res.send({code:0,msg:"修改数据失败"});
        }
    })
})
//批量删除
router.get('/batchdel',(req,res)=>{
//    接收参数
    let {ids}=req.query;
//    写sql
    const sqlStr =`delete from coursedata where id in (${ids})`;
    console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:"批量删除成功"})
        }else {
            res.send({code:1,msg:"批量删除失败"})
        }
    })
})


module.exports = router;
