import { MainNav } from "@/components/main-nav";

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
