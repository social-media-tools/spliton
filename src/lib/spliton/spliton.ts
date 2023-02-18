import { spawn } from 'child_process';
import crypto from 'crypto';
import path from 'path';

type SplitEntry = {
  startTime: string;
  endTime: string;
};

type FFMpegEntry = {
  filename: string;
  ss: string;
  t: string;
};

// type FFMpegCommand = {
//   cmd: string;
// };

type ClockTime =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'
  | '48'
  | '49'
  | '50'
  | '51'
  | '52'
  | '53'
  | '54'
  | '55'
  | '56'
  | '57'
  | '58'
  | '59'
  | '60';
/**
 * Spliton API that allows to split video / audio input
 */
export class Spliton {
  ffmpegPath?: string;
  entries: SplitEntry[] = [];
  inputPath!: string;
  ext!: string;
  outDir!: string;

  private get ffmpeg() {
    return this.ffmpegPath || 'ffmpeg';
  }

  private get _ext() {
    if (!this.ext) {
      this.ext = path.extname(this.inputPath);
    }
    return this.ext;
  }

  private get randomUUID() {
    return crypto.randomUUID();
  }

  private getFfmpegEntries() {
    const ffmpegEntries: FFMpegEntry[] = this.entries.map((entry) => ({
      filename: `${this.randomUUID}${this._ext}`,
      ss: entry.startTime,
      t: entry.endTime,
    }));
    return ffmpegEntries;
  }

  private getCommands(ffmpegEntries: FFMpegEntry[]) {
    const commands: string[] = [];
    //ss 00:00:00 -t 00:00:05 -c copy -map 0 output1.mp4 -ss 00:00:05 -t 00:00:05 -c copy -map 0 output2.mp4
    const input = `-i ${this.inputPath}`;
    for (const entry of ffmpegEntries) {
      let command = `${this.ffmpeg} `;
      const ss = `-ss ${entry.ss}`;
      const t = `-t ${entry.t}`;
      const c = `-c copy`;
      const map = `-map 0`;
      const outFile = path.join(this.outDir, entry.filename);
      command += ` ${ss} ${t} ${input} ${c} ${map} ${outFile}`;
      commands.push(command);
    }
    return commands;
  }

  private validateEntries() {
    const entryErrors = [];
    for (const entry of this.entries) {
      let reason = '';
      if (entry.startTime > entry.endTime) {
        reason = 'Start time cannot be higher than end time';
      }
      // if (entry.startTime < 0 || entry.endTime < 0) {
      //   reason = 'Must be timestamp';
      // }
      if (reason) {
        entryErrors.push({
          entry,
          reason,
        });
      }
    }
    if (entryErrors.length !== 0) {
      throw new Error('invalid entry splits');
    }
  }

  setCustomFFmpegPath(ffmpegPath: string) {
    this.ffmpegPath = ffmpegPath;
    return this;
  }

  setOutDir(outDir: string) {
    this.outDir = outDir;
    return this;
  }

  add(entries: SplitEntry | SplitEntry[]) {
    const data = Array.isArray(entries) ? entries : [entries];
    this.entries = [...this.entries, ...data];
    return this;
  }

  async run(inputPath: string) {
    this.inputPath = inputPath;
    this.validateEntries();
    const ffmpegEntries = this.getFfmpegEntries();
    const commands = this.getCommands(ffmpegEntries);
    for await (const cmd of commands) {
      try {
        await this.callFfmpeg(cmd);
      } catch (error) {
        const e = error as Error;
        console.log(`Error, ${e.stack}`);
      }
    }
    return ffmpegEntries;
  }

  private callFfmpeg(ffmpegCmd: string) {
    return new Promise((resolve, reject) => {
      const proc = spawn(ffmpegCmd, { shell: process.env.SHELL });
      proc.once('error', reject);
      proc.once('close', resolve);
    });
  }

  static formatTime(mm: ClockTime, ss: ClockTime) {
    return `00:${mm}:${ss}`;
  }
}
