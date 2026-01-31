import { useLocation } from 'react-router-dom';
import Navbarr from '../components/Navbar';
import FooterUi from '../components/FooterUi';
import TopBar from '@/components/TopBar';


export default function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbarr />}
      {children}
      {!isAdmin && <FooterUi />}
    </>
  );
}
