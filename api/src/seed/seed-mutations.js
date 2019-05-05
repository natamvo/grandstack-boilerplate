export default /* GraphQL */ `
  mutation {
    u1: CreateUser(name: "Admin", email: "admin@email.com", password: "${process.env.ADMIN_PASSWORD}", role: "ADMIN") {
      id
      name
      email
    }
    u2: CreateUser(name: "User", email: "user@email.com", password: "${process.env.ADMIN_PASSWORD}", role: "SUBSCRIBER") {
      id
      name
      email
    }
  }
`;
