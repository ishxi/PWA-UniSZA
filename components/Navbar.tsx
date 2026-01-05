import React from 'react';
import { APP_LOGO } from '../src/constants/constants.base';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface NavbarProps {
  role?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  appLogo?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  role, 
  activeTab, 
  onTabChange, 
  onLogout,
  appLogo = APP_LOGO
}) => {
  return (
    <nav className="bg-white/90 shadow-sm border-b border-gray-200 fixed w-full top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={appLogo} alt="logo" className="h-8 w-8" />
          <span className="font-semibold text-lg">Cafe's Little Helper</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={getUIAvatar('User')} alt="user" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
