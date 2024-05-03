"use client"
import { useState } from "react";
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

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className="sticky top-0 p-6 bg-white border-b border-solid border-slate-300 shadow-md z-50 text-2xl sm:text-3xl md:text-4xl sm:p-8 flex items-center justify-between">
      <Link href="/home">
        <h1 className="uppercase cursor-pointer">Holidaze</h1>
      </Link>
      <div className="relative grid cursor-pointer group place-items-center">
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
                <DropdownMenuItem>My venues</DropdownMenuItem>
                <DropdownMenuItem>Create venue</DropdownMenuItem>
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
      {isModalOpen && <Modal onClose={toggleModal} />}
      {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} onLoginSuccess={handleLoginSuccess} />}
    </header>
  );
}
