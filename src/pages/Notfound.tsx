// src/Pages/NotFound.tsx
import { Button } from "@/components/ui/button";
import { PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const NotFound = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full space-y-4 bg-gray-100",
        fullScreen ? "min-h-screen" : "min-h-[calc(100vh-70px)]"
      )}
    >
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Link to={PAGES.LOGIN_PAGE}>
        <Button asChild size="sm" className="px-10">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
