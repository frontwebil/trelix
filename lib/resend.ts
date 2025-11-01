import { Resend } from "resend";

export const resend = new Resend("re_AY2g1QvR_JMPqv7LWEFkSy4B4EnpLBZxc");

resend.emails.send({
  from: "Trelix",
  to: "gollpfd@gmail.com",
  subject: "",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
