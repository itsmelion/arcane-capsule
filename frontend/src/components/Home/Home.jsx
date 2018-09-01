import React from 'react';
import FileUpload from '../FileUpload/FileUpload';
import FileList from '../FileList/FileList';
import './Home.scss';

const Home = () => (
  <main flex="" column="" id="Home" align="center" fill="">
    <header flex="initial">
      <h1>{process.env.APP_NAME}</h1>
      <sub>A video converter from outta space</sub>
      <legend>Click or drag your video to the capsule below to convert</legend>
    </header>

    <section flex="grow" className="column">
      <div flex="" contain="">
        <FileUpload flex="none" />
        <FileList flex="" />
      </div>
    </section>
  </main>
);

export default Home;
