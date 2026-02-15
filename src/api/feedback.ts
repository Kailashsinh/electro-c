import apiClient from './client';

export interface FeedbackPayload {
    rating: number;
    comment?: string;
}

export const feedbackApi = {
    submit: (requestId: string, data: FeedbackPayload) =>
        apiClient.post(`/feedback/${requestId}`, data),

    getTechnicianFeedback: () =>
        apiClient.get('/feedback/technician/my'),
};
