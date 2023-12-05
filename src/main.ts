import { DefaultViewerParams, SelectionEvent, ViewerEvent, DebugViewer } from '@speckle/viewer';
import Utils from './Utils';

import './style.css';

class Viewer {
  public viewer: DebugViewer;
  public container: HTMLElement;
  public url: string;

  constructor() {
    // update your url here
    this.url = 'https://speckle.xyz/streams/be998f9856/commits/e3d79bbd2c';
    this.container = document.querySelector('#app')!;

    const params = DefaultViewerParams;
    params.showStats = true;
    params.verbose = true;

    this.viewer = new DebugViewer(this.container, params);
  }

  init() {
    this.viewer.init();

    this.loadUrl(this.url, this.viewer);

    this.viewer.on(ViewerEvent.LoadComplete, (url) => {
      // this is not working
      console.log(`url loaded -> ${url}`);
    });

    this.viewer.on(ViewerEvent.ObjectClicked, async (selectionInfo: SelectionEvent) => {
      console.log('selectionInfo ->', selectionInfo);

      if (selectionInfo) {
        this.viewer.zoom([selectionInfo.hits[0].object.id as string]);

        const selectedId = selectionInfo?.hits[0].object.id;

        document.querySelector('#doc_id')!.innerHTML = `id - ${selectedId}`;

        await this.viewer.selectObjects([selectedId as string]);
      } else {
        document.querySelector('#doc_id')!.innerHTML = ``;
      }
      return;
    });
  }

  async loadUrl(url: string, viewer: DebugViewer) {
    const objectUrl = await Utils.getObjectUrl(url);

    console.log(`Loading ${objectUrl}`);

    await viewer.loadObjectAsync(objectUrl, undefined, undefined, 1);
  }
}

// entry
const viewer = new Viewer();
viewer.init();
