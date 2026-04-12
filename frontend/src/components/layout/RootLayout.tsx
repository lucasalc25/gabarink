import { Outlet } from 'react-router-dom';
import Header from './Header';
import InkStains from '../ui/InkStains';

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1 bg-gradient-surface w-full relative overflow-hidden">
        <InkStains />
        <div className="relative z-10 w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
