import React from 'react';
import './Home.scss';
import FileUpload from '../components/FileUpload/FileUpload';

const Home = () => (
  <main flex="" id="Home" align="center" fill="">
    <header>
      <h1>{process.env.appName}</h1>
      <sub>A video converter from outta space</sub>
    </header>

    <div className="row nowrap process">
      <section flex="" column="" align="center">
        <FileUpload />
      </section>
    </div>
  </main>
);

export default Home;
