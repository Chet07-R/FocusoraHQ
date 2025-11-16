export const mapAuthError = (code) => {
  switch (code) {
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
