import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// IMPORT COMPONENTS
import NavbarComponent from './components/NavbarComponent';
import GetAllComponent from './components/GetAllComponent';
import ViewInventory from './components/ViewInventory';
import CreateInventory from './components/CreateInventory';
import FooterComponent from './components/FooterComponent';
import UpdateItem from './components/UpdateItem';

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <div>
        <Routes>
          <Route path="/" element={<GetAllComponent />} />
          <Route path="/view-inventory/:id" element={<ViewInventory />} />
          <Route path="/update-item/:id" element={<UpdateItem />} />
          <Route path="/create-inventory" element={<CreateInventory />} />
        </Routes>
      </div>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
