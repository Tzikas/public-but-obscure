const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const socketIo = require("socket.io");
const http = require('http')

require('dotenv').config();


const URI = process.env.MONGODB_URI || 'mongodb://localhost/GumRoad'
console.log(URI)
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(x => console.log(`Connected to ${x.connections[0].name}`))
    .catch(() => console.error("Error connecting to Mongo"))





app.use(express.json())

// app.use(cors({
//     origin: ['http://localhost:3000', process.env.clientURL] //Add client urls to allow CORS
// }))
app.use(cors())


const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

//Allows socket to be combined with routes
app.set("socketIo", io);



app.use('/api', require('./routes.js'))





const PORT = process.env.PORT || 8000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))