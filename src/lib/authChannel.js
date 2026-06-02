// Shared 2FA delivery preference (email | sms).
// Set in Profile › Security; read by the sign-in 2FA screen and the
// withdrawal verification modal so the code is sent the chosen way.
let channel = 'email';

export const getAuthChannel = () => channel;
export const setAuthChannel = (c) => { channel = c; };
