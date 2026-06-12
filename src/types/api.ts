export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError<TCode extends string = string> = {
  success: false;
  error: {
    code: TCode;
    message: string;
  };
};

export type ApiResponse<T, TCode extends string = string> = ApiSuccess<T> | ApiError<TCode>;
