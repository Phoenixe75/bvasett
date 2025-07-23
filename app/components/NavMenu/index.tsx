import React, { useState } from 'react';
import styles from './NavMenu.module.scss';

interface NavItemProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}


const NavItem: React.FC<NavItemProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
        >
            {label}
        </button>
    );
};

interface NavMenuProps<T = string> {
    menuItems?: {
        label: string;
        key: T;
    }[];
    onClick?: (activeValue: T) => void;
    defaultActive?: T;
}


const NavMenu = <T extends React.Key = string>({ menuItems, onClick, defaultActive }: NavMenuProps<T>)=> {
    const [activeItem, setActiveItem] = useState<T | undefined>(defaultActive);
    const onItemClick = (key:T) => {
        setActiveItem(key);
        onClick?.(key);
    }
    return (
        <div className={styles.navMenu}>
            <div className={styles.menuContainer}>
                {menuItems?.map((item) => (
                    <NavItem
                        key={item.key}
                        label={item.label}
                        isActive={activeItem === item.key}
                        onClick={() => onItemClick(item.key)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NavMenu;
