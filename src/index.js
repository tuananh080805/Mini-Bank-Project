require("dotenv").config()
const express = require('express')
const cors = require('cors')

const errorHandler = require('./middleware/errorHandler')
const userRouter = require('./routes/userRoutes')
const verifyUserRouter = require('./routes/verifyRoutes')
const transactionRouter = require('./routes/transactionRoutes')
const userInfoRouter = require('./routes/userInfoRoutes')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/user',userRouter)
app.use('/verify', verifyUserRouter)
app.use('/transaction', transactionRouter)
app.use('/user-info', userInfoRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
