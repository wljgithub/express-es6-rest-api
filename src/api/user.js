import { toRes } from "../lib/res";
// import AsyncLock from "async-lock";
import { validationResult } from "express-validator";
import { fourRandomDight, sixRandomDigit } from "../lib/util";
import { sendEmail } from "../lib/tencent-sdk";
import {
  EMAIL_CODE_ERR,
  INTERNAL_SERVER_ERR,
  USER_EXISTS,
} from "../lib/errorno";
import { generateCaptcha } from "../lib/image-captcha";

const emailWithCode = {};
const captcha = {};

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
  login(db) {
    return (req, res) => {
      // 校验参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // 接口逻辑

      // 校验前端上传的验证码和生成的图片验证码相同，否则提示错误

      // 1. 从对象中查询验证码
      let code = captcha[req.body.captchaId];
      // 2. 判断验证与上传的是否相同
      if (code != req.body.captcha) {
        return toRes(res, {}, "验证码错误");
      }
      // 验证用户提交的用户名和密码与注册时相同，否则提示用户名或密码错误
      // 1. 根据上传的用户名从数据库查询用户信息
      db.query(
        "select user_name,`password` from user where user_name = :username limit 1",
        {
          replacements: { username: req.body.accountName },
        }
      )
        .then((data) => {
          // 2. 判断上传的用户名和密码是否与数据中的相同,
          if (
            data.length > 0 &&
            data[0].length > 0 &&
            data[0][0].user_name == req.body.accountName &&
            data[0][0].password == req.body.password
          ) {
            // 如果相同返回成功
            return toRes(res, {});
          }
          return toRes(res, {}, "用户名或密码错误");
          // 不相同返回用户名或密码错误
        })
        .catch((err) => {
          // 如果服务器错误返回服务器错误
          console.log(err);
          return toRes(res, {}, INTERNAL_SERVER_ERR);
        });
    };
  },
  getCaptcha(req, res) {
    // 校验参数
    // 1. 生成四位随机数
    let num = fourRandomDight();
    // 2. 生成一张图片
    let image = generateCaptcha(num);
    // 3/ 将随机数存储起来
    captcha[num] = num;
    return toRes(res, { captcha: image });
  },
};
