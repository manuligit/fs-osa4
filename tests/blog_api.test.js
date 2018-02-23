const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeAll(async () => {
  await Blog.remove({})

  let blogObject = new Blog(blogs[0])
  await blogObject.save()

  blogObject = new Blog(blogs[1])
  await blogObject.save()
})


describe('tests for /api/get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(2)
  })

  test('blog post from database should have the same name', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
  })
})

describe('test for /api/post', () => {
  test('posted blogs can be found from database', async () => {
    const initialBlogs = await api.get('/api/blogs')
    //console.log(initialBlogs.body)

    const blogPost = {
      title: "Amazing new article - watch pictures",
      author: "Jonna Joutsen",
      url: "http://www.google.com",
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(blogPost)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.body.length+1)
    expect(contents).toContain('Amazing new article - watch pictures')
  })

  test('blog without likes field should return 0 likes', async () => {
    const initialBlogs = await api.get('/api/blogs')

    const blog = {
      title: "What went wrong?",
      author: "Mikko Mallikas",
      url: "http://www.google.com"
    }

    await api 
      .post('/api/blogs')
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    expect(likes[initialBlogs.body.length]).toBe(0)
  })

  // test('post without author should not be saved', async () => {
  //   const intialBlogs = await api.get('/api/notes')
  //   const failBlog = {
  //     title: "Where is the author?",
  //     url:  "http://www.google.com",
  //     likes: 0
  //   }

  //   await api
  //     .post('/api/blogs')
  //     .send(blogPost)
  //     .expect(400)
    
  //     const response = await api.get('/api/blogs')

  //     expect(response.body.length).toBe(intialBlogs.body.length)

  // })

  //test that posting without likes creates likes: 0
  //

})

afterAll(() => {
  server.close()
})