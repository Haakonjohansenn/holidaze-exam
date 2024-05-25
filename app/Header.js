"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import Modal from "./RegisterModal";
import LoginModal from "./LoginModal";
import CreateVenueModal from "./CreateVenueModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State for user's name

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const toggleVenueModal = () => {
    setIsVenueModalOpen(!isVenueModalOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
    setUserName(""); // Clear the username state
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const user = localStorage.getItem("name");
    if (user) {
      setUserName(user);
    }
  };

  useEffect(() => {
    // Fetch user's name from localStorage when component mounts
    const user = localStorage.getItem("name");
    if (user) {
      setUserName(user);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <header className="sticky top-0 p-6 bg-white border-b border-solid border-slate-300 shadow-md z-50 text-2xl sm:text-3xl md:text-4xl sm:p-8 flex items-center justify-between">
      <Link href="/home">
        <h1 className="uppercase cursor-pointer">Holidaze</h1>
      </Link>
      <div className="relative grid cursor-pointer group place-items-center flex items-center">
        <div className="flex items-center rounded-xl border-solid border border-black p-2">
          {userName && <div className="mr-4 text-sm">{userName}</div>}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <RxHamburgerMenu size={25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoggedIn && (
                <>
                  <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                  <Link href="/profile"><DropdownMenuItem>My venues</DropdownMenuItem></Link>
                  <DropdownMenuItem onClick={toggleVenueModal}>Create venue</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <DropdownMenuItem onClick={toggleModal}>Register</DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleLoginModal}>Login</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isModalOpen && <Modal onClose={toggleModal} />}
      {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} onLoginSuccess={handleLoginSuccess} />}
      {isVenueModalOpen && <CreateVenueModal onClose={toggleVenueModal} />}
    </header>
  );
}
