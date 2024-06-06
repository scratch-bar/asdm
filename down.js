const axios = require('axios');
const fs = require('fs');

let results = [
   {
      url: 'https://downloads.scratch.mit.edu/desktop/Scratch%20Setup.exe',
      description: 'Windows 下载',
      fileName: 'scratch-win.exe',
      icon: 'mdi-microsoft-windows'
   }, {
      url: 'https://downloads.scratch.mit.edu/desktop/Scratch.dmg',
      description: 'macOS 下载',
      fileName: 'scratch-mac.dmg',
      icon: 'mdi-apple'
   }
];

if (!(fs.existsSync('output') && fs.statSync('output').isDirectory)) fs.mkdirSync('output');
else fs.readdirSync('output').forEach(fileName => fs.rmSync(`output/${fileName}`, { force: true }));

results.forEach(t => {
   axios({
      url: t.url,
      method: 'get',
      responseType: 'stream'
   })
      .then((response) => {
         let byteCount = 0, byteSum = 0, partCount = 0;
         let interval = setInterval(() => {
            console.log(`${t.description}: ${((byteSum + byteCount) / 1024 / 1024).toFixed(2)} MB downloaded.`);
         }, 1000);
         response.data.on('data', (chunk) => {
            fs.appendFileSync(`output/${t.fileName}.${partCount}`, chunk);
            byteCount += chunk.byteLength;
            if (byteCount > 16 * 1024 * 1024) {
               partCount++;
               byteSum += byteCount;
               byteCount = 0;
            }
         });
         response.data.on('end', () => {
            byteSum += byteCount;
            t.download = [];
            t.size = byteSum;
            t.time = (new Date()).getTime();
            for (let i = 0; i <= partCount; i++) {
               t.download.push(`${t.fileName}.${i}`);
            }
            clearInterval(interval);
         })
      })
})

process.on("exit", () => {
   fs.writeFileSync("output/data.json", JSON.stringify(results));
});
