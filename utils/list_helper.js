

var _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
    

    
    }

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return
    }
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    if (maxLikes === 0) {
      return
    }
    return blogs.find(blog => blog.likes === maxLikes)
    }

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return
    }
    const authorBlogs = _.countBy(blogs, 'author')
    const maxBlogs = Math.max(...Object.values(authorBlogs))
    if (maxBlogs === 0) {
      return
    }
    const author = Object.keys(authorBlogs).find(author => authorBlogs[author] === maxBlogs)
    return { author, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return
    }
    const authorLikes = _.groupBy(blogs, 'author')
    const authorLikesSum = _.mapValues(authorLikes, authorBlogs => authorBlogs.reduce((sum, blog) => sum + blog.likes, 0))
    const maxLikes = Math.max(...Object.values(authorLikesSum))
    if (maxLikes === 0) {
      return
    }
    const author = Object.keys(authorLikesSum).find(author => authorLikesSum[author] === maxLikes)
    return { author, likes: maxLikes }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }

