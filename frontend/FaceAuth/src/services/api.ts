import axios from 'axios';

const API_BASE_URL = 'http://10.124.0.225:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const enrollFace = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'face.jpg',
    } as any);

    console.log('Enrolling face with URI:', imageUri);
    const response = await api.post('/enroll', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Enrollment response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Enrollment error:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyFace = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'face.jpg',
    } as any);

    const response = await api.post('/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Face verification failed');
  }
};