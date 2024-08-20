import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchAppBar from "./searchBar.jsx";
import EventList from "./EventList";
import EventDetail from "./CardDetail";
import SignUp from "./SignUp.jsx";
import SignIn from "./SignIn.jsx";
import AccountInfo from "./AccountInfo.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/stadium/:slug" element={<EventDetail />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/account" element={<AccountInfo />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
