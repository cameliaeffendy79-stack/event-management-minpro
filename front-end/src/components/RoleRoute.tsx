import { Navigate } from "react-router-dom"

type Props = {
  children: React.ReactNode
}

export default function RoleRoute({
  children
}: Props){

  const role =
    localStorage.getItem("role")

  if(role !== "organizer"){
    return <Navigate to="/" />
  }

  return <>{children}</>

}