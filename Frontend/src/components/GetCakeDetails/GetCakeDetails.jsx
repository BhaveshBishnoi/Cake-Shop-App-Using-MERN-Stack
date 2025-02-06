import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart";
import { MutatingDots } from "react-loader-spinner";

const GetCakeDetails = () => {
  const { id } = useParams();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    fetchCakes();
  }, [id]);

  const fetchCakes = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/get-cake-by-id/${id}`);
      setCake(response.data.Data);
      setLoading(false);
    } catch  {
      setError("Failed to fetch cake details");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/log-in", { state: { from: `/get-cake-details/${id}` } });
      return;
    }

    dispatch(
      cartActions.addToCart({
        id: cake._id,
        name: cake.title,
        price: cake.price,
        imageUrl: cake.url,
      })
    );

    // Show success message
    alert("Added to cart successfully!");
  };

  if (loading) return (
    <div className="bg-zinc-800 flex justify-center items-center h-[80vh] text-2xl">
      <MutatingDots
        visible={true}
        height="120"
        width="120"
        color="#9f9f9f"
        secondaryColor="#e1e1e1"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!cake) return <div className="text-center py-10">Cake not found</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={cake.url}
              alt={cake.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{cake.title}</h1>
            <p className="text-gray-300">{cake.description}</p>
            <div className="text-2xl font-bold text-pink-500">₹{cake.price}</div>
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/all-cakes")}
                className="w-full bg-zinc-800 text-white py-3 px-6 rounded-lg hover:bg-zinc-700 transition duration-300"
              >
                Back to All Cakes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetCakeDetails;
