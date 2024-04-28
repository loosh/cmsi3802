export default function Hero() {
  return (
    <div className='px-4 md:px-6 w-full flex flex-col items-center ml-auto mr-auto gap-6'>
      <h1 className='text-3xl md:text-4xl font-bold text-center mb-4 max-w-2xl'>Combining the best parts of <span className='text-python'>Python</span> and <span className='text-javascript'>Javascript</span> into <span className='underline underline-offset-2'>one language.</span></h1>
      <p className='text-lg text-center font-mono max-w-3xl'>Pythscrip utilizes compact syntax inspired by the golfing language pyth, and draws from the features we love the most in Python and Javscript. Check out our examples below to learn more!</p>

      <a href='https://github.com/loosh/pythscrip' target='_blank' rel='noopener noreferrer'>
        <div className='flex items-center gap-4 rounded-md'>
          <img src='github.svg' alt='github' className='w-6 h-6 fill-logoblue' />
          <p className='text-logoblue font-medium'>View on Github</p>
        </div>
      </a>
    </div>

  );
}