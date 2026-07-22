import { NextResponse } from "next/server";

export class ApiResponse {
  static success(data?: unknown) {
    return NextResponse.json({
      success: true,
      data,
    });
  }

  static error(
    message: string,
    status = 400
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      }
    );
  }

  static validation(error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      {
        status: 400,
      }
    );
  }
}