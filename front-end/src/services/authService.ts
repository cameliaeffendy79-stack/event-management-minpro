import axios from "axios";

/////////////////////////////////////////////////////
// API URL
/////////////////////////////////////////////////////

const API_URL =
  "http://localhost:5000";

/////////////////////////////////////////////////////
// TYPES
/////////////////////////////////////////////////////

export interface RegisterPayload {
  name: string;

  email: string;

  password: string;

  role:
    | "CUSTOMER"
    | "ORGANIZER";

  referral_code?: string;
}

export interface LoginPayload {
  email: string;

  password: string;
}

/////////////////////////////////////////////////////
// REGISTER
/////////////////////////////////////////////////////

export async function registerUser(
  data: RegisterPayload
) {
  try {
    console.log("REGISTER DATA:", data);

    const result = await axios.post(
      `${API_URL}/auth/register`,
      data
    );

    console.log("REGISTER SUCCESS:", result);

    return result;
  } catch (error: any) {
    console.log(
      "REGISTER ERROR:",
      error.response?.data
    );

    throw error;
  }
}



/////////////////////////////////////////////////////
// LOGIN
/////////////////////////////////////////////////////

export async function loginUser(
  data: LoginPayload
) {
  return axios.post(
    `${API_URL}/auth/login`,
    data
  );
}

/////////////////////////////////////////////////////
// GET TOKEN
/////////////////////////////////////////////////////

export function getToken() {
  return localStorage.getItem(
    "token"
  );
}

/////////////////////////////////////////////////////
// LOGOUT
/////////////////////////////////////////////////////

export function logoutUser() {
  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem("user");
}