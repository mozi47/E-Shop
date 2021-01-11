import React, {useEffect} from 'react'
import {LinkContainer} from "react-router-bootstrap"
import {Table, Button,} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Message from "../Message"
import Loader from "../Loader"
import {getUsers, deleteUser} from "../../action/userAction"

const UsersScreen = ({history}) => {
    const dispatch = useDispatch()
    const userList = useSelector(state=>state.usersList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state=>state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state=>state.userDelete)
    const { success } = userDelete

    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(getUsers())
        }else{
            history.push("/login")
        }
        // eslint-disable-next-line
    }, [dispatch, history, success, userInfo])

    const deleteHandler = (id)=>{
        if(window.confirm("Are you sure?")){
            dispatch(deleteUser(id))
        }
    }

    return (
        <>
         <h1>Users</h1>
        {loading ? <Loader />: error ? <Message variant="danger">{error}</Message>: (
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user=>(
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user._id}</a></td>
                            <td>{user.isAdmin ? 
                            (<i className="fas fa-check" style={{color: 'green'}}></i>):
                            (<i className="fas fa-times" style={{color: 'red'}}></i>)}
                            </td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant="light" className="btn-sm">
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant="light" className="btn-sm" onClick={()=>deleteHandler(user._id)}>
                                        <i className="fas fa-trash"></i>
                                    </Button>                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
        </>
    )
}

export default UsersScreen
