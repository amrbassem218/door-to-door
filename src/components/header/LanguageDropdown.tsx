"use client";
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { useState, useEffect, useRef } from 'react';
import Flag from 'react-world-flags'
interface ILanguageDropdownProps {}

const LanguageDropdown: React.FunctionComponent<ILanguageDropdownProps> = (
  props
) => {
  const [open, setOpen] = React.useState(false);
  const egypt = { code: "EG", name: "Egypt" };
  const [userCountry, setUserCountry] = useState(egypt);
  const [userLanguage, setUserLanguage] = useState("EN");
  return (
    <div></div>
  );
};

export default LanguageDropdown;
