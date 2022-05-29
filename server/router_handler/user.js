//导入数据库操作模块
const db = require('../db/index')
//密码加密处理
const bcrypt = require('bcryptjs')
//导入中间件，避免每次重复使用res.send
const config = require('../config');
//导入token插件
const jwt = require('jsonwebtoken')
const { update_avatar_schema } = require('../schema/user')

exports.resgister = (req, res) => {
    //获取客户端发送到服务器得数据  body拿到get数据
    const userinfo = req.body;
    //拿到数据后进行判断
    if (!userinfo.username || !userinfo.password) {
        // res.send({
        //     status: 1,
        //     message: '用户名或密码不能为空'
        // })
        return res.cc('用户名或密码不能为空');
    }
    //校验合法后需要验证是否同名，sql查询
    const sqlStr = 'select * from user where username=?'
    //query后面第一个参数是执行得语句，第二个为sql语句中占位符(?),第三个为回调函数
    db.query(sqlStr, userinfo.username, (err, result) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        //判断用户名是否占用  select查询语句，返回得数据是符合条件得数据组成得数组
        if (result.length > 0) {
            // return res.send({ status: 1, message: '换一个用户名' })
            return res.cc('请换一个用户名')
        } else {
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)
            console.log(userinfo);
            //插入数据,密码需要加密
            const sql = 'insert into user set ?'
            db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
                if (err) {
                    //return res.send({ status: 1, message: err.message })
                    return res.cc(err)
                }
                if (results.affectedRows !== 1) {
                    //return res.send({ status: 1, message: '注册失败' })
                    return res.cc('注册失败')
                }
                //res.send({ status: 0, message: '注册成功' })
                return res.cc('注册成功', 0)
            })
        }
    })
    console.log(userinfo);
}
exports.login = (req, res) => {
    //取客户端发送过来得数据
    const userinfo = req.body;
    console.log(userinfo);
    //定义sql查询语句
    const sql = 'select * from user where username = ?';
    db.query(sql, userinfo.username, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 1) {
            return res.cc('登陆失败')
        }
        //判断数据库密码和传入的密码是否相等
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
        if (!compareResult) {
            return res.cc('用户名或密码不正确')
        }
        //生成token值
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname这四个属性的值
        const user = { ...result[0], password: '' }
        //对用户信息加密生成token，第一个参数是需要加密的对象，第二个是密钥，第三个是时间
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        console.log(user);
        return res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
        })

    })

}
exports.getAll = (req, res) => {
    //定义sql语句

    const sqlStr = 'select * from home';
    // const params = req.query
    //console.log(params)
    db.query(sqlStr, (err, result) => {
        if (err) {
            return res.cc('失败')
        }
        return res.json(result);
    })
}
//删除房间接口
exports.dele = (req, res) => {
    const params = req.params
    console.log(params.id);
    //sql语句
    const sql = 'set foreign_key_checks=0;delete from home where id=?;set foreign_key_checks=1;'
    db.query(sql, params.id, (err, result) => {
        if (err) {
            return res.cc(err.message)
        }
        return res.send({
            status: 0,
            message: '成功',
        })
    })
}
//删除人员接口
exports.delegu = (req, res) => {
    const params = req.params
    console.log(params.id);
    //sql语句
    const sql = 'set foreign_key_checks=0;delete from guests where id=?;set foreign_key_checks=1;'
    db.query(sql, params.id, (err, result) => {
        if (err) {
            return res.cc(err.message)
        }
        return res.send({
            status: 0,
            message: '成功了！！！',
        })
    })
}
//添加接口
exports.addhome = (req, res) => {
    const params = req.body
    console.log(params);
    const sqlstr = 'insert into home (h_type,price,state,text,num,homenum) values(?,?,?,?,?,?)';
    const addparams = [params.h_type, params.price, params.state, params.text, params.num,params.homenum]
    db.query(sqlstr, addparams, (err, result) => {
        if (err) {
            return res.cc(err.message)
        }
        return res.send({
            status: 0,
            message: '成功'
        })
    })
}

