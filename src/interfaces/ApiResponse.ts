export interface ApiResponse {
    error: boolean;
    reason: string;
}

export interface ApiErrorResponse extends ApiResponse{
    error: true;
}