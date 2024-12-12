import app from './app.js'
import { connectDB } from './db/connection.js'

// connection and listeners

connectDB()
.then(() => {
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is listening on port : ",process.env.PORT)
})
}) 
.catch((err) => console.log("Error in listening server in index.ts : ", err))