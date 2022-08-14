// 封装腾讯云发送邮件Sdk
const tencentcloud = require("tencentcloud-sdk-nodejs");

const SesClient = tencentcloud.ses.v20201002.Client;

import config from "../config.json";

const clientConfig = {
  credential: {
    secretId: config.tencentSdk.secretId,
    secretKey: config.tencentSdk.secretKey,
  },
  region: "ap-hongkong",
  profile: {
    httpProfile: {
      endpoint: "ses.tencentcloudapi.com",
    },
  },
};

// 发送邮件到指定用户
export function sendEmail(sendTo, Emailtitle, templateParam) {
  const params = {
    FromEmailAddress: "noreply@yogiwu.com",
    Destination: [sendTo],
    Template: {
      TemplateID: 33804,
      TemplateData: `{"code":"${templateParam}"}`,
    },
    Subject: Emailtitle,
  };
  return new SesClient(clientConfig).SendEmail(params);
}
