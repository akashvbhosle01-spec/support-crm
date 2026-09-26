import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function Create() {
  return <div className="p-8">Create ticket — coming in Step 8</div>;
}

function Detail() {
  return <div className="p-8">Ticket detail — coming in Step 9</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/tickets/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;