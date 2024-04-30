export default function Footer() {
  return (
    <footer className='p-4 w-screen flex justify-between items-start border-t border-gray-300/30'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-md font-semibold text-gray-600'>Resources</h2>
        <ul className='text-gray-500'>
          <li><a href='https://cs.lmu.edu/~ray/classes/cc/'>Dr. Toal</a></li>
          <li><a href='http://github.com/rtoal/carlos'>Carlos</a></li>
          <li><a href='https://ohmjs.org'>Ohm</a></li>
          <li><a href='https://pyth.readthedocs.io/en/latest/getting-started.html'>Pyth</a></li>
        </ul>

      </div>
      <p className='text-center font-mono text-gray-500 text-base'>© 2024 pythscrip</p>
    </footer>
  );
}