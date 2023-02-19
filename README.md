# spliton

Split audio or video files into chunks.

# Usage (Examples)

```js
const outDir = '/home/user/cut-videos';

const splitEntries = [
  {
    startTime: '00:05',
    endTime: '00:10',
  },
  {
    startTime: '00:10',
    endTime: '00:30',
  },
];

const sourceFile = '/home/user/videos/sample.mp4';

const data = await new Spliton()
  .setOutDir(outDir)
  .add(splitEntries)
  .run(sourceFile);

// Data will be returned in such format:
/**
  [
      {
          "filename": "4e1ac1bc-e87c-4347-ba94-f44be8ee7c92.mp4",
          "ss": "00:05",
          "t": "00:10"
      },
      {
          "filename": "e6706df5-e29c-4974-b902-0d4052d5141e.mp4",
          "ss": "00:10",
          "t": "00:30"
      }
  ]
 */
```

# Dependencies

- Requires ffmpeg to be available.
- To set custom ffmpeg path:

```js
const customFFmpegPath = '/usr/bin/ffmpeg';
const sourceFile = '/home/user/videos/sample.mp4';

const data = await new Spliton()
  .setCustomFFmpegPath(customFFmpegPath);
  .setOutDir(outDir)
  .add(splitEntries)
  .run(sourceFile);
```

- Or set ffmpeg binary to be available under **PATH** environment variable.
