export default function About() {
  // Return a developer bio page for 2 developers
  return (
    <div className='px-8 md:px-4 w-full max-w-6xl flex flex-col items-center ml-auto mr-auto gap-12'>
      <h1 className='text-4xl font-bold text-center mb-4 max-w-2xl'>Meet the Developers</h1>
      <div className='flex-col md:flex-row flex justify-between gap-12 ml-auto mr-auto'>
        <DeveloperBio name='Lucian' image='https://avatars.githubusercontent.com/u/56782878?v=4' website='https://loosh.me' bio=' Lucian is a full-stack developer with a passion for creating beautiful and functional web applications. He is a big fan of Node and TS.' />
        <DeveloperBio name='Nicolas' image='https://avatars.githubusercontent.com/u/89878786?v=4' bio='Nicolas is a software developer with a passion for machine learning and data science. He is a big fan of Python.' />
      </div>
    </div>
  );
};

function DeveloperBio({ name, image, bio, website }) {
  return (
    <div className='flex gap-8 w-full md:w-1/2'>
      <img src={image} alt={name} className='w-24 h-24 md:w-36 md:h-36 rounded-full' />
      <div className='flex flex-col gap-2'>
        <h2 className='text-3xl font-semibold'>{name}</h2>
        <p>{bio}</p>
        {website && <div>
          <a href={website} target='_blank' rel='noopener noreferrer' className='text-logoblue font-medium'>My Portfolio Site</a>
        </div>}
      </div>
    </div>
  );
}