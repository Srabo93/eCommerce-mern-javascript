import { connectDB } from './config/database.js'
import { User } from './models/User.js'
import { Product } from './models/Product.js'
import { Order } from './models/Order.js'
import users from './data/users.js'
import products from './data/products.js'

await connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }))

    await Product.insertMany(sampleProducts)

    console.log('Data imported!')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data deleted!')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
