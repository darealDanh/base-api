const mongoose = require('mongoose')

const config = require('./utils/config')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI).then(() => {
    console.log('connected to MongoDB')
    const blogSchema = new mongoose.Schema({
      title: String,
      author: String,
      url: String,
      likes: Number
    })
    
    blogSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })
    const Blog = mongoose.model('Blog', blogSchema)
    const blog = new Blog({
        title: 'Test Title',
        author: 'Test Author',
        url: 'Test URL',
        likes: 0
    })
    blog.save().then(result => {
        console.log('blog saved!')
        mongoose.connection.close()
    }
    )
    }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})
