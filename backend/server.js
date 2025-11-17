const app = require('./app.js');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./database/database.js');


dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});