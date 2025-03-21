import React from 'react';
import { SidebarLayoutProps } from '../../types';


const SidebarLayout: React.FC<SidebarLayoutProps> = ({ 
  image, 
  title, 
  isCollapsed 
}) => (
  <div className={`flex ${isCollapsed ? 'pl-3 justify-center' : 'pl-6'} my-4 items-center`}>
    {image && (
      typeof image === "string" ? (
        <img 
          src={image} 
          alt={title} 
          className={isCollapsed ? 'w-6 h-6' : ''}
        />
      ) : (
        <span className="text-dark">{image}</span>
      )
    )}

    {!isCollapsed && title && (
      <h1 className="pl-4 text-base text-dark">
        {title}
      </h1>
    )}
  </div>
);

export default SidebarLayout;