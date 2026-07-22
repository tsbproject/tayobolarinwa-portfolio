export interface ServiceResult<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ServiceError {
  code?: string;
  message: string;
}