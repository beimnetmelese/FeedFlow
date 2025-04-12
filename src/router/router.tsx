import { createBrowserRouter } from "react-router-dom";
import LayOut from "../component/layout";
import AdminLogin from "../component/login";
import Dashboard from "../component/dashboard";
import FeedbackList from "../component/feedback";
import AnalyticsDashboard from "../component/analytic";
import FAQTrainer from "../component/faq";

const route = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      { path: "", element: <AdminLogin /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "feedback", element: <FeedbackList /> },
      { path: "analytic", element: <AnalyticsDashboard /> },
      { path: "faq", element: <FAQTrainer /> },
    ],
  },
]);

export default route;
