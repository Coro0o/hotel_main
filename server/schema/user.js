//导入定义验证规则的包
const joi = require('joi')

//定义验证规则

const username = joi.string().alphanum().min(5).max(12).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const avatar = joi.string().dataUri().required()
const id = joi.number().integer().min(1).required()
const nickname = joi.string()
const phone = joi.number()
const email = joi.string()
//定义验证登录和注册的表单数据规则对象

exports.login_schema = {
    body: {
        username,
        password,
    }
}
//更新密码
exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

//体图像验证规则
// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
    body: {
        avatar,
    },
}
// exports.update_userinfo_schema = {
//     body: {
//         id,
//         nickname,
//         phone,
//         email
//     },
// }