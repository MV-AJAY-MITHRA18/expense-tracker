// API Configuration
// Change this URL based on your environment

// For local development (Android emulator uses 10.0.2.2 for localhost)
// export const API_URL = "http://10.0.2.2:5000/api";

// For local development (iOS simulator uses localhost)
// export const API_URL = "http://localhost:5000/api";

// For physical device testing, use your computer's local IP address
// export const API_URL = "http://192.168.x.x:5000/api";

// Default: Local development
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";
