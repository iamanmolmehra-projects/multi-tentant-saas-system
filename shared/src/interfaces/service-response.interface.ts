export interface IServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export interface IInternalServiceRequest {
  serviceApiKey: string;
  requestingService: string;
  orgId: string;
  userId?: string;
  correlationId: string;
}
