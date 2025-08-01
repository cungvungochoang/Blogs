import axios from 'axios';

export default function requestApi(endpoint, method, body = [], responseType = 'json', contentType = 'application/json') {
    const headers = {
        "Accept": "application/json",
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
    }   

    const instance = axios.create({headers});
    instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if(token){
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
    )
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async(error) => {
            const originalConfig = error.config;
            console.log("Token is expired");
            if(error.response && error.response.status === 419){
                try{
                    console.log("Calling refresh token api...");
                    const result = await instance.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
                        refreshToken: localStorage.getItem('refreshToken')
                    })
                    const [accessToken, refreshToken] = result.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;
                    return instance(originalConfig);
                }catch(error) {
                    if( error.response && error.response.status === 400){
                        console.log("User is not authenticated");
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = "/login";    
                    }
                   return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    )
    return instance.request({
        method: method,
        url: `${process.env.REACT_APP_API_URL}${endpoint}`,
        data: body,
        responseType: responseType
    });
}   