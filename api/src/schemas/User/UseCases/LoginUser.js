import { ApolloError } from "apollo-server"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export default async (obj, params, ctx, resolveInfo) => {
  params.loginUserInput.password = crypto.createHmac('sha256', process.env.HASH_SECRET).update(params.loginUserInput.password).digest('hex')

  const session = ctx.driver.session();
  const cypher = `MATCH (rl:Role)<-[r]-(u:User {password: '${params.loginUserInput.password}', email: '${params.searchUserInput.email}'}) return rl,u`
  return session.run(cypher, params)
    .then(result => {
      if (result.records.length > 0) {
        const user = {
          id: result.records[0].get('u').properties.ID,
          email: result.records[0].get('u').properties.email,
          full_name: result.records[0].get('u').properties.full_name,
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
