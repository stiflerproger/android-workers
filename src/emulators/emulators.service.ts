import { Injectable, OnModuleInit } from '@nestjs/common';
import Adb, { DeviceClient } from '@devicefarmer/adbkit';
import * as sharp from 'sharp';
import { sleep } from '../utils/sleep';

@Injectable()
export class EmulatorsService implements OnModuleInit {
  private readonly adbClient;

  constructor() {
    this.adbClient = Adb.createClient();
  }

  async onModuleInit() {
    const devices: any[] = await this.adbClient.listDevicesWithPaths();

    if (!devices.length) return console.log('No device');

    const device = await this.adbClient.getDevice(devices[0].id);

    console.log(await this.getDeviceIMEI(device));
    console.log(await this.getDeviceIp(device));
  }

  async getDeviceIMEI(device: DeviceClient) {
    const stream = await device.shell(
      "service call iphonesubinfo 1 | awk -F \"'\" '{print $2}' | sed '1 d' | tr -d '.' | awk '{print}' ORS=",
    );

    return (await Adb.util.readAll(stream)).toString().trim();
  }
  //com.tunnelworkshop.postern
  async getDeviceIp(device: DeviceClient) {
    await device.shell(
      'am start -a android.intent.action.VIEW -d "https://whatismyipaddress.com/" com.android.browser',
    );

    await sleep(10_000);

    await sharp(
      Buffer.concat(await getDataFromStream(await device.screencap())),
    ).toFile('1.png');

    return;
  }
}

function getDataFromStream(stream): Promise<Uint8Array[]> {
  return new Promise((resolve, reject) => {
    let chunks: Uint8Array[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(chunks);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}
