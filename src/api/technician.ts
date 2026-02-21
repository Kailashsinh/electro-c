import client from './client';

export const technicianApi = {
    uploadDocuments: (formData: FormData) => client.post('/technician/upload-documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    // Add other technician endpoints here as needed
};
