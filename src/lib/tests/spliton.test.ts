//import fs from 'fs';
import path from 'path';

import test from 'ava';

import { Spliton } from '../spliton/spliton';
import { getAssetsDir } from '../utils';

test('Creates new video', async (t) => {
  const assetDir = getAssetsDir();
  const videoPath = path.join(assetDir, 'sample.mp4');
  await new Spliton()
    .add({
      startTime: '00',
      endTime: '02',
    })
    .add([
      {
        startTime: '00',
        endTime: '02',
      },
    ])
    .setOutDir(path.join(__dirname, 'temp'))
    .run(videoPath);
  t.pass();
});

test('Format time works as expected', (t) => {
  const time = Spliton.formatTime('00', '00');
  t.is(time, '00:00:00');
});

test('Allows to set ffmpeg binary path', (t) => {
  const spliton = new Spliton();
  spliton.setCustomFFmpegPath('/usr/bin/ffmpeg');
  t.is(spliton.ffmpegPath, '/usr/bin/ffmpeg');
});

test('Validates ffmpeg entries', async (t) => {
  const assetDir = getAssetsDir();
  const videoPath = path.join(assetDir, 'sample.mp4');
  try {
    await new Spliton()
      .add({
        startTime: '02',
        endTime: '01',
      })
      .run(videoPath);
  } catch (error: unknown) {
    const e = error as Error;
    t.is(e.message, 'invalid entry splits');
  }
});
