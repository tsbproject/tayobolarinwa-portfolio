import { NextRequest } from "next/server";

import { consultationSchema } from "@/app/_lib/validation/consultation";

import { ApiPipeline } from "@/app/_lib/security/api/pipeline";
import { ApiResponse } from "@/app/_lib/security/api/response";

import { ConsultationService } from "@/app/_lib/services/consultation.service";

export async function POST(
  request: NextRequest
) {
  try {

    const pipeline =
      await ApiPipeline.process({

        request,

        schema: consultationSchema,

        requireOrigin: true,

        requireHoneypot: true,

        requireRateLimit: true,

        requireTurnstile: true,

      });

    if (!pipeline.success) {
      return pipeline.response!;
    }

    const result =
      await ConsultationService.submit(
        pipeline.data!
      );

    if (!result.success) {

      return ApiResponse.error(
        result.message ??
          "Unable to submit consultation.",
        500
      );

    }

    return ApiResponse.success({
      message: result.message,
    });

  } catch (error) {

    console.error(error);

    return ApiResponse.error(
      "Something went wrong.",
      500
    );

  }
}