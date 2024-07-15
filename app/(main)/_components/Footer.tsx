import React from "react";
import { Link } from "@nextui-org/link";

const Footer = () => {
  return (
    <Link
      isExternal
      href="https://github.com/taxtra"
      showAnchorIcon
      color="foreground"
      className="absolute p-10 left-0 bottom-0"
    >
      Build with ♥ by Taxtra
    </Link>
  );
};

export default Footer;
