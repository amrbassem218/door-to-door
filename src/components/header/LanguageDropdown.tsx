'use client';
import * as React from "react";
import { useState, useEffect, useRef } from 'react';
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
