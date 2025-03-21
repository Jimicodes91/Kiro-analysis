import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { CircleLoader } from "react-spinners"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import store from "store"

interface AuthHocProps {
  component: React.ComponentType<any>
}

const AuthHoc = ({ component: Component, ...rest }: AuthHocProps) => {
  const authData = useSelector((state: any) => state.auth)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()

  useEffect(() => {
    if (!authData.isAuthenticated) {
      const fetchUserData = async () => {
        try {
          await dispatch({ type: "GET_USER_DATA" })
          setIsLoading(false)
        } catch (err: any) {
          navigate("/login")
        }
      }

      const isLoggedIn = store.get("isLoggedIn") === true
      if (!isLoggedIn) {
        navigate("/auth/login")
      } else {
        fetchUserData()
      }
    } else {
      setIsLoading(false)
    }
  }, [navigate, dispatch])

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center ">
        <CircleLoader color="#0078FF" />
      </div>
    )
  }

  const isLoggedIn = store.get("isLoggedIn") === true
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />
  }

  return <Component {...rest} />
}

export default AuthHoc
