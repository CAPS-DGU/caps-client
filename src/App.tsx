import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";

// Pages
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import WikiPage from "./pages/WikiPage";
import IntroPage from "./pages/IntroPage";
import HistoryPage from "./pages/HistoryPage";
import RulePage from "./pages/RulePage";
import ExecutivePage from "./pages/ExecutivePage";
import HomepagePage from "./pages/HomepagePage";
import BoardPage from "./pages/BoardPage";
import VotePage from "./pages/VotePage";

// Components
import NavBar from "./components/NavBar.tsx";

// Wiki Components
import { WikiContent } from "./components/WIKI/WikiContent";
import { WikiEditor } from "./components/WIKI/WikiEditor.tsx";
import WikiSearch from "./components/WIKI/WikiSearch";
import { WikiHistory } from "./components/WIKI/WikiHistory";
import { WikiCompare } from "./components/WIKI/WikiCompare";

// Types
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App: React.FC = () => {
  const routes: RouteConfig[] = [
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/intro",
      element: <IntroPage />,
    },
    {
      path: "/history",
      element: <HistoryPage />,
    },
    {
      path: "/rule",
      element: <RulePage />,
    },
    {
      path: "/executive",
      element: <ExecutivePage />,
    },
    {
      path: "/homepage",
      element: <HomepagePage />,
    },
    {
      path: "/board",
      element: <BoardPage />,
    },
    // {
    //   path: "/vote",
    //   element: <VotePage />,
    // },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/wiki",
      element: <WikiPage />,
      children: [
        {
          path: "",
          element: <WikiSearch />,
        },
        {
          path: ":wiki_title",
          element: <WikiContent />,
        },
        {
          path: "edit/:wiki_title",
          element: <WikiEditor />,
        },
        {
          path: "history/:wiki_title",
          element: <WikiHistory />,
        },
        {
          path: "compare/:wiki_title/:version",
          element: <WikiCompare />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  const renderRoutes = (routes: RouteConfig[]): React.ReactNode => {
    return routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-16">
              <Routes>{renderRoutes(routes)}</Routes>
            </main>
          </div>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
