import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Agenda from "@/pages/Agenda";
import Group from "@/pages/Group";
import Sessions from "@/pages/Sessions";
import Locations from "@/pages/Locations";
import Resources from "@/pages/Resources";
import Links from "@/pages/Links";
import Feedback from "@/pages/Feedback";
import More from "@/pages/More";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/group" element={<Group />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/links" element={<Links />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/more" element={<More />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
