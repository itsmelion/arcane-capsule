import React from 'react';
import FileUpload from '../FileUpload/FileUpload';
import './Home.scss';

const Home = () => (
  <main flex="" id="Home" align="center" fill="">
    <header>
      <h1>{process.env.APP_NAME}</h1>
      <sub>A video converter from outta space</sub>
    </header>

    <div className="row nowrap">
      <section flex="" column="" align="center">
        <FileUpload />
      </section>
    </div>
  </main>
);

export default Home;
