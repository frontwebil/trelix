import { LeftSideBar } from "@/components/LeftSideBar";
import { RightSidebar } from "@/components/RightSidebar";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <LeftSideBar />
      <div className="h-screen xl:mr-85 mr-0 md:ml-85 ml-0">{children}</div>
      <RightSidebar />
    </div>
  );
}
