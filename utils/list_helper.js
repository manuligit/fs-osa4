const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

 return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (largest, item) => {
    return (item.likes > largest.likes) ? item : largest;
  }

  return blogs.length === 0 ? [] : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  //if no blogs, return empty object
  if (blogs.length === 0) {
    return {}
  }
  //map authors
  const authors = blogs.map(x => x.author)
  //console.log(authors)
  
  //count unique items in the author list
  let unique = []
  let uniquecounts = []

  authors.forEach(element => {
   if (unique.includes(element)) {
     console.log('included')
     index = unique.indexOf(element)
     uniquecounts[index] += 1
   } else {
     unique.push(element)
     uniquecounts.push(1)
   }
  })

  //console.log(unique)
  //console.log(uniquecounts)

  const findLargest = (largest, item) => {
    return (item > largest) ? item : largest;
  }
  //find largest count and it's index and return it
  largest = uniquecounts.reduce(findLargest, uniquecounts[0])
  const largestindex = uniquecounts.findIndex(item => item === largest )

  const item = {author: unique[largestindex], blogs: uniquecounts[largestindex]}
  console.log(item)
  return item
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}