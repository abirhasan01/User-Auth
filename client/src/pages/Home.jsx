import Header from "../components/Header"
import Navbar from "../layout/Navbar"

const Home = () => {
  return (
    <div className="flex flexco items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
        <Navbar />
        <Header />
    </div>
  )
}

export default Home
