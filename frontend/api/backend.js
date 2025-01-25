import axios from 'axios';

let token = '';

if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
}

const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    withCredentials: true, // Allows sending cookies with the request
});

export const createTestUser = async () => {
    try {
        const response = await apiClient.get('/createTestUser');
        return response.data;
    } catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
};

export const getGeminiJoke = async () => {
    try {
        const response = await apiClient.get('/GeminiJoke');
        return response.data;
    } catch (error) {
        console.error('Error fetching Gemini joke:', error);
        throw error;
    }
};

export const registerUser = async (registrationData) => {
    try {
        await apiClient.post('/register-v2', registrationData);
        const loginResponse = await apiClient.post('/login', {email: registrationData.email, password: registrationData.password});
        localStorage.setItem('token', loginResponse.data['accessToken']);
        return loginResponse.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await apiClient.post('/login', loginData);
        localStorage.setItem('token', response.data['accessToken']);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export const getQuiz = async (quizID) => {
    try {
        // const response = await apiClient.get('/quiz', {quizID: quizID});
        // console.log('response:', response);
        // return response.data;
        return "WIP";
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
}