const tokenExtractor = (request, response, next) => {
  //ottaa tokenin Authorization-headerista ja
  //sijoittaa sen request-olion kenttään token.
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    //console.log(request.token)
    next()
  } else {
    request.token = null
    next()
  }
}

module.exports = {
  tokenExtractor
}