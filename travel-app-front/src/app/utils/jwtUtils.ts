export function decodeJWT(token : string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
}

export function checkTokenValidity(token : string) {
    const payload = decodeJWT(token);
    if (!payload) return false;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    return payload.exp > currentTimestamp;
}