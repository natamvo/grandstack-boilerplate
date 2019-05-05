const typeDefs = `

    type User {
      ID: ID!
      name: String!
      email: String!
      password: String! @hideTheField
      token: String @hideTheField
      avatar: String
      rating: Float
      verified: Boolean
      softDeleted: Boolean
      roles: [Role] @relation(name: "PLAYS", direction: "OUT")
    }

    enum _UserOrdering {
      name_asc
      name_desc
      email_asc
      email_desc
    }


    type LoginUser {
      token: String
    }

    type Role {
      name: String!
    }

    type Query {
      Users(ID: ID, name: String, first: Int = 10, offset: Int = 0, orderBy: _UserOrdering): [User]
      UsersByName(substring: String): [User]
        @cypher(
          statement: "MATCH (u:User) WHERE u.name CONTAINS $substring and u.softDeleted=false RETURN u"
        )
    }

    type Mutation {
      CreateUser (
        name: String!
        email: String!
        password: String!
        role: String = "SUBSCRIBER"
      ): User
        @cypher(
          statement:
            "CREATE (u:User { \
              ID: apoc.create.uuid(), \
              name: $name, \
              email: $email, \
              password: $password, \
              created: datetime(), \
              softDeleted: false, \
              verified: false \
            }) \
            MERGE (r:Role {name: $role}) \
            CREATE (u)-[rp:PLAYS]->(r) \
            RETURN u"
        )

      UpdateUser (
        name: String
        email: String
        password: String
      ): User
        @cypher(
          statement:
            "MATCH (u:User {email: $email}) \
            SET \
              u.name = $name, \
              u.email = $email, \
              u.password = $password, \
              u.verified = $verified, \
              u.updated = datetime() \
            RETURN u"
        )

      ForgotPassword (
        email: String!
      ): Boolean

      SoftDeleteUser (
        ID: ID!
      ): Boolean
        @cypher(
          statement:
            "MATCH (u:User {ID: $ID}) \
            SET u.softDeleted = true \
            RETURN {deleted: true}"
        )

      DeleteUser (
        ID: ID!
      ): Boolean
        @cypher(
          statement:
            "MATCH (u:User {ID: $ID})-[r]-(p) \
            Delete u,r \
            RETURN {deleted: true}"
        )

      LoginUser (
        email: String!
        password: String!
      ): LoginUser
    }

`

export { typeDefs }
