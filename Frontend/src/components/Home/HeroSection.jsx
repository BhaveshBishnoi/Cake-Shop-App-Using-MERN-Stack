import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <>
      <div className="md:h-[78vh] flex flex-col-reverse md:flex-row items-center justify-center">
        <div className="lg:w-3/6 w-full">
          <h1 className="text-3xl md:text-left text-center md:text-4xl lg:text-5xl font-semibold text-yellow-100 py-5">
            Sweeten Every Moment with Our Irresistible Cakes!
          </h1>
          <p className="mb-8 md:text-left text-center">
            At CakeKitchen, we believe that every celebration deserves the
            perfect cake. From birthdays to weddings, or even just a simple
            treat for yourself.
          </p>
          <div className="flex md:justify-start justify-center items-center"><Link to={"/all-cakes"} className="rounded-full border border-yellow-100 px-6 py-2 text-white font-semibold transition-all duration-300 hover:bg-yellow-50 hover:text-zinc-800">Explore Cakes</Link></div>

        </div>
        <div className="flex justify-center lg:w-3/6 w-full">
        <img src="public/cake.png" alt="cake-image" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
