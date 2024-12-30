import  { useState, useEffect } from "react"
import axios from "axios"
import CakeCard from "../components/Cards/CakeCard"

const AllCakes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get-all-cakes"
        );
        setData(response.data.Data);
      } catch (err) {
        setError("Failed to fetch cakes. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  if (loading) return <p>Loading cakes...</p>;
  if (error) return <p>{error}</p>;


  return (
    <>
    <div className="w-full bg-zinc-900 text-white px-10 py-8">
    <h1 className="text-2xl text-yellow-100 font-semibold">
        All Cakes 🎂
      </h1>

      <div className="px-0 md:px-10 py-8 grid md:grid-cols-4 items-center gap-4 sm:grid-cols-3 grid-cols-1">
        {data.length > 0 ? (
          data.map((item, i) => (
            <div key={i}>
              <CakeCard data={item} />
            </div>
          ))
        ) : (
          <p>No cakes available at the moment.</p>
        )}
      </div>
    </div>
    
    </>
  )
}

export default AllCakes