import ConsultationEmail from "@/app/_emails/ConsultationEmail";
import ConsultationConfirmationEmail from "@/app/_emails/ConsultationConfirmationEmail";

import type { ConsultationInput } from "../validation/consultation";
import type { ServiceResult } from "../types/service";

import { AppConfig } from "../config/app";
import { EmailService } from "./email.service";

export class ConsultationService {

  static async submit(
  data: ConsultationInput
): Promise<ServiceResult> {

  try {

    await Promise.all([
  EmailService.send({

    from: AppConfig.sender,

    to: AppConfig.email,

    subject: `New Consultation Request — ${data.fullName}`,

    react: (
      <ConsultationEmail
        data={data}
      />
    ),

  }),

  EmailService.send({

    from: AppConfig.sender,

    to: data.email,

    subject:
      "Thank you for contacting Tayo Bolarinwa",

    react: (
      <ConsultationConfirmationEmail
        fullName={data.fullName}
      />
    ),

  }),
]);

    return {

      success: true,

      message:
        "Consultation request submitted successfully.",

    };

  } catch (error) {

    console.error(error);

    return {

      success: false,

      message:
        "Unable to send consultation email.",

    };

  }

}

}