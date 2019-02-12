const express = require('express')
const fs = require('fs')
const formidable = require('formidable')
const uuidv1 = require('uuid/v1')
const socketio = require('socket.io')

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

app.post('/upload', (req, res) => {
    //parsing the data as multipart form data

    //only after file is uploaded // directly using parse results in incomplete files
    new formidable.IncomingForm().parse(req)  
    .on('file', (name, file)=>{ 
        //getting the temporary file save location
        var oldpath = file.path
        //setting the new directory //directory has to be made prior to this
        var newfilename = uuidv1() + file.name
        var relpath = './uploads/' + newfilename
        var newpath = __dirname + '/public/uploads/' + newfilename
        //renaming which is the same as moving from one directory to another

        //setting 10 second timeout just in case request fails
        var timeout = setTimeout(()=>{
            res.json({status:'error'})
        }, 10000)

        fs.rename(oldpath,newpath,(err)=>{
            if(err) return res.json({status: 'error'})            
            clearTimeout(timeout)
            imgdata = {
                src: relpath
            }
            imgdatas.push(imgdata)
            io.emit('newimg', imgdata)
            res.json({status:'success'})
        })

    })
})



