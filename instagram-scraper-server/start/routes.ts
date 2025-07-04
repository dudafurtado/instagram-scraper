import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const InstagramController = () => import('#controllers/instagram_controller')
const RelationshipsController = () => import('#controllers/relationships_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/instagram/login', [AuthController, 'store'])

router.post('/instagram/follow', [InstagramController, 'follow'])
router.get('/instagram/follow/files', [InstagramController, 'checkFiles'])
router.get('/instagram/follow/data', [InstagramController, 'checkData'])

router.get('/instagram/relationship', [RelationshipsController, 'compare'])
