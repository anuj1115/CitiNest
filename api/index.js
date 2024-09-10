import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path'

dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log(err);
    
})

const _dirname = path.resolve()

const app = express()

// this will allow us to send data to server
app.use(express.json());

app.use(cookieParser());

app.listen(3000,() => {
    console.log('Server is running on port 3000');
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)

app.use(express.static(path.join(_dirname, '/client/dist')))

app.get('*', (req,res) => {
    res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'))
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})

