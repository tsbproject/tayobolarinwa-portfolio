import { ApiPipelineOptions } from "./types";
import { validateOrigin } from "./origin";
import { ApiResponse } from "./response";
import { sanitizeBody } from "./sanitize-body";
import { hasTriggeredHoneypot } from "./honeypot";

export class ApiPipeline {
  static async process<T>(
    options: ApiPipelineOptions<T>
  ) {
    const {
      request,
      schema,
    } = options;

    /*
     * Parse Request
     */

    const rawBody = await request.json();

    /*
     * Sanitize
     */

    const body = sanitizeBody(rawBody);

    /*
     * Origin Validation
     */

    if (options.requireOrigin) {

      const origin =
        request.headers.get("origin");

      if (!validateOrigin(origin)) {

        return {
          success: false,
          response: ApiResponse.error(
            "Forbidden.",
            403
          ),
        };

      }

    }

    /*
     * Honeypot
     */

    if (
      options.requireHoneypot &&
      hasTriggeredHoneypot(
        String(body.website ?? "")
      )
    ) {

      return {
        success: false,
        response: ApiResponse.error(
          "Bad Request.",
          400
        ),
      };

    }

    /*
     * Validation
     */

    const result =
      schema.safeParse(body);

    if (!result.success) {

      return {
        success: false,
        response: ApiResponse.validation(result.error),
      };

    }

    return {

      success: true,

      data: result.data,

    };
  }
}