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
import ExecutivePage from "./pages/ExecutivePage";
import HomepagePage from "./pages/HomepagePage";
import BoardPage from "./pages/BoardPage";
import KakaoLogin from "./pages/KakaoLogin";

// Components
import NavBar from "./components/NavBar.tsx";

// Wiki Components
import { WikiContent } from "./components/WIKI/WikiContent";
import { WikiHistory } from "./components/WIKI/WikiHistory";
import { WikiCompare } from "./components/WIKI/WikiCompare";
import OnBoarding from "./pages/OnBoarding.tsx";
import WikiHistoryPage from "./pages/WikiHistoryPage.jsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import MyPage from "./pages/MyPage.tsx";
import WikiEditPage from "./pages/WikiEditPage.jsx";
import AboutUs from "./pages/AboutUsPage.tsx";
import CapsHistoryPage from "./pages/CapsHistoryPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import LedgerBoardPage from "./pages/LedgerBoardPage.tsx";
import LedgerDetailPage from "./pages/LedgerDetailPage.tsx";
import LedgerEditPage from "./pages/LedgerEditPage.tsx";
import RulePage from "./pages/RulePage.tsx";
import ReportPage from "./pages/ReportPage.tsx";

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
      path: "/faq",
      element: <FAQPage />,
    },
    {
      path: "/intro",
      element: <IntroPage />,
    },
    {
      path: "/aboutus",
      element: <AboutUs />,
    },
    {
      path: "/history",
      element: <HistoryPage />,
    },
    {
      path: "/caps-history",
      element: <CapsHistoryPage />,
    },
    {
      path: "/rule",
      element: <RulePage />,
    },
    {
      path: "/report",
      element: <ReportPage />,
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
    {
      path: "/ledger",
      element: <LedgerBoardPage />,
    },
    {
      path: "/ledger/edit",
      element: <LedgerEditPage />,
    },
    {
      path: "/ledger/:ledgerId",
      element: <LedgerDetailPage />,
    },
    {
      path: "/ledger/:ledgerId/edit",
      element: <LedgerEditPage />,
    },
    {
      path: "/ledger/:ledgerId",
      element: <LedgerDetailPage />,
    },
    {
      path: "/login",
      element: <KakaoLogin />,
    },
    {
      path: "/onboarding",
      element: <OnBoarding />,
    },
    {
      path: "/mypage",
      element: <MyPage />,
    },
    {
      path: "/wiki",
      element: <WikiPage />,
      children: [
        {
          path: ":wiki_title",
          element: <WikiContent />,
        },
      ],
    },
    {
      path: "/wiki/history/:wiki_title",
      element: <WikiHistoryPage />,
    },
    {
      path: "/wiki/edit/:wiki_title",
      element: <WikiEditPage />,
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
          <UserProvider>
            <div className="min-h-screen bg-gray-50">
              {/* <NavBar /> */}
              <main className="">
                <Routes>{renderRoutes(routes)}</Routes>
              </main>
            </div>
          </UserProvider>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
