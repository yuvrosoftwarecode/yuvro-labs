const https = require('https');
const fs = require('fs');
https.get('https://docs.google.com/forms/d/e/1FAIpQLSe8_xV4rH01_fTUdAs2XyypsHXX1mohdxmsq_1xs_P3JcTZhg/viewform', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('form.html', data);
    console.log("Written to form.html");
  });
});
