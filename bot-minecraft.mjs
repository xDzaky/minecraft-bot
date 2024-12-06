import mineflayer from "mineflayer";
import chalk from "chalk";

const botArgs = {
    host: 'play.dominationmc.my.id', // Ganti dengan host server Minecraft Anda
    port: 25565,
    version: '1.20.1',
};

class MCBot {
    constructor(name) {
        this.username = name;
        this.password = "ararra12345"; // Ganti dengan password Anda
        this.reconnectDelay = 5000; // 5 detik untuk reconnect
        this.maxReconnectAttempts = 10; // Batas reconnect
        this.currentReconnectAttempts = 0;
        this.initBot();
    }

    initBot() {
        this.bot = mineflayer.createBot({
            username: this.username,
            host: botArgs.host,
            port: botArgs.port,
            version: botArgs.version,
        });

        this.initEvents();
    }

    log(...msg) {
        console.log(`[${this.username}]`, ...msg);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initEvents() {
        this.bot.on('login', async () => {
            this.log(chalk.green("Successfully logged in!"));
            this.currentReconnectAttempts = 0; // Reset reconnect attempts
        });

        this.bot.on('spawn', async () => {
            this.log(chalk.blue("Bot spawned in the server."));
            await this.handleLoginRegister();
        });

        this.bot.on('message', async (message) => {
            const msgText = message.toString();
            this.log(`[SERVER] ${msgText}`);

            if (msgText.toLowerCase().includes("register")) {
                await this.register();
            } else if (msgText.toLowerCase().includes("login")) {
                await this.login();
            }
        });

        this.bot.on('end', (reason) => {
            this.log(chalk.red(`Disconnected: ${reason}`));
            if (this.currentReconnectAttempts < this.maxReconnectAttempts) {
                this.reconnect();
            } else {
                this.log(chalk.red("Max reconnect attempts reached. Exiting..."));
            }
        });

        this.bot.on('error', (err) => {
            this.log(chalk.red(`Error: ${err.message}`));
        });

        this.bot.on('death', async () => {
            this.log(chalk.red("Bot died, typing /back..."));
            await this.delay(1000);
            this.bot.chat("/back");
        });
    }

    async handleLoginRegister() {
        await this.delay(2000);
    }

    async register() {
        this.log(chalk.yellow("Registering the bot..."));
        this.bot.chat(`/register ${this.password} ${this.password}`);
        await this.delay(3000);
    }

    async login() {
        this.log(chalk.green("Logging in the bot..."));
        this.bot.chat(`/login ${this.password}`);
        await this.delay(3000);
    }

    reconnect() {
        this.currentReconnectAttempts++;
        this.log(chalk.yellow(`Reconnecting attempt ${this.currentReconnectAttempts}/${this.maxReconnectAttempts}...`));
        setTimeout(() => {
            try {
                if (this.bot) {
                    this.bot.quit();
                }
            } catch (err) {
                this.log(chalk.red(`Error during quit: ${err.message}`));
            }
            this.initBot();
        }, this.reconnectDelay);
    }
}

// Membuat bot dengan nama acak
const botNames = ["Burhanny2"];
botNames.forEach(name => new MCBot(name));
