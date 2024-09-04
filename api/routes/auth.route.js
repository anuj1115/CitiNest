import { google, signin, signout, signup } from "../controllers/auth.controller.js"
import express from "express"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post('/google', google)
router.get('/signout', signout)


export default router