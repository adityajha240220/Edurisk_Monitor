import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'mentor', userName = 'User', isAuthenticated = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Student risk level elevated', time: '5 min ago' },
    { id: 2, type: 'success', message: 'Data upload completed', time: '1 hour ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        path: `/${userRole}-dashboard`,
        icon: 'LayoutDashboard',
        roles: ['mentor', 'admin', 'ministry']
      }
    ];

    if (userRole === 'admin') {
      baseItems?.push({
        label: 'Data Management',
        path: '/data-upload-management',
        icon: 'Upload',
        roles: ['admin']
      });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/authentication-portal');
    setIsMobileMenuOpen(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event?.target?.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Shield" size={24} color="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-foreground">EduRisk Monitor</h1>
            <p className="text-xs text-muted-foreground">Educational Risk Management</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="nav-transition"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative notification-dropdown">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {notifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center pulse-alert">
                  {notifications?.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-modal z-1010">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications?.map((notification) => (
                      <div key={notification?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification?.type === 'warning' ? 'bg-warning' : 
                            notification?.type === 'success' ? 'bg-success' : 'bg-accent'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-popover-foreground">{notification?.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              iconName="LogOut"
              className="text-muted-foreground hover:text-foreground"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border z-1020">
          <div className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={18}
                fullWidth
                className="justify-start"
              >
                {item?.label}
              </Button>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                iconName="LogOut"
                iconPosition="left"
                iconSize={18}
                fullWidth
                className="justify-start text-muted-foreground"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;