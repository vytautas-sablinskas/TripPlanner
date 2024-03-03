import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-200 py-2 flex justify-between items-center px-4">
      <ul className="flex justify-end items-center px-4">
        <li>
          <Link href="/" className='text-white'>Home</Link>
        </li>
      </ul>
      <ul className="flex justify-end items-center px-4">
        <li className="ml-4">
          <Link href="/login" className='text-white'>Log In</Link>
        </li>
        <li className="ml-4">
          <Link href="/register" className='text-white'>Register</Link>
        </li>
        <li className="ml-4">
          <Link href="/profile" className='text-white'>Profile</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;