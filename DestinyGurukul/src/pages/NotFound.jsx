import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-card shadow-xl rounded-3xl p-10 max-w-lg w-full text-center">

        <AlertTriangle
          size={70}
          className="mx-auto text-red-500 mb-5"
        />

        <h1 className="text-7xl font-extrabold text-foreground">
          404
        </h1>

        <h2 className="text-3xl font-bold mt-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mt-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <Home size={20} />
            Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

        </div>

      </div>
    </div>
  );
}
