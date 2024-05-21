const apiUrl = `${process.env.REACT_APP_API_URL}`;

export const trackEvent = async (data) => {
    // Append common tracking data fields here
    data.event_time = Math.floor(Date.now() / 1000);  // Set event time
    data.event_source_url = window.location.href;     // Set the current URL as the event source URL
    data.action_source = 'website';                   // Define the action source as 'website'

    try {
        const response = await fetch(apiUrl + '/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': navigator.userAgent // Optionally send user agent directly if needed server-side
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to track event', error);
    }
};

export async function hashSha256(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));  // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');  // Convert bytes to hex string
    return hashHex;
  }
