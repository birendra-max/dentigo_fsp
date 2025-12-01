import { Link } from 'react-router-dom';

export default function Foot() {
  return (
    <footer className="bg-[#042333] text-gray-300 py-4 px-6 flex flex-col md:flex-row justify-between items-center w-full mt-4">
      <div className="text-sm">
        <strong>
          Copyright &copy; 2015 {}
          <Link to="/user/home" className="text-pink-700 hover:underline">
            Dentigo
          </Link>
        </strong>{" "}
        All rights reserved.
      </div>

      <div className="text-sm mt-2 md:mt-0">
        <b className="text-white">Dentigo</b>
      </div>
    </footer>
  );
}
