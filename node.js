require('dotenv').config();


const app = require('./src/app');




const PORT =process.env.port || 4000;

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});