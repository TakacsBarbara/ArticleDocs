import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ArticleDocs from './Components/ArticleDocs';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<ArticleDocs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
