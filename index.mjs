import express from 'express';
import { startBot } from './bot-minecraft.mjs';

const app = express();
const port = 3000;

// Menjalankan server HTTP agar aplikasi tetap aktif
app.get('/', (req, res) => {
  res.send('Minecraft Bot is Running!');
});

// Memulai bot Minecraft
startBot();

// Menjalankan server pada port 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
