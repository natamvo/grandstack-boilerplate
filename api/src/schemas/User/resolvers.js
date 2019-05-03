import Users from './UseCases/Users'
import CreateUser from './UseCases/CreateUser'
import UpdateUser from './UseCases/UpdateUser'
import DeleteUser from './UseCases/DeleteUser'
import LoginUser from './UseCases/LoginUser'
import ForgotPassword from './UseCases/ForgotPassword'
import UserById from './UseCases/UserById'
import UsersByName from './UseCases/UsersByName'
import Myself from './UseCases/Myself'

const resolvers = {
    Query: {
        Users,
        UsersByName,
        UserById,
        Myself,
    },
    Mutation: {
        CreateUser,
        UpdateUser,
        DeleteUser,
        LoginUser,
        ForgotPassword,
    }
};

export { resolvers }
