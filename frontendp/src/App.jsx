import { Routes,Route } from "react-router"
import HomePage from "./pages/HomePage"
import FormPrompt from "./pages/FormPrompt"
import UserPortfolio from "./pages/UserPortfolio"

function App() {
  
  return (
    <>
     
     <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/form" element={<FormPrompt />}></Route>
      <Route path="/user/portfolio" element={<UserPortfolio />}></Route>
     </Routes>

    </>
  )
}

export default App
