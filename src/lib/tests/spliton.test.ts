//import fs from 'fs';
import path from 'path';

import test from 'ava';

import { Spliton } from '../spliton/spliton';
import { getAssetsDir } from '../utils';

test('Creates new video', async (t) => {
  const assetDir = getAssetsDir();
  const videoPath = path.join(assetDir, 'sample.mp4');
  try {
    await new Spliton()
      .add({
        startTime: '00',
        endTime: '02',
      })
      .run(videoPath);

    // const tempFile = path.resolve();
    // const exists = fs.existsSync(tempFile);
    // if (!exists) {
    //   t.fail(`Video file was not created`);
    //   return;
    // }
    // fs.rmSync(tempFile);
    t.pass();
  } catch (error: unknown) {
    const e = error as Error;
    t.fail(`Exception thrown - ${e.message}`);
  }
});
