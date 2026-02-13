import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Item = ({
  icon,
  title,
  link,
  subItems,
  index,
  onClick,
  level = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (subItems && subItems.length > 0) {
    return (
      <div key={index} className="sidebar-item">
        <button
          className={`dropdown-btn ${isOpen ? "isOpen active" : ""}`}
          menu-level={level}
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon}
          <span className="link-name">{title}</span>
          <ChevronDown size={16} />
        </button>

        <div
          className={`sub-menu ${isOpen ? "show" : ""}`}
          menu-level={level + 1}
        >
          <div className="sub-menu-content">
            {subItems.map((subItem, i) => (
              <Item
                key={subItem.key || i}
                {...subItem}
                index={i}
                level={level + 1}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={index} className="sidebar-item">
      <NavLink
        to={link}
        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        menu-level={level}
        onClick={onClick}
      >
        {icon}
        <span className="link-name">{title}</span>
      </NavLink>
    </div>
  );
};

export default Item;