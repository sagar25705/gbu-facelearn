import axios from 'axios';

// Backend URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - token expired
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/register', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  // Add new student
  addStudent: async (studentData: any) => {
    const response = await apiClient.post('/add-student', studentData);
    return response.data;
  },
  
  // Add new teacher
  addTeacher: async (teacherData: any) => {
    const response = await apiClient.post('/add-teacher', teacherData);
    return response.data;
  },
  
  // Get all students (with filters)
  getStudents: async (filters?: { school?: string; course?: string; department?: string }) => {
    const response = await apiClient.get('/students', { params: filters });
    return response.data;
  },
  
  // Update student
  updateStudent: async (rollNo: string, studentData: any) => {
    const response = await apiClient.put(`/students/${rollNo}`, studentData);
    return response.data;
  },
  
  // Delete student
  deleteStudent: async (rollNo: string) => {
    const response = await apiClient.delete(`/students/${rollNo}`);
    return response.data;
  },
  
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  
  // Teacher Management APIs
  getTeachers: async (filters?: { school?: string; department?: string }) => {
    const response = await apiClient.get('/teachers', { params: filters });
    return response.data;
  },
  
  getTeacherById: async (teacherId: number) => {
    const response = await apiClient.get(`/teachers/${teacherId}`);
    return response.data;
  },
  
  updateTeacher: async (teacherId: number, teacherData: any) => {
    const response = await apiClient.put(`/teachers/${teacherId}`, teacherData);
    return response.data;
  },
  
  deleteTeacher: async (teacherId: number) => {
    const response = await apiClient.delete(`/teachers/${teacherId}`);
    return response.data;
  },
};

// ==================== TEACHER APIs ====================
export const teacherAPI = {
  // Generate class code
  generateClassCode: async (classDetails: any) => {
    const response = await apiClient.post('/teacher/generate-code', classDetails);
    return response.data;
  },
  
  // Get live attendance for a class
  getLiveAttendance: async (classCode: string) => {
    const response = await apiClient.get(`/teacher/attendance/${classCode}`);
    return response.data;
  },
  
  // Submit final attendance
  submitAttendance: async (classCode: string) => {
    const response = await apiClient.post(`/teacher/submit-attendance/${classCode}`);
    return response.data;
  },
  
  // Remove student from attendance (proxy)
  removeAttendance: async (attendanceId: string) => {
    const response = await apiClient.delete(`/teacher/attendance/${attendanceId}`);
    return response.data;
  },
  
  // Add student manually
  addManualAttendance: async (classCode: string, rollNo: string) => {
    const response = await apiClient.post(`/teacher/attendance/manual`, {
      class_code: classCode,
      roll_no: rollNo,
    });
    return response.data;
  },
};

// ==================== STUDENT APIs ====================
export const studentAPI = {
  // Verify class code
  verifyClassCode: async (classCode: string) => {
    const response = await apiClient.post('/student/verify-code', { class_code: classCode });
    return response.data;
  },
  
  // Mark attendance (without face recognition)
  markAttendance: async (classCode: string) => {
    const response = await apiClient.post('/student/mark-attendance', { class_code: classCode });
    return response.data;
  },
};

// ==================== FACE RECOGNITION APIs ====================
export const faceRecognitionAPI = {
  // Enroll student with face images
  enrollStudent: async (rollNo: string, images: File[]) => {
    const formData = new FormData();
    formData.append('roll_no', rollNo);
    
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    const response = await apiClient.post('/face-recognition/enroll-student', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Recognize face and mark attendance
  recognizeFace: async (classCode: string, imageBlob: Blob) => {
    const formData = new FormData();
    formData.append('class_code', classCode);
    formData.append('image', imageBlob, 'face.jpg');
    
    const response = await apiClient.post('/face-recognition/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Get student face recognition status
  getStudentStatus: async (rollNo: string) => {
    const response = await apiClient.get(`/face-recognition/student-status/${rollNo}`);
    return response.data;
  },
  
  // Get face recognition stats
  getStats: async () => {
    const response = await apiClient.get('/face-recognition/stats');
    return response.data;
  },
  
  // Remove student from face recognition
  removeStudent: async (rollNo: string) => {
    const response = await apiClient.delete(`/face-recognition/student/${rollNo}`);
    return response.data;
  },
};

// ==================== UTILITY APIs ====================
export const utilityAPI = {
  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  
  // Get API root info
  getRoot: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },
};

export default apiClient;
