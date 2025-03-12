import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../../Components/Sidebar"
import { OnboardingProvider } from "../../Pages/Onboarding/context/OnboardingContext"

const OnboardingLayout = () => {
  // const initialState = {
  //   openMobileSideBar: false,
  // }
  // const [
  //   _,
  //   // setState
  // ] = useReducer(
  //   (state: any, newState: any) => ({ ...state, ...newState }),
  //   initialState,
  // )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
    <OnboardingProvider>
      <div className="bg-white overflow-x-hidden w-screen h-screen relative">
        <div className="flex p-2 ">
          <nav className=" py-2 z-20 md:flex-[.2] lg:flex-[.15] h-[89vh] mt-14 rounded-lg fixed top-0 w-[19%] hidden md:block">
            <div
              className="flex flex-col rounded-lg h-full items-center w-full "
              style={{
                background: "#E0EFDE",
              }}
            >
              <div className="w-full mt-12 h-full">
                <Sidebar />
              </div>
            </div>
          </nav>
          {/* <div className="w-[98vw] md:my-[70px] md:pl-48 lg:pl-[21vw] mb-[70px]"> */}
          <div className="w-[98vw] sm:w-[97vw] lg:w-[98vw] md:my-[70px] md:pl-48 md:w-[96vw] lg:pl-[21vw] mb-[70px]">
            <Outlet />
          </div>
        </div>
      </div>
      </OnboardingProvider>
    </>
  )
}

export default OnboardingLayout
