let express = require('express')
let router = express.Router()
let delegatorsScript = require('../modules/delegators')
let info = require('../modules/accinfo')
let db = require('../db')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.steemconnect) {
    res.redirect('/dashboard')
  } else {
    res.redirect('/feed/approved')
  }
})

router.get('/@:username?', (req, res, next) => {
  info.getAccountInfo(req.params.username).then(async d => {
    let posts = await db.post.find({author: req.params.username}).sort({time: -1}).limit(10)
    if (res.logged) res.render('profile', {
      d,
      posts,
      logged: res.logged,
      mod: res.mod,
      username: req.session.steemconnect.name
    })
    else res.render('profile', {
      d,
      posts,
      logged: res.logged,
      mod: res.mod
    })
  })
})

router.get('/faq', (req, res, next) => {
  res.render('faq', {
    logged: res.logged,
    mod: res.mod
  })
})

router.get('/supporters', (req, res, next) => {
  delegatorsScript.loadDelegations('memeit.lol', function (delegators) {
    res.render('supporters', {
      delegators,
      logged: res.logged,
      mod: res.mod
    })
  })
})

router.get('/:category/@:username/:permlink', (req, res, next) => {
  info.getPostAndComments(req.params.username, req.params.permlink).then(async i => {
    i.img = await info.getImg(i.author)
    return i
  }).then(async i => {
    i.comments = await info.getComments(i.author, i.permlink)
    return i
  }).then(i => {
    if (res.logged) res.render('single', {
      i,
      logged: res.logged,
      mod: res.mod,
      username: req.session.steemconnect.name
    })
    else res.render('single', {
      i,
      logged: res.logged,
      mod: res.mod
    })
  })
})

router.get('/@:username/:permlink', (req, res, next) => {
  info.getPostAndComments(req.params.username, req.params.permlink).then(async i => {
    i.img = await info.getImg(i.author)
    return i
  }).then(async i => {
    i.comments = await info.getComments(i.author, i.permlink)
    return i
  }).then(i => {
    if (res.logged) res.render('single', {
      i,
      logged: res.logged,
      mod: res.mod,
      username: req.session.steemconnect.name
    })
    else res.render('single', {
      i,
      logged: res.logged,
      mod: res.mod
    })
  })
})

module.exports = router
