import { Client } from 'ssh2';
import fs from 'fs';

const sshClient = new Client();

const setupTunnel = () => {
  return new Promise((resolve, reject) => {
    sshClient
      .on('ready', () => {
        sshClient.forwardIn('127.0.0.1', process.env.DB2_PORT, (err) => {
          if (err) return reject(err);
          console.log(`SSH Tunnel aktif di port ${process.env.DB2_PORT}`);
          resolve();
        });
      })
      .on('tcp connection', (info, accept, reject) => {
        const channel = accept();
        const remoteConn = require('net').connect({
          host: process.env.REMOTE_DB_HOST,
          port: process.env.REMOTE_DB_PORT
        }, () => {
          channel.pipe(remoteConn).pipe(channel);
        });
        remoteConn.on('error', (err) => {
          console.error('Koneksi remote error:', err);
          channel.end();
        });
      })
      .connect({
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
        username: process.env.SSH_USER,
        privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
      });
  });
};

export const initializeTunnel = async () => {
  try {
    await setupTunnel();
  } catch (error) {
    console.error('Gagal membuat SSH tunnel:', error);
    process.exit(1);
  }
};