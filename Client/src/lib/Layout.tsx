import { useLocation } from 'react-router-dom';
import Navbarr from '../components/Navbar';
import FooterUi from '../components/FooterUi';
import TopBar from '@/components/TopBar';


export default function LayoutWrapper({ children }: { children: React.ReactNode  }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isMyAccount = location.pathname.startsWith('/my-account');

  return (
    <>
      {!isAdmin && !isMyAccount && <TopBar />}
      {!isAdmin && !isMyAccount && <Navbarr />}
      {children}
      {!isAdmin && !isMyAccount && <FooterUi />}
    </>
  );
}
