// components/Sidebar.js
import Link from 'next/link';
import { FaHome, FaWpforms } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { PiArticleNyTimes } from "react-icons/pi";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 p-6 hidden md:block">
      <div className="text-white mb-6">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <nav>
      <Link href="/" className="text-gray-400 hover:bg-gray-600 p-2 rounded flex items-center">
          <FaHome className="mr-2" /> Home
        </Link>
        <Link href="/Products" className="text-gray-400 hover:bg-gray-600 p-2 rounded flex items-center">
          <AiFillProduct className="mr-2" /> Products
        </Link>
        <Link href="/Blogs" className="text-gray-400 hover:bg-gray-600 p-2 rounded flex items-center">
          <PiArticleNyTimes className="mr-2" /> Blogs
        </Link>
        <Link href="/DownloadableForms" className="text-gray-400 hover:bg-gray-600 p-2 rounded flex items-center">
          <FaWpforms className="mr-2" /> Downloadable Forms
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
