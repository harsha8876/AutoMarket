
import Link from "next/link";
import Image from "next/image";
import { Heart, CarFront, Layout, ArrowLeft } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import AuthButtons from "./AuthButtons"; // client-only

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser(); // ✅ runs on server
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="DriveIQ logo"
            width={250}
            height={100}
            priority
            className="h-[65px] w-[120px] object-contain"
          />
        </Link>

        {/* Server-side links */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <button className="flex items-center gap-2 border px-3 py-1 rounded-md cursor-pointer 
                                hover:bg-gray-100 hover:border-gray-400 transition-colors">
                <ArrowLeft size={18} />
                <span>Back to App</span>
              </button>
            </Link>
          ) : (
            <>
              {!isAdmin && user && (
                <Link href="/reservations">
                  <button className="flex items-center gap-2 border px-3 py-1 rounded-md">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </button>
                </Link>
              )}
              {user && (
                <a href="/saved-cars">
                  <button className="flex items-center gap-2 bg-[#0071E3] text-white px-3 py-1 rounded-md hover:bg-[#005BB5] cursor-pointer">
                    <Heart size={18} />
                    <span className="hidden md:inline">Saved Cars</span>
                  </button>
                </a>
              )}
              {isAdmin && (
                <Link href="/admin">
                  <button className="flex items-center gap-2 border px-3 py-1 rounded-md cursor-pointer 
                                hover:bg-gray-100 hover:border-gray-400 transition-colors">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </button>
                </Link>
              )}
            </>
          )}

          {/* Client-only Clerk UI */}
          <AuthButtons isAdminPage={isAdminPage} user={user} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
