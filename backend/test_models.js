const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: '/v1beta/models?key=' + process.env.GEMINI_API_KEY,
  method: 'GET'
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => { 
      const models = JSON.parse(data).models;
      if (models) {
          const names = models.map(m => m.name);
          console.log(names);
      } else {
          console.log(data);
      }
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
