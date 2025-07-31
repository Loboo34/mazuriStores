import React from 'react';
import { NavLink } from 'react-router-dom';
import { Asterisk as CashRegister, Package, Settings, BarChart3, ArrowRightLeft } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../utils/cn';

export const Navigation: React.FC = () => {
  const { user } = useUserStore();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      to: '/sales',
      icon: CashRegister,
      label: 'Sales Terminal',
      roles: ['admin', 'cashier']
    },
    {
      to: '/transfers',
      icon: ArrowRightLeft,
      label: 'Transfers',
      roles: ['admin', 'cashier']
    },
    {
      to: '/admin',
      icon: Settings,
      label: 'Admin',
      roles: ['admin']
    },
    {
      to: '/reports',
      icon: BarChart3,
      label: 'Reports',
      roles: ['admin', 'cashier']
    }
  ];

  const filteredItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <nav className="bg-amber-50 border-r border-amber-200 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-amber-200 text-amber-800 font-medium'
                      : 'text-amber-700 hover:bg-amber-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};