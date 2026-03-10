import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 ">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
