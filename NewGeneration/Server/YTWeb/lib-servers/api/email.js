require("dotenv").config();
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const self = "starrystar.inc@gmail.com";

const transporter = nodemailer.createTransport(smtpTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: self,
    pass: process.env.GMAIL
  }
}));

module.exports = function(opts = {}) {
  return new Promise((res, rej) => {
    opts = Object.assign({from: `Starry Star Team <${self}>`, to: self, subject: "", text: "", html: ""}, opts);
    if(typeof opts.from !== "string") opts.from = "self";
    if(opts.from === "self") opts.from = self;
    if(typeof opts.to !== "string") opts.to = "self";
    if(opts.to === "self") opts.to = self;
    opts.subject = String(opts.subject);
    opts.text = String(opts.text);
    opts.html = String(opts.html);
    transporter.sendMail(opts, function(error, info){
      if(error) return rej(error);
      return res(info);
    });
  });
};