import api from '../api';

export const mapAuthError = (code) => {
  switch (code) {
    case 'ERR_NETWORK':
      return 'Cannot reach the backend server. Check your deployed backend URL and VITE_API_URL in Vercel.';
    case 'ECONNABORTED':
      return 'Request timed out. Check your backend server and internet connection.';
    case 'EMAIL_TAKEN':
      return 'An account with this email already exists.';
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password.';
    case 'GOOGLE_AUTH_DISABLED':
      return 'Google Sign-In is not configured on the server yet.';
    case 'GOOGLE_AUTH_FAILED':
      return 'Google Sign-In failed. Please try again.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Please verify your email before signing in.';
    case 'INVALID_VERIFICATION_TOKEN':
      return 'Verification link is invalid or expired.';
    case 'EMAIL_REQUIRED':
      return 'Email is required to send a verification link.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication isn\'t fully configured. Enable Authentication and Email/Password in Firebase Console and verify your web app config.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is disabled. Enable it in Firebase Console → Authentication → Sign-in method.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password is too weak. Try a stronger one.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by the browser. Allow popups or try redirect.';
    default:
      return '';
  }
};

export const getAuthErrorMessage = (error, fallback = 'Authentication failed') => {
  const backendCode = error?.response?.data?.code;
  const genericCode = error?.code;
  const validationDetails = error?.response?.data?.details;

  if (backendCode === 'VALIDATION_ERROR' && Array.isArray(validationDetails) && validationDetails.length > 0) {
    const firstDetailMessage = validationDetails[0]?.msg;
    if (firstDetailMessage) {
      return String(firstDetailMessage);
    }
  }

  const mapped = mapAuthError(backendCode) || mapAuthError(genericCode);
  if (mapped) {
    return mapped;
  }

  const backendMessage = error?.response?.data?.message;
  if (backendMessage) {
    return backendMessage;
  }

  if (genericCode === 'ERR_NETWORK') {
    const baseUrl = String(api.defaults.baseURL || '').replace(/\/$/, '');
    return baseUrl
      ? `Cannot reach the backend server at ${baseUrl}. Check that the Render service is live and that VITE_API_URL points to the deployed API.`
      : 'Cannot reach the backend server. Check that VITE_API_URL is set in Vercel and that the Render service is live.';
  }

  return error?.message || fallback;
};
