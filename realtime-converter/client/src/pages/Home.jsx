import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/converter/upload",
        formData
      );

      console.log(response.data);

      alert("Upload Success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">
        <h1 className="text-3xl font-bold mb-5 text-center">
          Real-Time Converter
        </h1>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-5"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Upload
        </button>
      </div>
    </div>
  );
}