const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
  
    res.json(blogs.map((blog) => blog.toJSON()))
})
  
blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
  
    if (blog) {
      res.json(blog.toJSON())
    } else {
      res.status(404).end()
    }
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
  
    const user = req.user
  
    if (!user) {
      return res.status(401).json({ error: 'token is missing or invalid' })
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user,
      likes: body.likes
    })
  
    if (!blog.title && !blog.url) {
      res.status(400).end()
    } else {
      if (!blog.likes) {
        blog.likes = 0
      }
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save({ validateModifiedOnly: true })
  
      res.status(201).json(savedBlog.toJSON())
    }
})
  
blogsRouter.delete('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(204).end()
    }
  
    const user = req.user
    if (user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    } else{
      return res.status(401).end()
    }
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      blog,
      { new: true }
    )
    res.json(updatedBlog.toJSON())
})
  
module.exports = blogsRouter