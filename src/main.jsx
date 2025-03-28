import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; // Correct imports
import './index.css';
import App from './App.jsx';
import store from './store/store.jsx';
import Renderinglist from './components/Renderer/renderinglist.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/renderer/:id",
    element: <Renderinglist />,
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} /> {/* Use RouterProvider */}
  </Provider>
);
