const https = require('https');
https.get('https://docs.google.com/forms/d/e/1FAIpQLScaqSkhqtUswsfIQ8BWdR20VKD2HtO5A6QpoCpZLQKawgOO0w/viewform', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.*\]);\n/);
    if(match) {
        try {
            const parsed = JSON.parse(match[1]);
            const fields = parsed[1][1];
            fields.forEach(f => {
                if(f[4] && f[4][0]) {
                    console.log(f[1] + " -> entry." + f[4][0][0]);
                }
            });
        } catch (e) { console.error("Parse error", e.message); }
    } else {
        console.log("Could not find form data");
    }
  });
});
