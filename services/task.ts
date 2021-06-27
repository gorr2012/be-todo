const Task = require('../models/Task');
import TPagination from '../models/Task';
const JSONStream = require('JSONStream');
import { Response } from "express";
import { Types } from 'mongoose';

async function getAllTasks({ page, limit }: TPagination, res: Response) {
  return await Task.find({})
    .sort({_id: -1})
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res);
}

async function deleteTask(id: Types.ObjectId) {
  return await Task.deleteOne({_id: id});
}

async function addTask(obj: Object) {
  const task = new Task(obj);
  return await task.save();
}

async function findTask(id: number) {
  return await Task.findOne({_id: id});
}

async function updateTask(id: number, obj: Object) {
  return await Task.updateOne({_id: id}, obj);
}

export {
  getAllTasks,
  deleteTask,
  addTask,
  findTask,
  updateTask
}
