import React, { ReactElement, Dispatch, SetStateAction, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { NextPage } from 'next';
import { Demo } from './demo';
import { Toast } from 'primereact/toast';

/* Breadcrumb Types */
export interface AppBreadcrumbProps {
    className?: string;
}

export interface Breadcrumb {
    labels?: string[];
    to?: string;
}

export interface BreadcrumbItem {
    label: string;
    to?: string;
    items?: BreadcrumbItem[];
}

/* Context Types */
export type LayoutState = {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
};

export type LayoutConfig = {
    ripple: boolean;
    inputStyle: string;
    menuMode: string;
    colorScheme: string;
    theme: string;
    scale: number;
};

export interface LayoutContextProps {
    layoutConfig: LayoutConfig;
    setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
    layoutState: LayoutState;
    setLayoutState: Dispatch<SetStateAction<LayoutState>>;
    onMenuToggle: () => void;
    showProfileSidebar: () => void;
}

export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: Dispatch<SetStateAction<string>>;
}

/* AppConfig Types */
export interface AppConfigProps {
    simple?: boolean;
}

/* AppTopbar Types */
export type NodeRef = MutableRefObject<ReactNode>;
export interface AppTopbarRef {
    menubutton?: HTMLButtonElement | null;
    topbarmenu?: HTMLDivElement | null;
    topbarmenubutton?: HTMLButtonElement | null;
}

/* AppMenu Types */
type CommandProps = {
    originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    item: MenuModelItem;
};

export interface MenuProps {
    model: MenuModel[];
}

export interface MenuModel {
    label: string;
    icon?: string | React.ReactNode;
    items?: MenuModel[];
    to?: string;
    url?: string;
    target?: HTMLAttributeAnchorTarget;
    seperator?: boolean;
}

export interface AppMenuItem extends MenuModel {
    items?: AppMenuItem[];
    badge?: 'UPDATED' | 'NEW';
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
    item?: AppMenuItem;
    parentKey?: string;
    index?: number;
    root?: boolean;
    className?: string;
}

export interface IUserProps {
    first_name: string | null;
    fullname: string | null;
    has_password: boolean | null;
    id: number | null;
    last_name: string | null;
    mobile: string | null;
    is_admin: boolean | null;
    is_staff: boolean | null;
    national_id?: string | null;
    orders: number;
}

export interface UserContextProps {
    user: IUserProps | null;
    loading: boolean;
    error: string | null;
    fetchUserData: () => Promise<void>;
    updateAuthToken: (newToken: string) => void;
}

export interface PageParams {
    params: { id: string };
}
