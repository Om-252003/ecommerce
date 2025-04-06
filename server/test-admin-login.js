require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');

// Start the server
const server = exec('npm start', { cwd: __dirname });

server.stdout.on('data', async (data) => {
  console.log(data.toString());
  
  // When server is ready
  if (data.toString().includes('Server running on port')) {
    try {
      console.log('\nTesting admin login...');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@example.com',
        password: 'admin123'
      });
      
      console.log('\nLogin successful! Response:');
      console.log({
        status: response.status,
        data: {
          ...response.data,
          token: response.data.token ? '*****' : 'Missing'
        }
      });
      
      console.log('\nAdmin role verified:', response.data.role === 'admin');
    } catch (error) {
      console.error('\nLogin failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error(error.message);
      }
    } finally {
      server.kill();
      process.exit();
    }
  }
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});
