import React, { PureComponent } from 'react';
import axios from 'axios';

import FileUpload from '../FileUpload/FileUpload';
import FileList from '../FileList/FileList';
import './Home.scss';

const { API_URL } = process.env;

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openList: false,
      files: [],
    };
  }

  componentWillMount() {
    this.fetchList();
  }

  fetchList = () => {
    axios.get(`${API_URL}/files`)
      .then(({ data }) => this.setState(({ files }) => ({
        files: [...files, ...data],
      })));
  };

  toggleList(override) {
    this.setState(({ openList }) => {
      const isOverride = typeof override !== 'undefined';
      return ({
        openList: (isOverride && override) || !openList,
      });
    });
  }

  render() {
    const { openList, files } = this.state;
    return (
      <main flex="" column="" id="Home" align="center" fill="">
        <header flex="initial">
          <h1>{process.env.APP_NAME}</h1>
          <sub>A video converter from outta space</sub>
          <legend>Click or drag your video to the capsule below to convert</legend>
        </header>

        <section flex="grow" className="column">
          <div flex="" className="contain column" align="between">
            <FileUpload flex="none" toggleList={this.toggleList} />

            <button
              type="button"
              className="button list-button"
              onClick={() => this.toggleList()}
            >
              {openList ? 'Hide' : 'Show' } List
            </button>

            <FileList flex="initial" files={files} open={openList} />
          </div>
        </section>
      </main>
    );
  }
}

export default Home;
