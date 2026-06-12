import Sidebar from "../../components/sidebar/app-sidebar";
import Navbar from "../../components/navbar/top-navbar";

export default function Layout({ children }) {
  return (
    <div
      className="
flex
min-h-screen
bg-slate-950
text-white
"
    >
      <Sidebar />

      <div
        className="
flex-1
flex
flex-col
"
      >
        <Navbar />

        <main
          className="
flex-1
overflow-auto
p-6
"
        >
          {children}
        </main>
        
      </div>
    </div>
  );
}
