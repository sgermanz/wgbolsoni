/* Payload admin root layout — owns its own <html>/<body> document and CSS.
 * The site's globals.css does NOT leak in here, and the admin's styles do NOT
 * leak into the public site. The two route groups are independent root layouts.
 */
import type { ServerFunctionClient } from "payload";

import config from "@/payload.config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import "@payloadcms/next/css";

import { importMap } from "./admin/importMap.js";

import "./custom.scss";

type LayoutArgs = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: LayoutArgs) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
);

export default Layout;
