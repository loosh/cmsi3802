export default function Header() {
  return (
    <header className="p-4 w-full flex justify-between items-center border-b border-gray-300/30">
      <div className='flex items-center gap-x-4'>
        <img src='logo.png' alt='logo' className='w-8 h-8' />
        <h1 className='text-xl font-semibold text-logoblue font-mono'>[pythscrip]</h1>
      </div>
      <h2 className='font-mono text-gray-500 text-sm'>
        Made for CMSI 3802
      </h2>
    </header>
  );
}