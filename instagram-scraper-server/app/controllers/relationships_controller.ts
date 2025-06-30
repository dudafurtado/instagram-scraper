import type { HttpContext } from '@adonisjs/core/http'
import RelationshipService from '#services/relationship_service'

export default class RelationshipsController {
  public async compare({ request, response }: HttpContext) {
    const id = request.input('id')

    if (!id) {
      return response.badRequest({ error: 'Informe o ID do usuário.' })
    }

    const result = await RelationshipService.compare(id)

    return response.json(result)
  }
}
