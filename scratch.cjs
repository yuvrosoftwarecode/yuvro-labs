const fs = require('fs');
const https = require('https');
https.get('https://docs.google.com/forms/d/e/1FAIpQLScalt2ECkb4zOqERxBEG7SnvASsV-OxMYmG7d12vbYYQBfoUw/viewform', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('form_sde.html', data);
    console.log("Written to form_sde.html");
  });
});

