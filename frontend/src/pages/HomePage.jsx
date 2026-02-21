import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

import toast from "react-hot-toast";

function HomePage() {
  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => toast.success("Welcome to Talent Bridge")}
      >
        Show Toast
      </button>
      <SignedOut>
        <SignInButton>
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </SignedIn>

      <UserButton />
    </div>
  );
}

export default HomePage;
