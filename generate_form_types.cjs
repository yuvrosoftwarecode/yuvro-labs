const fs = require('fs');
const html = fs.readFileSync('form.html', 'utf8');
const match = html.match(/var FB_PUBLIC_LOAD_DATA_ = (.*?);<\/script>/);
if (match) {
    const data = JSON.parse(match[1]);
    const fields = data[1][1];
    
    const parsedFields = fields.filter(f => f[4] && f[4][0]).map(f => {
        const typeId = f[3];
        let typeStr = 'text';
        let options = [];
        
        if (typeId === 0) typeStr = 'text';
        else if (typeId === 1) typeStr = 'textarea';
        else if (typeId === 2 || typeId === 5) {
            typeStr = 'radio';
            if (f[4][0][1]) options = f[4][0][1].map(opt => opt[0]);
        }
        else if (typeId === 3) {
            typeStr = 'select';
            if (f[4][0][1]) options = f[4][0][1].map(opt => opt[0]);
        }
        else if (typeId === 4) {
            typeStr = 'checkbox';
            if (f[4][0][1]) options = f[4][0][1].map(opt => opt[0]);
        }
        else if (typeId === 9) typeStr = 'date';
        
        return {
            label: f[1].replace(/"/g, '\\"').replace(/\n/g, ' '),
            id: 'entry.' + f[4][0][0],
            type: typeStr,
            options: options.filter(o => o !== null && o !== undefined && o !== "")
        };
    });
    
    fs.writeFileSync('fields.json', JSON.stringify(parsedFields, null, 2));
    console.log("Written fields.json");
} else {
    console.log("Could not find data");
}
