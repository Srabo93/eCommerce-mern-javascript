import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI not set')
    process.exit(1)
  }
  await mongoose.connect(uri, { maxPoolSize: 10 })
  console.log(`MongoDB connected: ${mongoose.connection.host}`)
}
