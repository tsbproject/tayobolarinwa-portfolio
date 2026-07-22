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

    const response =
      await resendProvider.emails.send({

        from,

        to,

        subject,

        react,

      });

    console.log(
      "Email Sent:",
      response.data?.id
    );

    return response;

  }
}