const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

/**
 * API utility functions for the hostel allocation system
 * All functions return parsed JSON responses
 */

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth implementation
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

export const api = {
  // ============================================
  // AUTHENTICATION
  // ============================================

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} userData.full_name
   * @param {string} userData.role - "STUDENT" or "ADMIN"
   * @param {number} [userData.graduation_year]
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);

    console.log("Register response:", data); // Debug log

    // Handle different response structures
    const user = data.user || data.data?.user;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User stored after registration:", user); // Debug log
    } else {
      console.warn("No user in registration response:", data);
    }

    return data;
  },
  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);

    console.log("Login response:", data); // Debug log

    // Handle different response structures
    const token = data.token || data.data?.token;
    const user = data.user || data.data?.user;

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored:", token); // Debug log
    } else {
      console.warn("No token in response:", data);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User stored:", user); // Debug log
    } else {
      console.warn("No user in response:", data);
    }

    return { token, user };
  },

  /**
   * Logout user (clears token)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // ============================================
  // STUDENT APPLICATIONS
  // ============================================

  /**
   * Submit a hostel application
   * @param {Object} applicationData
   * @param {string} applicationData.student_id
   * @param {number} applicationData.hostel_id
   * @param {string} [applicationData.message]
   */
  submitApplication: async (applicationData) => {
    const response = await authFetch(`${API_URL}/student/apply`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
    return handleResponse(response);
  },

  /**
   * Get applications for a specific student
   * @param {number|string} studentId
   */
  getStudentApplications: async (studentId) => {
    const response = await authFetch(
      `${API_URL}/student/${studentId}/applications`
    );
    return handleResponse(response);
  },

  // ============================================
  // ADMIN - ALLOCATIONS
  // ============================================

  /**
   * Allocate a room to a student application (admin)
   * @param {Object} allocationData
   * @param {number} allocationData.application_id
   * @param {number} allocationData.room_id
   */
  allocateRoom: async (allocationData) => {
    const response = await authFetch(`${API_URL}/admin/allocate`, {
      method: "POST",
      body: JSON.stringify(allocationData),
    });
    return handleResponse(response);
  },

  /**
   * Get allocations for a specific student
   * @param {number|string} studentId
   */
  getStudentAllocations: async (studentId) => {
    const response = await authFetch(
      `${API_URL}/admin/allocations/${studentId}`
    );
    return handleResponse(response);
  },

  // ============================================
  // COMPLAINTS
  // ============================================

  /**
   * Submit a complaint
   * @param {Object} complaintData
   * @param {number} complaintData.student_id
   * @param {string} complaintData.description
   */
  submitComplaint: async (complaintData) => {
    const response = await authFetch(`${API_URL}/complaints`, {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
    return handleResponse(response);
  },

  /**
   * Get complaints for a specific student
   * @param {number|string} studentId
   */
  getStudentComplaints: async (studentId) => {
    const response = await authFetch(`${API_URL}/complaints/${studentId}`);
    return handleResponse(response);
  },

  /**
   * Get all complaints (admin)
   */
  getAllComplaints: async () => {
    const response = await authFetch(`${API_URL}/api/admin/complaints`);
    return handleResponse(response);
  },

  /**
   * Update complaint status
   * @param {number} complaintId
   * @param {string} status - e.g., "RESOLVED", "OPEN"
   */
  updateComplaintStatus: async (complaintId, status) => {
    const response = await authFetch(
      `${API_URL}/complaints/${complaintId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get overall system statistics
   * @returns {Promise<{total_students, open_complaints, pending_applications, total_beds, allocated_beds, available_beds}>}
   */
  getStats: async () => {
    const response = await authFetch(`${API_URL}/stats`);
    const data = await handleResponse(response);
    return data.data?.stats || data.stats || data;
  },

  /**
   * Get admin statistics (admin endpoint)
   * @returns {Promise<{total_students, open_complaints, pending_applications, total_beds, allocated_beds, available_beds}>}
   */
  getAdminStats: async () => {
    const response = await authFetch(`${API_URL}/admin/stats`);
    const data = await handleResponse(response);
    return data.data?.stats || data.stats || data;
  },

  /**
   * Get students allocated to a specific room
   * @param {number} roomId
   */
  getRoomStudents: async (roomId) => {
    const response = await authFetch(
      `${API_URL}/stats/room/${roomId}/students`
    );
    const data = await handleResponse(response);
    return data.data?.students || data.students || data;
  },

  /**
   * Get students allocated to a specific room (admin endpoint)
   * @param {number} roomId
   */
  getAdminRoomStudents: async (roomId) => {
    const response = await authFetch(
      `${API_URL}/admin/stats/room/${roomId}/students`
    );
    const data = await handleResponse(response);
    return data.data?.students || data.students || data;
  },

  /**
   * Get statistics for a specific hostel
   * @param {number} hostelId
   * @returns {Promise<{hostel, total_beds, allocated_beds, available_beds, total_students, open_complaints}>}
   */
  getHostelStats: async (hostelId) => {
    const response = await authFetch(`${API_URL}/stats/hostel/${hostelId}`);
    const data = await handleResponse(response);
    return data.data?.stats || data.stats || data;
  },

  /**
   * Get statistics for a specific hostel (admin endpoint)
   * @param {number} hostelId
   */
  getAdminHostelStats: async (hostelId) => {
    const response = await authFetch(
      `${API_URL}/admin/stats/hostel/${hostelId}`
    );
    const data = await handleResponse(response);
    return data.data?.stats || data.stats || data;
  },

  // ============================================
  // ADDITIONAL ENDPOINTS (if you have them)
  // ============================================

  /**
   * Get all hostels
   */
  getHostels: async () => {
    const response = await authFetch(`${API_URL}/api/admin/hostels`);
    return handleResponse(response);
  },

  /**
   * Get all rooms
   */
  getRooms: async () => {
    const response = await authFetch(`${API_URL}/api/admin/rooms`);
    return handleResponse(response);
  },

  /**
   * Get rooms by hostel
   * @param {number} hostelId
   */
  getRoomsByHostel: async (hostelId) => {
    const response = await authFetch(`${API_URL}/hostels/${hostelId}/rooms`);
    return handleResponse(response);
  },

  /**
   * Get all applications (admin)
   */
  getAllApplications: async () => {
    const response = await authFetch(`${API_URL}/api/admin/applications`);
    return handleResponse(response);
  },

  /**
   * Update application status (admin)
   * @param {number} applicationId
   * @param {string} status - "APPROVED", "REJECTED", "PENDING", "IN_PROGRESS"
   */
  updateApplicationStatus: async (applicationId, status) => {
    const response = await authFetch(
      `${API_URL}/api/admin/applications/${applicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },

  /**
   * Update complaint status (admin)
   * @param {number} complaintId
   * @param {string} status - "OPEN", "RESOLVED", "IN_PROGRESS"
   */
  updateComplaintStatus: async (complaintId, status) => {
    const response = await authFetch(
      `${API_URL}/api/admin/complaints/${complaintId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },

  /**
   * Get all users (admin)
   */
  getUsers: async () => {
    const response = await authFetch(`${API_URL}/api/admin/users`);
    return handleResponse(response);
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    const response = await authFetch(`${API_URL}/auth/me`);
    return handleResponse(response);
  },

  /**
   * Get user from localStorage
   * @returns {Object|null} User object or null
   */
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;
