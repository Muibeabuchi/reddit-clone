import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./chakra/themes";
import { RecoilRoot } from "recoil";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/appLayout";
import Homepage from "./pages/homepage";
import CommunityPage from "./pages/communityPage";
import CommunitySubmit from "./pages/communitySubmit";
import CommunityErrorPage from "./pages/CommunityErrorPage";
import PostPage from "./pages/postPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "r/:communityName",
        element: <CommunityPage />,
        errorElement: <CommunityErrorPage />,
      },
      {
        path: "r/:communityName/submit",
        element: <CommunitySubmit />,
      },
      {
        path: "r/:communityName/comments/:postId",
        element: <PostPage />,
      },
    ],
  },
]);

export default function Providers() {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </RecoilRoot>
  );
}
