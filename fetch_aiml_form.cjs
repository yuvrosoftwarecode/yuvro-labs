const fs = require('fs');
const https = require('https');

const url = "https://docs.google.com/forms/d/e/1FAIpQLSff50BIHKBEgjYKFBpYhDLpD_7G-RkVzPLfae8k6XLnSjZMYw/viewform";

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('form_aiml.html', data);
    console.log("Written to form_aiml.html");
  });
});
