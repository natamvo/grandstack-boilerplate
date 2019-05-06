import { ApolloError } from "apollo-server"
import crypto from 'crypto'

export default async (obj, params, ctx, resolveInfo) => {
  const newPassword = Math.random().toString(36).substr(2, 9)
  const newPasswordHash = crypto.createHmac('sha256', process.env.SECRET).update(newPassword).digest('hex')
  const session = ctx.driver.session()

  const fn = await session
    .run(`MATCH (u:User {email:"${params.email}""}) return u`)
    .then((result) => {
      if (result.records.length > 0) {
        return session.run(`MATCH (u:User {email:"${params.email}"}) SET u.password="${newPasswordHash}" return u`)
          .then(function (result) {
            if (result.records.length > 0) {
              session.close()
              if (process.env.APP_ENV === 'development') {
                console.log('New password:', newPassword)
              }
              return true
            } else {
              session.close()
              throw new ApolloError('db_fail', 200, ['I`m having trouble saving info! Please try again']);
            }
          })
      } else {
        session.close()
        throw new ApolloError('user_not_found', 401, ['This is not a valid user! Please try again']);
      }
    })
  return true
}