exports.getguest = (req, res) => {
    const sql = 'select * from guests';
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc('失败')
        }
        return res.json(result);
    })
}
exports.GetOne = (req, res) => {
    const sqlstr = `select id, username, email ,nickname,phone from user where id=?`;
    db.query(sqlstr, req.user.id, (err, result) => {
        if (err) {
            return res.cc(err.message)
        }
        if (result.length !== 1) return res.cc('获取用户信息失败！')
        return res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: result[0],
        })
    })
}
//获取type 
exports.gettype = (req, res) => {
    console.log('dadada');
    const sqlstr = 'select distinct  h_type from home ';
    db.query(sqlstr, (err, result) => {
        if (err) {
            return res.cc('失败')
        }
        return res.json(result);
    })
}
exports.getadmin = (req, res) => {
    const sqlstr = 'select *   from  user';
    db.query(sqlstr, (err, result) => {
        if (err) {
            return res.cc('失败')
        }
        return res.json(result);
    })
}
//更新用户密码
exports.updatepwd = (req, res) => {
    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select * from user where id=?`
    // 执行 SQL 语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        // 定义更新用户密码的 SQL 语句
        const sql = `update user set password=? where id=?`
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
}

//更新用户图像
exports.avatar = (req, res) => {
    const sql = 'update user set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}
exports.updateUserInfo = (req, res) => {
    const params = req.body
    console.log(params);
    const sql = `update user set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}
exports.updateRoomInfo = (req, res) => {
  const params = req.body
  console.log(params);
  const sql = `update home set ? where id=?`
  db.query(sql, [req.body, req.body.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 执行 SQL 语句成功，但影响行数不为 1
      if (results.affectedRows !== 1) return res.cc('修改房间基本信息失败！')
      // 修改用户信息成功
      return res.cc('修改房间基本信息成功！', 0)
  })
}
//添加guest
exports.addguest = (req, res) => {
  const params = req.body
  console.log(params);
  const sqlstr = 'insert into guests (name,phone,card,h_type,enterTime,sex,num,text) values(?,?,?,?,?,?,?,?)';
  const addparams = [params.name, params.phone, params.card, params.h_type, params.enterTime,params.sex,params.num,params.text]
  db.query(sqlstr, addparams, (err, result) => {
      if (err) {
          return res.cc(err.message)
      }
      return res.send({
          status: 0,
          message: '成功'
      })
  })
}
//删除admin 
exports.deleadmin = (req, res) => {
  const params = req.params
  console.log(params.id);
  //sql语句
  const sql = 'delete from user where id=?'
  db.query(sql, params.id, (err, result) => {
      if (err) {
          return res.cc(err.message)
      }
      return res.send({
          status: 0,
          message: '成功',
      })
  })
}
exports.GetType = (req, res) => {
  //定义sql语句
  const sqlStr =  'select distinct h_type,id from home'
  // const params = req.query
  //console.log(params)
  db.query(sqlStr, (err, result) => {
      if (err) {
          return res.cc('失败')
      }
      return res.json(result);
  })
}
exports.lessone = (req, res) => {
  const params = req.params
  console.log(params);
  //sql语句
  const sql = 'update home set homenum=homenum-1 where id=?'
  db.query(sql, params.id, (err, result) => {
      if (err) {
          return res.cc(err.message)
      }
      return res.send({
          status: 0,
          message: '成功',
      })
  })
}
//完成订单插入数据和数字+1
exports.finish = (req, res) => {
  const params = req.body
  console.log(params);
  //sql语句
  const sql = 'update guests set exitTime = ? , text ="完成" where id=?;update home set homenum=homenum+1 where h_type=?' 
  db.query(sql,[params.exitTime, params.id,params.h_type], (err, result) => {
      if (err) {
          return res.cc(err.message)
      }
      return res.send({
          status: 0,
          message: '成功',
      })
  })
}
