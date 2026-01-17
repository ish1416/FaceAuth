import axios from 'axios';

const API_BASE_URL = 'http://192.168.137.83:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
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
  let retries = 2;
  let lastError;
  
  while (retries > 0) {
    try {
      console.log('Starting verification request... (retries left:', retries, ')');
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
      } as any);

      console.log('Verifying face with URI:', imageUri);
      console.log('API URL:', API_BASE_URL);
      
      const response = await api.post('/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 90000,
      });

      console.log('Verification response:', response.data);
      return response.data;
    } catch (error: any) {
      lastError = error;
      retries--;
      
      if (retries > 0 && error.code === 'ERR_NETWORK') {
        console.log('Network error, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      console.error('Verification error details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request config:', error.config?.url);
      throw error;
    }
  }
  
  throw lastError;
};