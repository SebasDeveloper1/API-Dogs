const fs = require('fs');

fs.writeFileSync('./.env', `API_KEY=${process.env.API_KEY}\nAPI=${process.env.API}\nAPI_RANDOM=${process.env.API_RANDOM}\nAPI_RANDOM=${process.env.API_RANDOM}\nAPI_FAVORITES=${process.env.API_FAVORITES}\nAPI_UPLOAD=${process.env.API_UPLOAD}\n`)