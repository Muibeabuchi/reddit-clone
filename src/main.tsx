import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./tasks.tsx";
import "./index.css";

import { ConvexReactClient } from "convex/react";
import Providers from "./Providers.tsx";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Providers />
        {/* <p>hello</p> */}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
