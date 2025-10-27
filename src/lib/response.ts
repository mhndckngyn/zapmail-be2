export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string; // quy ước: Nếu có lỗi và cần hiển thị cho người dùng, set ở đây
  content: T;
  error?: string;
  statusCode: number;
};
