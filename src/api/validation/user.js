export const registerValidate = {
  accountName: {
    custom: {
      options: (value, { req, location, path }) => {
        return /[0-9]/.test(value) && /[a-z]/i.test(value);
      },
    },
    errorMessage: "accountName 必须是字母和数字的组合",
  },
  password: {
    custom: {
      options: (value, { req, location, path }) => {
        return value.length > 6 && /[0-9]/.test(value) && /[a-z]/i.test(value);
      },
    },
    errorMessage: "password 必须是大于6个字符，且包含数字和字母的组合",
  },
  passwordAgain: {
    custom: {
      options: (value, { req, location, path }) => {
        return value == req.body.passwordAgain;
      },
      errorMessage: "两次输入密码不相同",
    },
  },
  email: {
    isEmail: {
      bail: true,
    },
    errorMessage: "请输入合法邮箱",
  },
  emailCode: {
    custom: {
      options: (value, { req, location, path }) => {
        return value.toString().length === 6 && /[0-9]/.test(value);
      },
      errorMessage: "必须是6位数字",
    },
  },
};

export const loginValidate = {
  captcha: {
    custom: {
      options: (value, { req, location, path }) => {
        return /^[0-9]{4}$/.test(value);
      },
      errorMessage: "必须是4位数字",
    },
  },
};
