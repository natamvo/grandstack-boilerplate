/* Definition */
const UserQueries = `

type User {
  ID: ID
  full_name: String!
  email: String!
  password: String! @hideTheField
  token: String @hideTheField
  avatar: String
  rating: Float
  verified: Boolean
  softDeleted: Boolean
  roles: [Role] @relation(name: "PLAYS", direction: "OUT")
}
type DeletedUser {
  deleted: Boolean
}
type LoginUser {
  token: String
}
type Role {
  name: String!
}

type Query {
  Users(full_name: String): [User]
  UserById(ID: String!): [User]
  UsersByName(substring: String): [User]
    @cypher(
      statement: "MATCH (u:User) WHERE u.full_name CONTAINS $substring and u.softDeleted=false RETURN u"
    )
  Myself(searchUserInput: searchUserInput) : User
  @cypher(
    statement: "Match (u:User {email: $searchUserInput.email}) return u"
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
          u.full_name = $dataUserInput.full_name, \
          u.email = $searchUserInput.email, \
          u.password = $dataUserInput.password, \
          u.token = $dataUserInput.token, \
          u.created = datetime(), \
          u.softDeleted = false, \
          u.verified = false \
        ON MATCH SET \
          u.full_name = $dataUserInput.full_name, \
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
          u.last_name = $dataUserInput.full_name, \
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
  ): DeletedUser
    @cypher(
      statement: 
        "MATCH (u:User {email: $searchUserInput.email}) \
        SET u.softDeleted = true \
        RETURN {deleted: true}"
    )

  DeleteUser (
    searchUserInput: searchUserInput
  ): DeletedUser
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
  full_name: String!
  password: String!
}

input loginUserInput {
  email: String!
  password: String!
}
`

export { UserQueries }
