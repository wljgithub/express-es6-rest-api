import { toRes } from "../lib/res";
// import AsyncLock from "async-lock";
import { validationResult } from "express-validator";
import { sixRandomDigit } from "../lib/util";
import { sendEmail } from "../lib/tencent-sdk";
import {
  EMAIL_CODE_ERR,
  INTERNAL_SERVER_ERR,
  USER_EXISTS,
} from "../lib/errorno";

const emailWithCode = {};

// let lock = new AsyncLock();

export default {
  getEmailCode(req, res) {
    // 校验参数格式
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // 接口的逻辑
    let email = req.query.email;

    // 随机生成6个数字
    let sixDigit = sixRandomDigit();

    // 调用外部接口发送邮件验证码
    sendEmail(email, "注册验证码", sixDigit).then(
      // 成功则提示
      () => {
        // 需要记录给谁发了xx验证码，到时候需要校验
        // TODO: 需要考虑并发安全问题
        emailWithCode[email] = sixDigit;
        return toRes(res, {});
      },
      //   失败则返回错误提示
      (err) => {
        console.error("error", err);
        return toRes(res, {}, INTERNAL_SERVER_ERR);
      }
    );
  },
  register(db) {
    // 校验参数
    return (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // 接口逻辑
      // 校验验证码是否是这个邮箱填写的，两种情况：
      // 如果验证码不在这个对象中，或者验证码跟用户填写的不一致，返回验证码错误
      let email = req.body.email;
      if (
        !emailWithCode.hasOwnProperty(email) ||
        emailWithCode[email] != req.body.emailCode
      ) {
        return toRes(res, {}, EMAIL_CODE_ERR);
      }

      // 将用户注册数据插入数据库中，
      db.query("insert into user(user_name,password,email) values(?,?,?)", {
        replacements: [req.body.accountName, req.body.password, req.body.email],
      })
        // 不存在返回注册成功
        .then((data) => {
          // 如果已经注册成功要删除验证码（每个验证码只能使用一次）
          delete emailWithCode[email];
          toRes(res, {});
        })
        // 如果已存在则返回用户已存在，如果是其他数据错误则返回服务器错误
        .catch((err) => {
          if (err && err.original.errno === 1062) {
            toRes(res, {}, USER_EXISTS);
          } else {
            console.log(err);
            toRes(res, {}, INTERNAL_SERVER_ERR);
          }
        });
    };
  },
};
