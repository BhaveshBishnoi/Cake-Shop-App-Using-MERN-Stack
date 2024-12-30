import HeroSection from "../components/Home/HeroSection"
import RecentlyAdded from "../components/Home/RecentlyAdded"

const Home = () => {
  return (
    <>
    <div className="w-full bg-zinc-900 text-white px-10 py-8">
    <HeroSection />
    </div>
    <div className="w-full bg-zinc-900 text-white px-10 py-8">
    <RecentlyAdded />
    </div>
    
    
    </>
  )
}

export default Home