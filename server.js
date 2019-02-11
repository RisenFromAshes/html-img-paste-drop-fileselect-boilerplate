const express = require('express')
const fs = require('fs')
const formidable = require('formidable')
const uuidv1 = require('uuid/v1')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/upload', (req, res) => {
    //parsing the data as multipart form data

    //only after file is uploaded // directly using parse results in incomplete files
    new formidable.IncomingForm().parse(req)  
    .on('file', (name, file)=>{ 
        //getting the temporary file save location
        var oldpath = file.path
        //setting the new directory //directory has to be made prior to this
        var newpath = __dirname + '/uploads/' + uuidv1() + file.name
        //renaming which is the same as moving from one directory to another
        fs.rename(oldpath,newpath,(err)=>{
            if(err) return console.log(err)
            console.log('File uploaded and moved')
        })

    })
})

app.listen(80)

