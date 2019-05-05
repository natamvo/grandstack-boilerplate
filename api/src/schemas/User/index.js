
import Users from './UseCases/Users'
import CreateUser from './UseCases/CreateUser'
import UpdateUser from './UseCases/UpdateUser'
import DeleteUser from './UseCases/DeleteUser'
import LoginUser from './UseCases/LoginUser'
import ForgotPassword from './UseCases/ForgotPassword'
import UsersByName from './UseCases/UsersByName'

export const resolvers = {
    Query: {
        Users,
        UsersByName,
    },
    Mutation: {
        CreateUser,
        UpdateUser,
        DeleteUser,
        LoginUser,
        ForgotPassword,
    }
};

export * from './schema.graphql';
