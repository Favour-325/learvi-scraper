import { LoginCredentials, User, Announcement } from "@/types/auth";
import axios from "axios"
import Cookies from "js-cookie"
import { headers } from "next/headers";

export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});


// Create a parent class for all APIs with common attributes and sub classes for each API category

export const signup = async (userData: object) => {
    return await API.post('/auth/register', userData, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    });
};

export const api_login = async (userData: any) => {
    try {
        const response = await API.post('/auth/login', userData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json"
            }
        });

        const { access_token, refresh_token } = response.data;

        localStorage.setItem("access", access_token);
        localStorage.setItem("refresh", refresh_token);

        return response;
    } catch (error: any) {
        console.error("Login failed", error.response?.data || error.message);
    }
};

export const refresh = async () => {
    return await API.post('/auth/refresh', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('refresh')}`
        },
    });
}

export const api_logout = async () => {
    return await API.post('/auth/logout', {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export const get_courses = async (params: any) => {
    return await API.get('/courses', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        params
    })
}

export const get_course = async (course_id: string) => {
    return await API.get(`/courses/${course_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

export const create_course = async (data: any) => {
    return await API.post('/courses/create', data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

export const update_course = async (course_id: number, data: any) => {
    return await API.patch(`/courses/update/${course_id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

export const delete_course = async (course_id: number) => {
    return await API.delete(`/courses/delete/${course_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

export const authenticate = async () => {
    return await API.get('/auth/me', {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    });
};

export const enroll = async (user_id: number, course_id: number) => {
    return await API.post('/enrollment/new', {user_id, course_id}, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

export const get_user_enrollment = async (user_id: number) => {
    return await API.get(`/enrollment/user/${user_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
    })
}

/* class Announcements {

    constructor() {
    
    }
} */

export const get_announcements = async () => {
    return await API.get('/announcement/', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const create_announcement = async (data: any) => {
    return await API.post('/announcement/new', data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const update_announcement = async (announcement_id: number, data: any) => {
    return await API.patch(`/announcement/update/${announcement_id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const delete_announcement = async (announcement_id: number) => {
    return await API.delete(`/announcement/delete/${announcement_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const get_metrics = async () => {
    return await API.get('/metrics', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const init_transaction = async () => {
    return await API.post('/payments/payunit', {}, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const process_transaction = async (transaction_id: string, data: any) => {
    return await API.patch('/payments/process', {transaction_id, data}, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const all_users = async () => {
    return await API.get('/user-mgt', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const create_user = async (data: any) {
    return await API.post('/user-mgt/new', data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    })
}

export const update_user = async (user_id: number, data: any) {
    
}