/* eslint-disable react/prop-types */
import { useContext,createContext, useState } from "react"

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user,setUser] = useState();
  return (
    <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
  )
}

export const UserState = () =>{
    return useContext(UserContext)
}

export default UserProvider;