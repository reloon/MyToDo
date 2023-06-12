import express from "express";
import {home, addTask, allTask} from '../controllers/indexController.js'

const router = express.Router()

router.get('/', home)
router.get('/addTask', addTask)
router.get('/allTask', allTask)

export default router