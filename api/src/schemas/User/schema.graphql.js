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
        searchUserInput: searchUserInput
        dataUserInput: dataUserInput
      ): User
        @cypher(
          statement:
            "MERGE (u:User {email: $searchUserInput.email}) \
            ON CREATE SET \
              u.ID = apoc.create.uuid(), \
              u.name = $dataUserInput.name, \
              u.email = $searchUserInput.email, \
              u.password = $dataUserInput.password, \
              u.token = $dataUserInput.token, \
              u.created = datetime(), \
              u.softDeleted = false, \
              u.verified = false \
            ON MATCH SET \
              u.name = $dataUserInput.name, \
              u.password = $dataUserInput.password, \
              u.token = $dataUserInput.token, \
              u.updated = datetime() \
            MERGE (r:Role {name: 'SUBSCRIBER'}) \
            CREATE (u)-[rp:PLAYS]->(r) \
            RETURN u"
        )

      UpdateUser (
        searchUserInput: searchUserInput
        dataUserInput: dataUserInput
      ): User
        @cypher(
          statement:
            "MERGE (u:User {email: $searchUserInput.email}) \
            ON CREATE SET \
              u.id = apoc.create.uuid(), \
              u.first_name = $dataUserInput.first_name, \
              u.last_name = $dataUserInput.last_name, \
              u.email = $searchUserInput.email, \
              u.password = $dataUserInput.password, \
              u.created = datetime(), \
              u.softDeleted = false, \
              u.verified = false \
            ON MATCH SET \
              u.last_name = $dataUserInput.name, \
              u.email = $dataUserIpnut.email, \
              u.password = $dataUserInput.password, \
              u.verified = $dataUserInput.verified, \
              u.updated = datetime() \
            RETURN u"
        )

      ForgotPassword (
        searchUserInput: searchUserInput
      ): Boolean

      SoftDeleteUser (
        searchUserInput: searchUserInput
      ): Boolean
        @cypher(
          statement:
            "MATCH (u:User {email: $searchUserInput.email}) \
            SET u.softDeleted = true \
            RETURN {deleted: true}"
        )

      DeleteUser (
        searchUserInput: searchUserInput
      ): Boolean
        @cypher(
          statement:
            "MATCH (u:User {email: $searchUserInput.email})-[r]-(p) \
            Delete u,r \
            RETURN {deleted: true}"
        )

      LoginUser (
        loginUserInput: loginUserInput
      ): LoginUser
    }

    input searchUserInput {
      email: String!
    }

    input dataUserInput {
      name: String!
      password: String!
    }

    input loginUserInput {
      email: String!
      password: String!
    }
`

export { typeDefs }
