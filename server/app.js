const express = require('express')
const expressJWT = require('express-jwt')
const joi = require('@hapi/joi')
var querystring = require('querystring');
const app = express()

//导入cors
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())

app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
//res.send的中间件,因为大量使用res.send，所以进行封装(res.cc)
app.use((req, res, next) => {
    //state默认为1，表示失败，err可能是错误对象，也可能是自己定义的字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

const config = require('./config')

//只要携带api的都不需要验证token
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [{
        url: '/api/login',
        method: ['GET', 'POST']
    }, {
        url: '/api/resgister',
        method: ['GET', 'POST']
    },
    ]
}))

//导入用户路由模块
const userRouter = require('./router/user');
const { hostname } = require('os');
app.use('/api', userRouter)
//定义错误级别中间件
app.use((err, req, res, next) => {

    if (err instanceof joi.ValidationError) return res.cc('66666')
    //位置错误
    if (err.name === 'UnauthorizedError') return res.cc(401, '身份验证失败，要token')
    return res.cc(err)
})
const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`,))