import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setError(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (Object.values(values).some((field) => field === "")) {
        setError("All fields are required!");
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/v1/sign-up",
          values
        );
        console.log(response.data);
        alert("Signup successful");
        navigate("/log-in");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full justify-center py-10 items-center w-full bg-zinc-900 text-white">
      <div className="flex flex-col justify-center my-5 md:my-10 items-center bg-zinc-800 sm:w-full md:w-1/4 rounded p-5 m-2">
        <h1 className="text-2xl mb-4">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="my-2 flex flex-col items-center w-[90%]"
        >
          <label htmlFor="username" className="self-start mb-1">
            Username:
          </label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="bg-zinc-900 outline-none border-none rounded w-full p-2 mb-3"
            value={values.username}
            onChange={handleChange}
          />
          <label htmlFor="email" className="self-start mb-1">
            Email:
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="bg-zinc-900 outline-none border-none rounded w-full p-2 mb-3"
            value={values.email}
            onChange={handleChange}
          />
          <label htmlFor="password" className="self-start mb-1">
            Password:
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="bg-zinc-900 outline-none border-none rounded w-full p-2 mb-3"
            value={values.password}
            onChange={handleChange}
          />
          <label htmlFor="address" className="self-start mb-1">
            Address:
          </label>
          <textarea
            rows="3"
            placeholder="Address"
            name="address"
            className="bg-zinc-900 outline-none border-none rounded w-full p-2 mb-3"
            value={values.address}
            onChange={handleChange}
          />
          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`px-2 w-full py-1 rounded-md bg-blue-600 transition-colors ${
              loading ? "bg-blue-400 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="my-3">Or</p>
        <p>
          Have an account?{" "}
          <Link to="/log-in" className="text-blue-600">
            LogIn
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
