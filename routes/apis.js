const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')
const restController = require('../controllers/api/restController.js')
const commentController = require('../controllers/api/commentController.js')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticateAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// 首頁
router.get('/', authenticated, (req, res) => res.redirect('/api/restaurants'))
// 美食達人
router.get('/users/top', authenticated, userController.getTopUser)
// following 功能
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// 查看 User Profile
router.get('/users/:id', authenticated, userController.getUser)
// Edit User Profile
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
// 前台餐廳列表
router.get('/restaurants', authenticated, restController.getRestaurants)
// 取得最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// 人氣餐廳 top restaurants
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
// 單一餐廳 detail
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 單一餐廳 Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
// 我的最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// Like 功能
router.post('/like/:restaurantId', authenticated, userController.clickToLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// 新增評論
router.post('/comments', authenticated, commentController.postComment)
// 刪除評論
router.delete('/comments/:id', authenticated, authenticateAdmin, commentController.deleteComment)
// 取得後台餐廳清單列表
router.get('/admin/restaurants', authenticated, authenticateAdmin, adminController.getRestaurants)

// 取得後台單一餐廳清單
router.get('/admin/restaurants/:id', authenticated, authenticateAdmin, adminController.getRestaurant)
// 新增單一餐廳
router.post('/admin/restaurants/', authenticated, authenticateAdmin, upload.single('image'), adminController.postRestaurant)
// 刪除單一餐廳
router.delete('/admin/restaurants/:id', authenticated, authenticateAdmin, adminController.deleteRestaurant)
// 修改單一餐廳
router.put('/admin/restaurants/:id', authenticated, authenticateAdmin, upload.single('image'), adminController.putRestaurant)

// 後台瀏覽全部類別
router.get('/admin/categories', authenticated, authenticateAdmin, categoryController.getCategories)
// 新增類別
router.post('/admin/categories', authenticated, authenticateAdmin, categoryController.postCategory)
// 修改類別
router.put('/admin/categories/:id', authenticated, authenticateAdmin, categoryController.putCategory)
// 刪除類別
router.delete('/admin/categories/:id', authenticated, authenticateAdmin, categoryController.deleteCategory)

// 後台瀏覽全部使用者
router.get('/admin/users', authenticated, authenticateAdmin, adminController.getUsers)
// 後台 user toggle role
router.put('/admin/users/:id/toggleAdmin', authenticated, authenticateAdmin, adminController.toggleAdmin)

// JWT signin
router.post('/signin', userController.signIn)
// register
router.post('signup', userController.signUp)


module.exports = router
