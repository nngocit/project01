import axios from 'axios';
let axiosVplus;
axiosVplus = axios.create({
    //baseURL: 'https://api.example.comasdsad'
});

let axiosVnPost;
axiosVnPost = axios.create({
    baseURL: 'https://api2.example.com'
});

let AdmincpTest
AdmincpTest = axios.create({
    baseURL: 'http://10.10.40.171:8082'
})


export { axiosVplus }
export { axiosVnPost }
export { AdmincpTest }