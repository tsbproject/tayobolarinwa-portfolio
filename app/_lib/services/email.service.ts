import { render } from "@react-email/render";

import { resendProvider } from "../providers/resend.provider";

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

export class EmailService {
  static async send({
    from,
    to,
    subject,
    react,
  }: SendEmailOptions) {

    const html = await render(react);

    return resendProvider.emails.send({
      from,
      to,
      subject,
      html,
    });

  }
}