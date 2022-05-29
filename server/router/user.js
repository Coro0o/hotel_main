const express = require('express');
const router = express.Router()

//注册新用户 导入对应对应得处理模块
const user_handler = require('../router_handler/user')
//导入验证中间件
const expressjoi = require('@escook/express-joi')
const { login_schema } = require('../schema/user')
const { update_password_schema } = require('../schema/user')
const { update_avatar_schema } = require('../schema/user')
const { update_userinfo_schema } = require('../schema/user')

//用户登录
router.post('/resgister', expressjoi(login_schema), user_handler.resgister)
//用户注册
router.post('/login', expressjoi(login_schema), user_handler.login)
//获取全部房间数据
router.get('/my/getAll', user_handler.getAll)
//删除房间数据
router.get('/my/dele/:id', user_handler.dele)
//删除guest数据
router.get('/my/delegu/:id', user_handler.delegu)
//获取guest数据
router.get('/my/getguest', user_handler.getguest)
//添加guest
router.post('/my/addguest', user_handler.addguest)
//添加home数据
router.post('/my/addhome', user_handler.addhome)
router.get('/my/getadmin', user_handler.getadmin)
//更新个人密码
router.post('/my/updatepwd', expressjoi(update_password_schema), user_handler.updatepwd)
//删除信息
router.get('/my/deleadmin/:id', user_handler.deleadmin)
//更新个人图片
router.post('/my/avatar', expressjoi(update_avatar_schema), user_handler.avatar)
//获取个人信息 不需要携带参数，需要携带token
router.get('/my/GetOne', user_handler.GetOne)
//更新用户信息  姓名邮箱电话，邮箱可以不用
router.post('/my/updateUserInfo',  user_handler.updateUserInfo)
//更新单个房间信息
router.post('/my/updateRoomInfo',user_handler.updateRoomInfo)
//查询类型不重复
router.get('/my/GetType', user_handler.GetType)
//添加guest后减1
router.get('/my/lessone/:id',user_handler.lessone)
//完成订单 + 1 
router.post('/my/finish/',user_handler.finish)
// const router = express.Router()

// //注册新用户 导入对应对应得处理模块
// const user_handler = require('../router_handler/user')
// //导入验证中间件
// const expressjoi = require('@escook/express-joi')
// const { login_schema } = require('../schema/user')
// // 导入需要的验证规则对象
// const { login_schema, update_password_schema } = require('../schema/user')

// //用户登录
// router.post('/resgister', expressjoi(login_schema), user_handler.resgister)
// router.post('/login', expressjoi(login_schema), user_handler.login)
// router.get('/my/getAll', user_handler.getAll)
// router.get('/my/dele/:id', user_handler.dele)
// router.get('/my/delegu/:id', user_handler.delegu)
// router.post('/my/addhome', user_handler.addhome)
// router.get('/my/getguest', user_handler.getguest)
// router.get('/my/gettype', user_handler.gettype)
// router.get('/my/getadmin', user_handler.getadmin)
// router.post('/my/updatepwd', expressJoi(update_password_schema), user_handler.updatepwd)


module.exports = router