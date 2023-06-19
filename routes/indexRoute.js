import express from "express";
import {home, addTask, allTask, chat} from '../controllers/indexController.js'

const router = express.Router()

router.get('/', home)
router.get('/addTask', addTask)
router.get('/allTask', allTask)
router.get('/chatBot', chat)

export default router