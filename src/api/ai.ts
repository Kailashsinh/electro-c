import apiClient from './client';

export interface DiagnosisResponse {
    likely_cause: string;
    estimated_cost_range: string;
    severity: 'low' | 'medium' | 'high';
    advice: string;
    is_safe_to_use: boolean;
}

export const aiApi = {
    diagnose: (data: { applianceType: string; description: string }) =>
        apiClient.post<DiagnosisResponse>('/ai/diagnose', data),
};
