// components/AuthButtons.jsx (Client)
"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const AuthButtons = ({ isAdminPage, user }) => {
  return (
    <>
      <SignedOut>
        {!isAdminPage && (
          <>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-[#0071E3] text-white px-4 py-2 rounded-lg hover:bg-[#005BB5]">
                Sign up
              </Button>
            </SignUpButton>
          </>
        )}
      </SignedOut>

      <SignedIn>
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
      </SignedIn>
    </>
  );
};

export default AuthButtons;
