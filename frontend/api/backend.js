import axios from 'axios';
import { tr } from 'framer-motion/client';

let token = '';

if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
}

const apiClient = axios.create({
    baseURL: 'http://34.134.223.0:8080', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    withCredentials: true, // Allows sending cookies with the request
});
const apiClient2 = axios.create({
    baseURL: 'http://34.134.223.0:8080', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token
    },
    withCredentials: true, // Allows sending cookies with the request
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
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
        const response = await apiClient.get('/user-quizzes');
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

export const getQuiz = async (quizID) => {
    try {
        const response = await apiClient.get('/GeminiQuiz', quizID);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};

export const getSummary = async () => {
    try {
        const response = await apiClient.get('/GeminiSummary');
        return response.data;
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
    }
};

export const registerUser = async (registrationData) => {
    try {
        const signUpResponse = await apiClient.post('/register-v2', registrationData);
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
        const response = await apiClient.get('/getUserDetails');
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}
export const insertFile = async (fileData, fileName, fileGroup) => {
    console.log(fileData);
    try {
        
        const response = await apiClient2.post('/insert-file?fileName=' + fileName + '&groupname=' + fileGroup , fileData, {
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

export const createGroup = async (groupName, groupColour) => {
    console.log(groupName);
    try {
        const response = await apiClient.post('/create-group?groupName=' + groupName + '&groupColour' + groupColour);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}
export const deleteGroup = async (groupName) => {
    console.log(groupName);
    try {
        const response = await apiClient.post('/create-group?groupName=' + groupName, {

        });
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}
export const renameGroup = async (groupName) => {
    console.log(groupName);
    try {
        const response = await apiClient.post('/create-group?oldGroupName=' + oldGroupName + '&newGroupName=' + newGroupName, {

        });
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}
export const GeminiQuiz = async (groupId, idsOfFilesString, numberOfQuestions, userPrompt) => {
    try {
        const response = await apiClient.get('/GeminiQuiz?groupID=' + groupId + '&idsOfFilesString=' + idsOfFilesString + '&numberOfQuestions=' + numberOfQuestions + '&userPrompt=' + userPrompt);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
}

export const showGroups = async () => {
    try {
        const response = await apiClient.get('/show-groups');
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}
export const GeminiSummarize = async (nameOfSummaryDoc, groupId, idsOfFilesString, userPrompt) => {

    try {
        const response = await apiClient.post('/GeminiSummarize?nameOfSummaryDoc=' + nameOfSummaryDoc + '&groupID=' + groupId + '&idsOfFilesString=' + idsOfFilesString + '&userPrompt=' + userPrompt);
        return response.data;
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
    }
}

