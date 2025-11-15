import 'dotenv/config'
import express from 'express'
import userRoutes from './routes/user.routes.js'
import studentRoutes from './routes/student.routes.js'
import errorHandler from './middlewares/errorHandler.js'
import allocationRoutes from './routes/allocation.routes.js'

const app = express()
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/student', studentRoutes)
app.use('/admin', allocationRoutes)

// simple root route /
app.get('/', (req, res) => {
    res.send('Hostel Seat Allocation API is up')
})

// global error handler (must be registered after routes)
app.use(errorHandler)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})


