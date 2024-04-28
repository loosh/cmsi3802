import Header from './components/header';
import Hero from './components/hero';
import Examples from './components/examples';
import About from './components/about';
import Footer from './components/footer';

function App() {
  return (
    <div className='flex flex-col gap-y-16'>
      <Header />
      <Hero />
      <Examples />
      <About />
      <Footer />
    </div>
  );
}

export default App;
