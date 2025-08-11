export const apiCall = async (url, options = {}) => {
    try {
    console.log("start");
    const credentials = localStorage.getItem('authCredentials');
    console.log(credentials);

    if(!credentials){
        throw new Error("Not authenticated - please log in again");
    }

    const defaultOptions = {
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    };

    if(!(options.body instanceof FormData)){
        defaultOptions.headers['Content-Type'] = 'application/json';
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    
        
        console.log('Making an API call to:', `http://localhost:8080${url}`);
        console.log('Options', finalOptions);
        

        const response = await fetch(`http://localhost:8080${url}`, finalOptions);

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if(!response.ok){
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = `HTTP ${response.status} - ${response.statusText}`;
            }
            console.error('API Error:', errorText);
            throw new Error(errorText || `HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    }catch (error) {
        console.error('API Call failed:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('authCredentials');
    localStorage.removeItem('currentUser');
};