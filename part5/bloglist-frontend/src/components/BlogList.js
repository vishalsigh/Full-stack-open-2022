import React from 'react'
import PropTypes from 'prop-types'

import Blog from './Blog'

const BlogList = ({ blogs, handleLike, handleBlogDelete, loggedUser }) => (
  <div>
    {blogs.map(blog => (
      <Blog key={blog.id} blog={blog} loggedUser={loggedUser}
      handleLike={() => handleLike(blog)} 
      handleBlogDelete={() => handleBlogDelete(blog)} />
    ))}
  </div>
)

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleBlogDelete: PropTypes.func.isRequired,
  loggedUser: PropTypes.string.isRequired
}

export default BlogList