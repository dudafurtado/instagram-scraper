import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const FriendshipsController = () => import('#controllers/friendships_controller')
const InteractionsController = () => import('#controllers/interactions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/instagram/login', [AuthController, 'store'])
router.get('/instagram/session', [AuthController, 'show'])
router.delete('/instagram/logout', [AuthController, 'destroy'])

router.get('/instagram/interaction', [InteractionsController, 'interaction'])

router.get('/instagram/accounts', [AccountsController, 'index'])
router.get('/instagram/account', [AccountsController, 'show'])
router.post('/instagram/accounts', [AccountsController, 'store'])

router.get('/instagram/collect', [FriendshipsController, 'collect'])
router.get('/instagram/friendships', [FriendshipsController, 'index'])
router.get('/instagram/compare', [FriendshipsController, 'compare'])
