import express from "express";
import {home, addTask} from '../controllers/indexController.js'

const router = express.Router()

router.get('/', home)
router.get('/addTask', addTask)

export default router