const listHelper = require('../utils/list_helper')

test('dummy is called', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogPost =     {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }

  const blogPost2 =
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }

  const listWithOneBlog = [blogPost]

  test('empty list should have 0 likes', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
    
  })

  test('when list has only one blog equals the likes of that', () => {
   const result = listHelper.totalLikes(listWithOneBlog)
   expect(result).toBe(5)
  })

  test('list with multiple items should have their likes calculated correctly', () => {
    const blogs = [blogPost, blogPost2, blogPost]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(22)
  })
})