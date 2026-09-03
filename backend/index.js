const express = require('express')
const bcrypt = require('bcrypt');
const { userModel, taskModel, orgModel } = require('./db');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://kmtyagi_db_user:kmtyagi_db_password@cluster0.z8clgz0.mongodb.net/myTrelloDB')
.then(()=>{console.log('connected to db...')})
.catch((err)=> {console.log(err)})

const app = express()

app.use(express.json());

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const userName = req.body.userName;
    const email = req.body.email;
    const org = req.body.org;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new userModel({
        userName,
        email,
        org,
        password : hashedPassword
    })

    await newUser.save();

    res.status(200).send({
        status : true,
        message : "user created successfully"
    })
})

app.get('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await userModel.findOne({email});
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            res.status(200).send({
                status : true,
                messsage : "sign in successfull"
            })
        }else{
            res.status(401).send({
                status : false,
                message : "Incorrect email or password"
            })
        }

    }catch(err){
        res.status(401).send({
            status : false,
            message : 'sign in failed'
        })
    }
})

app.post('/task', async(req, res) => {

    const task = req.body.task;
    const status = req.body.status;
    const teamName = req.body.teamName;
    const org = req.body.org;

    try{
        const newTask = new taskModel({
            task,
            status,
            teamName,
            org
        })

        await newTask.save();

        res.status(200).send({
            status : true,
            message : "task created successfully"
        })
    }catch(err){
        res.status(406).send({
            status : false,
            message : "could not created the task"
        })
    }

})

app.get('/task', async (req, res) => {
    const teamName = req.body.teamName;
    const org = req.body.org;

    try{
        const allTask = await taskModel.find({teamName, org});

        res.status(200).send({
            status : true,
            payload : allTask,
            message : "fetched all task successfully"
        })

    }catch(err){
        res.send(404).send({
            status : false,
            message : "could not fetch the tasks"
        })
    }
})

app.put('/task/update/:taskId', async (req, res)=>{

    const taskId = req.params.taskId;
    const task = req.body.task;
    const status = req.body.status;
    const teamName = req.body.teamName;
    const org = req.body.org;

    try{
        await taskModel.findOneAndReplace({_id :taskId}, 
            {
                task, status, teamName, org
            }
        )
        res.status(200).send({
            status : true,
            message : "task updated successfully"
        })
    }catch(err){
        console.log('err', err)
        res.status(501).send({
            status : false,
            message : 'could not update the task'
        })
    }

})

app.listen(3000, ()=> {
    console.log("server is running on port 3000...")
})