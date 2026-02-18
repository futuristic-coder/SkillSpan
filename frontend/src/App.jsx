import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import "./App.css";

function App() {
  return (
    <>
      <h1>Welcome to Talent Bridge</h1>
      <SignedOut>
        <SignInButton mode="modal" >
          <button>
            Sign Up
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  );
}

export default App;
