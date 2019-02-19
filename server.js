const express = require('express')
const fs = require('fs')
const formidable = require('formidable')
const uuidv1 = require('uuid/v1')
const socketio = require('socket.io')

const multer = require('multer')

const imageUploadStorage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,__dirname+'/multer_uploads')
    },
    filename: (req,file,callback)=>{
        req.fileName = uuidv1() + file.originalname
        callback(null, req.fileName)
    }
})
const imageUpload = multer({storage: imageUploadStorage})
const imageMiddleWare = imageUpload.fields([{name:'image', maxCount: 1}])

const app = express()
const server = app.listen(80)

const io = socketio.listen(server)

var emitdata

var imgdatas = []

io.on('connection',(socket)=>{
    console.log('connected user', socket.handshake.address)
    socket.emit('connection', imgdatas)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/gallery', (req,res)=>{
    res.sendFile(__dirname + '/public/gallery.html')
})

app.post('/upload', imageMiddleWare,(req, res) => {
    let response = {status:'success', fileName: req.fileName}
    res.json(response)
})



