/**
 * Helper to format authentication and database connection errors
 * into user-friendly messages localized in Arabic and English.
 */
export function formatAuthErrorMessage(error: any, locale: string = 'ar'): string {
  const isAr = locale !== 'en';
  const rawMessage = typeof error === 'string' ? error : error?.message || '';
  const lowerMessage = rawMessage.toLowerCase();

  // 1. Network & Database connection errors (fetch failed, DNS, timeout, etc.)
  if (
    lowerMessage.includes('fetch failed') ||
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('enotfound') ||
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('etimedout') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('abort') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('undici') ||
    lowerMessage.includes('socket')
  ) {
    return isAr
      ? 'تعذر الاتصال بقاعدة البيانات والخدمة حالياً. يرجى التحقق من اتصال الإنترنت أو المحاولة لاحقاً.'
      : 'Unable to connect to the database and authentication service. Please check your internet connection or try again later.';
  }

  // 2. Already registered email
  if (
    rawMessage.includes('User already registered') ||
    lowerMessage.includes('already registered') ||
    lowerMessage.includes('email already in use')
  ) {
    return isAr
      ? 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.'
      : 'An account with this email already exists.';
  }

  // 3. Invalid credentials
  if (
    rawMessage.includes('Invalid login credentials') ||
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('invalid email or password')
  ) {
    return isAr
      ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
      : 'Invalid email or password.';
  }

  // 4. Email not confirmed
  if (
    rawMessage.includes('Email not confirmed') ||
    lowerMessage.includes('email not confirmed')
  ) {
    return isAr
      ? 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.'
      : 'Please verify your email address before logging in.';
  }

  // 5. Password length
  if (lowerMessage.includes('password should be at least')) {
    return isAr
      ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.'
      : 'Password should be at least 8 characters.';
  }

  // 6. Rate limit
  if (
    lowerMessage.includes('rate limit') ||
    lowerMessage.includes('too many requests')
  ) {
    return isAr
      ? 'تم تجاوز الحد المسموح من المحاولات، يرجى الانتظار قليلاً والمحاولة لاحقاً.'
      : 'Too many requests. Please wait a moment and try again.';
  }

  // 7. Session missing / expired
  if (
    lowerMessage.includes('session missing') ||
    lowerMessage.includes('session expired') ||
    lowerMessage.includes('auth session missing') ||
    lowerMessage.includes('invalid or expired')
  ) {
    return isAr
      ? 'انتهت صلاحية جلسة التحقق أو الرابط غير صالح، يرجى إعادة المحاولة.'
      : 'Auth session expired or link is invalid. Please try again.';
  }

  // Fallback
  return (
    rawMessage ||
    (isAr
      ? 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.'
      : 'An unexpected error occurred. Please try again.')
  );
}
