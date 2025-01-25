import axios from 'axios';
import { tr } from 'framer-motion/client';

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

export const getQuizzes = async () => {
    try {
        const response = await axios.get('/user-quizzes');
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

export const getQuiz = async (quizID) => {
    try {
        const response = await axios.get('/GeminiQuiz', quizID);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};

export const getSummary = async () => {
    try {
        const response = await axios.get('/GeminiSummary');
        return response.data;
    } catch (error) {
        console.error('Error fetching summary:', error);
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
export const insertFile = async (fileData, fileName, fileGroup) => {
    try {
        const response = await apiClient.post('/insert-file',{
            fileName: fileName,
            fileGroup: fileGroup,
            fileSubgroup: "",
            file: fileData,
        },{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error inserting file:', error);
        throw error;
    }
 };

 export const manageInfo = async (profileData) => {
    try {
        const response = await apiClient.post('/manage/info', 
            {
                newEmail: email,
                newPassword: newPassword,
                oldPassword: oldPassword
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export const createGroup = async (groupinfo) => {
    console.log(groupinfo);
    try {
        const response = await apiClient.post('/create-group', {'groupName': groupinfo}, {

        });
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}
