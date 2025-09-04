export interface User {
    id: number;
    username: string;
    email: string;
    joined_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Announcement {
  id: number;
  type: string;
  title: string;
  responsibilities: string;
  requirements: string;
  description: string;
  source: string;
  location: string;
  email: string;
  phone: string;
  link: string;
  created_at: string;
}