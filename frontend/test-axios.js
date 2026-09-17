const axios = require('axios');
const client = axios.create({ baseURL: 'https://example.com/api' });
console.log(client.getUri({ url: '/products' }));
