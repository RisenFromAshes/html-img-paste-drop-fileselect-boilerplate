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

        //setting 10 second timeout just in case request fails
        var timeout = setTimeout(()=>{
            res.json({status:'error'})
        }, 10000)

        fs.rename(oldpath,newpath,(err)=>{
            if(err) return res.json({status: 'error'})            
            clearTimeout(timeout)
            res.json({status:'success'})
        })

    })
})

app.listen(80)

