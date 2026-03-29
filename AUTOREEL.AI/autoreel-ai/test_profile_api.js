import axios from 'axios';

async function test() {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/user/profile');
        console.log('STATUS:', res.status);
        console.log('DATA:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
        if (err.response) {
            console.error('RES DATA:', err.response.data);
        }
    }
}

test();
