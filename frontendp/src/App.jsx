import { Routes,Route } from "react-router"
import HomePage from "./pages/HomePage"
import FormPrompt from "./pages/FormPrompt"
import UserPortfolio from "./pages/UserPortfolio"
import WebsiteGenerator from "./pages/WebsiteGenerator"

function App() {
  
  return (
    <>
     
     <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/form" element={<FormPrompt />}></Route>
      <Route path="/user/portfolio" element={<UserPortfolio />}></Route>
      <Route path="/user/website" element={<WebsiteGenerator />}></Route>
     </Routes>

    </>
  )
}

export default App
