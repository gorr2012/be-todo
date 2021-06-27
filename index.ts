require('dotenv').config({ path: __dirname + '/.env' });
import { Request, Response } from "express";
import express from 'express';
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const {
  getAllTasks,
  deleteTask,
  addTask,
  findTask,
  updateTask
} = require('./services/task');

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get("/todos/", async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 100;
  try {
    await getAllTasks({ page, limit }, res);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await findTask(id);
    res.status(200).send(task);  
  } catch (error) {
    res.status(404).send(`404 Not found TODO with id:${id}`);
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteTask(id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ message: `404 Not found TODO with id:${id}` });
  }
});

app.post("/todos", async (req: Request, res: Response) => {
  const { message, complete } = req.body;
  if (!message) {
    return res.sendStatus(400);
  }
  try {
    const task = await addTask({ message, complete });
    res.status(201).send(task);
  } catch (error) {
    res.status(400).json({ message: `Cannot add this TODO` });
  }

});

app.patch("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, complete } = req.body;
  if (!message) {
    return res.sendStatus(400);
  }
  try {
    await updateTask(id, { message, complete });
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ message: `404 Not found TODO with id:${id}` });
  }
});

app.get('*', function(req: Request, res: Response){
  res.status(404).send('404 Page not found');
});

async function start() {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    app.listen(PORT, () => {
      console.log(`Server running at PORT: ${PORT}`);
    });
  } catch (error) {
    console.log('Server Error');
    process.exit(1);
  }
}  

start();
