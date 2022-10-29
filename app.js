
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));

//setting up our animals database

mongoose.connect("mongodb://localhost:27017/animalsDB",{useNewURLParser:true});


const animalsSchema= new mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please specify animal name"]
    },
    type: String,
    details: String
});

const Animal = mongoose.model("Animals",animalsSchema);

const lion = new Animal({
    name: "Lion",
    type: "Mammal",
    details: "The lion (Panthera leo) is a large cat of the genus Panthera native to Africa and India."
});


//request for all animals//

app.route("/animals").get((req,res)=>
{
    Animal.find({},(err,foundAnimal)=>
    {
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(foundAnimal);         //JSON object
        }

    });

})
.post((req,res)=>
{
    const animal= new Animal({
        name: req.body.name,               //from Postman
        type: req.body.type,
        details: req.body.details
    });
    animal.save((err)=>
    {
        if(!err)
        {
            res.send("Saved Successfully");
        }
        else{
            res.send(err);
        }
    });
})
.delete((req,res)=>
{
    Animal.deleteMany({},(err)=>
    {
        if(!err){
            res.send("Deleted Successfully");
        }
        else{
            res.send(err);
        }
    });
});

//request for specific animals//

app.route("/animals/:animalName").get((req,res)=>
{
    Animal.findOne({name: req.params.animalName},(err,foundAnimal)=>
    {
        if(!err)
        {
            res.send(foundAnimal);
        }
        else
        {
            res.send(err);
        }
    });
}).put((req,res)=>
{
    Animal.updateOne({name: req.params.animalName},{name: req.body.name, type: req.body.type, details: req.body.details},(err,foundAnimal)=>
    {
        if(!err)
        {
            res.send("Successfully Updated");
        }
        else{
            res.send(err);
        }
    });
}).patch((req,res)=>
{
   Animal.updateOne({name: req.params.animalName},{$set: req.body},(err,foundAnimal)=>
   {
        if(!err)
        {
            res.send("Updated Successfully");
        }
        else{
            res.send(err);
        }
   });
}).delete((req,res)=>
{
    Animal.deleteOne({name: req.params.animalName},(err)=>
    {
        if(!err)
        {
            res.send("Deleted Successfully");
        }
        else
        {
            res.send(err);
        }
    });
});

app.listen(3000,(req,res)=>
{
    console.log("Server started on port 3000");
});