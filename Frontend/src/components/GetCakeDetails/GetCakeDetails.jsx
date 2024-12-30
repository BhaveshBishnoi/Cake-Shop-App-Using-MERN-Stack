import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MutatingDots } from "react-loader-spinner";

const GetCakeDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1//get-cake-by-id/${id}`
        );
        setData(response.data.Data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCakes();
  }, []);

  return (
    <>
      {data ? (
        <>
          <div className="w-full flex md:flex-row flex-col justify-center bg-zinc-900 text-white px-3 lg:px-10 py-8">
            <div className="bg-zinc-800 p-10 rounded w-full lg:w-1/3">
              <img
                className="h-auto max-w-full rounded-lg "
                src={data.url}
                alt="cake"
              />
            </div>
            <div className="lg:w-[50%] lg:ml-8 w-full lg:px-0 px-3">
              <h1 className="text-3xl lg:pt-0 pt-4">{data.title}</h1>
              <h2 className="text-xl text-gray-400 py-4">{data.description}</h2>
              <h2 className="text-2xl">Price : ₹ {data.price}</h2>
            </div>
          </div>
        </>
      ) : (
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
      )}
    </>
  );
};

export default GetCakeDetails;
