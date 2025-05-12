import { MainNav } from "@/components/main-nav";
import { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div>
      <MainNav />
      {children}
    </div>
  );
}
