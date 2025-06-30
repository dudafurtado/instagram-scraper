import router from '@adonisjs/core/services/router'

const InstagramController = () => import('#controllers/instagram_controller')
const RelationshipsController = () => import('#controllers/relationships_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/follow', [InstagramController, 'follow'])
router.get('/follow/files', [InstagramController, 'checkFiles'])
router.get('/follow/data', [InstagramController, 'checkData'])

router.get('/relationship', [RelationshipsController, 'compare'])
