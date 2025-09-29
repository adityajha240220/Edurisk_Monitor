import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [activeSection, setActiveSection] = useState('analytics');
  const location = useLocation();
  const navigate = useNavigate();

  const navigationSections = [
    {
      id: 'analytics',
      title: 'Analytics',
      icon: 'BarChart3',
      items: [
        {
          name: 'Student Deep-Dive',
          path: '/student-analytics-deep-dive-dashboard',
          icon: 'Users',
          description: 'Individual student risk analysis and intervention tracking',
          notifications: 5
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: 'TrendingUp',
      items: [
        {
          name: 'Institutional Analytics',
          path: '/institutional-performance-analytics-dashboard',
          icon: 'Building2',
          description: 'Comparative institutional performance and strategic insights',
          notifications: 0
        }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: 'Activity',
      items: [
        {
          name: 'System Monitoring',
          path: '/operational-monitoring-dashboard',
          icon: 'Monitor',
          description: 'Platform health, data pipelines, and system performance',
          notifications: 2
        }
      ]
    }
  ];

  const userContext = {
    role: 'System Administrator',
    institution: 'Ministry of Education',
    permissions: ['analytics', 'performance', 'operations']
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSectionToggle = (sectionId) => {
    setActiveSection(activeSection === sectionId ? '' : sectionId);
  };

  const isItemActive = (path) => {
    return location?.pathname === path;
  };

  const getSectionNotificationCount = (section) => {
    return section?.items?.reduce((total, item) => total + (item?.notifications || 0), 0);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden lg:block`}>
        
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Navigation
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationSections?.map((section) => {
            const sectionNotifications = getSectionNotificationCount(section);
            const isExpanded = activeSection === section?.id;
            
            return (
              <div key={section?.id} className="space-y-1">
                {/* Section Header */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSectionToggle(section?.id)}
                  className={`w-full justify-between px-3 py-2 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={section?.icon} size={18} />
                    {!isCollapsed && (
                      <span className="font-medium">{section?.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {sectionNotifications > 0 && (
                        <span className="w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                          {sectionNotifications}
                        </span>
                      )}
                      <Icon 
                        name="ChevronDown" 
                        size={14} 
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  )}
                </Button>
                {/* Section Items */}
                {(isExpanded || isCollapsed) && (
                  <div className={`space-y-1 ${isCollapsed ? '' : 'ml-4'}`}>
                    {section?.items?.map((item) => (
                      <div key={item?.path} className="relative group">
                        <Button
                          variant={isItemActive(item?.path) ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleNavigation(item?.path)}
                          className={`w-full justify-start px-3 py-2 ${
                            isCollapsed ? 'justify-center' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon name={item?.icon} size={16} />
                            {!isCollapsed && (
                              <span className="text-sm">{item?.name}</span>
                            )}
                          </div>
                          {!isCollapsed && item?.notifications > 0 && (
                            <span className="ml-auto w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                              {item?.notifications}
                            </span>
                          )}
                        </Button>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-modal opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-max">
                            <p className="text-sm font-medium text-popover-foreground">{item?.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item?.description}</p>
                            {item?.notifications > 0 && (
                              <div className="flex items-center space-x-1 mt-2">
                                <Icon name="Bell" size={12} className="text-error" />
                                <span className="text-xs text-error">{item?.notifications} alerts</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Context Switcher */}
        <div className="border-t border-border p-4">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Current Context
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{userContext?.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Building" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{userContext?.institution}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" fullWidth iconName="RefreshCw" iconPosition="left">
                Switch Context
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="Shield" size={16} className="text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="RefreshCw" size={16} />
              </Button>
            </div>
          )}
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationSections?.map((section) => {
            const sectionNotifications = getSectionNotificationCount(section);
            const hasActiveItem = section?.items?.some(item => isItemActive(item?.path));
            
            return (
              <Button
                key={section?.id}
                variant={hasActiveItem ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  if (section?.items?.length === 1) {
                    handleNavigation(section?.items?.[0]?.path);
                  } else {
                    handleSectionToggle(section?.id);
                  }
                }}
                className="flex flex-col items-center space-y-1 px-3 py-2 relative"
              >
                <Icon name={section?.icon} size={20} />
                <span className="text-xs">{section?.title}</span>
                {sectionNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                    {sectionNotifications}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;