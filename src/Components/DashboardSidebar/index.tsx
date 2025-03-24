import SidebarLayout from './SidebarLayout';
import { useNavigate } from 'react-router-dom';
import useCurrentPath from '../../Hooks/useCurrentPath';
import { DashboardBottomLinks, DashboardSidebarLinks } from './data';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { Logo } from '../../assets';


interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const activeLink = useCurrentPath();

  const handleLinkClick = (url: string) => {
    if (url === 'logout') {
      localStorage.clear();
      navigate('/auth/login');
    } else if (url === 'toggle') {
      toggleSidebar();
    } else {
      navigate(url);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
        <div className='my-3 flex justify-center'>
            <img src={Logo} alt="" className='w-9 h-7' />
        </div>
      <div>
        {DashboardSidebarLinks.map(({ id, title, image, url }) => (
          <div
            onClick={() => handleLinkClick(url)}
            role="button"
            tabIndex={0}
            onKeyDown={() => handleLinkClick(url)}
            key={id}
            className="py-[1px] cursor-pointer hover:bg-white/10 transition-all"
            style={{
              background: url === activeLink[1]
                ? 'linear-gradient(180deg, #092228 0%, #1A4A52 100%);'
                
                : '',
            }}
          >
            <SidebarLayout title={title} image={image} isCollapsed={isCollapsed} />
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {DashboardBottomLinks.map(({ id, title, image, url }) => (
          <div
            onClick={() => handleLinkClick(url)}
            role="button"
            tabIndex={0}
            onKeyDown={() => handleLinkClick(url)}
            key={id}
            className="py-[1px] cursor-pointer hover:bg-white/10 transition-all"
            style={{
              background: url === activeLink[2]
                ? 'linear-gradient(180deg, #092228 0%, #1A4A52 100%);'
                : '',
            }}
          >
            <SidebarLayout title={title} image={image} isCollapsed={isCollapsed} />
          </div>
        ))}

        <div
          onClick={() => handleLinkClick('toggle')}
          role="button"
          tabIndex={0}
          onKeyDown={() => handleLinkClick('toggle')}
          className="py-[1px] cursor-pointer hover:bg-white/10 transition-all"
        >
          <SidebarLayout
            title={isCollapsed ? 'Expand' : 'Collapse'}
            image={isCollapsed ? <FaArrowRightLong /> : <FaArrowLeftLong />}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;