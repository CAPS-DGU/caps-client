import React, { lazy, Suspense } from "react";
import CanonicalWikiRoute from "./components/WIKI/CanonicalWikiRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";

// Pages
import MainPage from "./pages/MainPage";
const WikiPage = lazy(() => import("./pages/WikiPage"));
const IntroPage = lazy(() => import("./pages/IntroPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ExecutivePage = lazy(() => import("./pages/ExecutivePage"));
const HomepagePage = lazy(() => import("./pages/HomepagePage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const KakaoLogin = lazy(() => import("./pages/KakaoLogin"));

// Components
import ScrollToTop from "./components/common/ScrollToTop.tsx";

// Wiki Components
const WikiContent = lazy(() =>
  import("./components/WIKI/WikiContent").then((module) => ({ default: module.WikiContent }))
);
const OnBoarding = lazy(() => import("./pages/OnBoarding.tsx"));
const WikiHistoryPage = lazy(() => import("./pages/WikiHistoryPage.tsx"));
import { UserProvider } from "./contexts/UserContext.tsx";
const MyPage = lazy(() => import("./pages/MyPage.tsx"));
const WikiEditPage = lazy(() => import("./pages/WikiEditPage.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUsPage.tsx"));
const CapsHistoryPage = lazy(() => import("./pages/CapsHistoryPage.tsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.tsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage.tsx"));
const BlogEditPage = lazy(() => import("./pages/BlogEditPage.tsx"));
const LedgerBoardPage = lazy(() => import("./pages/LedgerBoardPage.tsx"));
const LedgerDetailPage = lazy(() => import("./pages/LedgerDetailPage.tsx"));
const LedgerEditPage = lazy(() => import("./pages/LedgerEditPage.tsx"));
const RulePage = lazy(() => import("./pages/RulePage.tsx"));
const ReportPage = lazy(() => import("./pages/ReportPage.tsx"));
import ProtectedRoute from "./components/ProtectedRoute";

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
      path: "/blog",
      element: <BlogPage />,
    },
    {
      path: "/blog/edit",
      element: (
        <ProtectedRoute>
          <BlogEditPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/blog/:blogId",
      element: <BlogDetailPage />,
    },
    {
      path: "/blog/:blogId/edit",
      element: (
        <ProtectedRoute>
          <BlogEditPage />
        </ProtectedRoute>
      ),
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
      element: (
        <ProtectedRoute>
          <ReportPage />
        </ProtectedRoute>
      ),
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
      // 위키 열람(조회)은 비회원까지 공개. 편집/이력은 아래 라우트에서 계속 로그인 필요.
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
      element: (
        <ProtectedRoute>
          <WikiHistoryPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/wiki/edit/:wiki_title",
      element: (
        <ProtectedRoute>
          <WikiEditPage />
        </ProtectedRoute>
      ),
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
          <ScrollToTop />
          <UserProvider>
            <div className="min-h-screen bg-gray-50">
              {/* <NavBar /> */}
              <main className="">
                <Suspense fallback={<LoadingSpinner />}>
                  <CanonicalWikiRoute>
                    <Routes>{renderRoutes(routes)}</Routes>
                  </CanonicalWikiRoute>
                </Suspense>
              </main>
            </div>
          </UserProvider>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
