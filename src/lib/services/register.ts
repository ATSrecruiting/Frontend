import type { RegisterForm } from "$lib/types/register";
import type { RegisterResponse } from "$lib/types/register";



export async function registerUser(userData: RegisterForm): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.detail || 'Registration failed'
      };
    }
    
    return {
      success: true,
      data: data // Assuming the API returns the user data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
}