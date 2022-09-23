import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "@/pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
      path="*"
      element={
      <main className="p-4">
        <p>
         There's nothing here!
         </p>
        <a className="text-blue-500" href=".">
          {"<"} Back to home</a>
      </main>
      }
      />
      </Routes>
    </Router>
  );
}

export default App;