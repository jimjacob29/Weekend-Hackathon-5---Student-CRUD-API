const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const Joi = require("joi");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
let data = require("./InitialData");
let newId = data.length+1;
app.get("/api/student",(req,res)=>{
    console.log(data);
    res.send(data);
})
app.get("/api/student/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const student = data.find((student)=>(student.id===id));
    if(!student){
        res.status(404);
        return;
    }
    res.send(student);

})
app.post("/api/student",(req,res)=>{
    const schema = Joi.object({
        name:Joi.string().min(1).required(),
        currentClass:Joi.number().min(1).required(),
        division:Joi.string().min(1).required()

    })
    const valObj = schema.validate(req.body);
    // res.send(valObj);
    // return;
    if(valObj.error){
        res.send(400);
        return;
    }
    const student={
        id:newId,
        ...req.body
    }
    newId++;
    data.push(student);
    res.send({id:student.id});


})
app.put("/api/student/:id",(req,res)=>{
    const id =parseInt(req.params.id);
    const index = data.findIndex((student)=>(id===student.id))
    console.log(index);
    if(index===-1){
        res.status(400);
        return;
    }
    if(!req.body.name){
        res.status(400);
        return;
    }
    data[index].name = req.body.name;
    res.send(data[index]);
})

app.delete("/api/student/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const index = data.findIndex((student)=>id===student.id);
    if(index===-1){
        res.status(400);
        return;
    }
    const student={...data[index]};
    data.splice(index,1);
    res.send(student);
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   