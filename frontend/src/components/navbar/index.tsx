'use client';

import Logo from "./logo"
import UserMenu from "./userMenu"
import React, { ReactNode } from 'react';
import { getCurrentUser } from "@/services/user";

type NavigationBarProps = {
    children: ReactNode;
  };


const NavigationBar =  () => {
    return (
        <header className="top-0 left-0 w-full bg-[#242145] fixed z-10">
            <nav className="py-[10px] border-b-[0px] px-10">
                <div className="flex justify-between items-center">
                    <Logo />
                    <UserMenu />
                </div>
            </nav>
        </header>
    )
}

export default NavigationBar;