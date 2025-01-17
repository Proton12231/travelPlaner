import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AppRoutes } from "./routes";

// App 组件作为应用程序的根组件
function App() {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
