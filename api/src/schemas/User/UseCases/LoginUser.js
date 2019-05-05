import { ApolloError } from "apollo-server"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export default async (obj, params, ctx, resolveInfo) => {
  params.password = crypto.createHmac('sha256', process.env.SECRET).update(params.password).digest('hex')

  const session = ctx.driver.session();
  const cypher = `MATCH (rl:Role)<-[r]-(u:User {password: '${params.password}', email: '${params.email}'}) return rl,u`
  return session.run(cypher, params)
    .then(result => {
      if (result.records.length > 0) {
        const user = {
          id: result.records[0].get('u').properties.ID,
          email: result.records[0].get('u').properties.email,
          name: result.records[0].get('u').properties.name,
          role: [result.records[0].get('rl').properties.name]
        }
        const token = jwt.sign(user, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE_IN })
        session.close()
        return { token: token }
      } else {
        session.close()
        throw new ApolloError('user_or_password_incorrect', 200, ['User or password is incorrect']);
      }
    })
}
