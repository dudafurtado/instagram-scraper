import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const FriendshipsController = () => import('#controllers/friendships_controller')
const TestesController = () => import('#controllers/testes_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/instagram/login', [AuthController, 'store'])
router.post('/instagram/logout', [AuthController, 'destroy'])

router.get('/instagram/accounts', [AccountsController, 'index'])
router.get('/instagram/account', [AccountsController, 'show'])
router.post('/instagram/accounts', [AccountsController, 'store'])

router.get('/instagram/collect', [FriendshipsController, 'collect'])
router.get('/instagram/friendships', [FriendshipsController, 'index'])
router.get('/instagram/compare', [FriendshipsController, 'compare'])

router.get('/teste', [TestesController, 'teste'])
