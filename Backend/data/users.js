import bcrypt from "bcryptjs"

const users=[
    {
        name: "Admin User",
        email: "admin@example.com",
        password:bcrypt.hashSync("123456",10),
        isAdmin:true
    },
    {
        name: "john doe",
        email: "john@example.com",
        password:bcrypt.hashSync("123456",10)
    },
    {
        name: "dane joe",
        email: "dane@example.com",
        password:bcrypt.hashSync("123456",10)
    }
]

export default users