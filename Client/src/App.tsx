import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SingleProductPage from "./pages/SingleProductPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import { Toaster } from "react-hot-toast";
import MyAccount from "./pages/MyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountSettings from "./pages/AccountSettings";
import MyOrders from "./pages/MyOrders";
import MyAccountLayout from "./components/MyAccountLayout";
import AdminLayout from "./components/AdminLayout";
import AdminCategories from "./pages/AdminCategories";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminProducts from "./pages/AdminProducts";
import NotFoundPage from "./pages/NotFoundPage";
import AdminAllOrders from "./pages/AdminAllOrders";
import AdminUsers from "./pages/AdminUsers";
import CompleteOrder from "./pages/CompleteOrder";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import SellerProfilePage from "./pages/SellerProfilePage";
import AllProductsPage from "./pages/AllProductsPage";
import LayoutWrapper from "./lib/Layout";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/about" element={<About />} />
            <Route path="/completeorder" element={<CompleteOrder />} />
            <Route path="/seller" element={<SellerProfilePage />} />

            {/* Product Routes */}
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Category Routes */}
            <Route path="/category/:categoryName" element={<CategoryPage />} />

            <Route
              path="/my-account"
              element={
                <ProtectedRoute>
                  <MyAccountLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
            {/* <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          /> */}

            <Route
              path="/admin-seller"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin-seller/categories"
              element={
                <ProtectedAdminRoute>
                  <AdminCategories />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-seller/products"
              element={
                <ProtectedAdminRoute>
                  <AdminProducts />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-seller/orders"
              element={
                <ProtectedAdminRoute>
                  <AdminAllOrders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-seller/users"
              element={
                <ProtectedAdminRoute>
                  <AdminUsers />
                </ProtectedAdminRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
