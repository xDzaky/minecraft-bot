import mineflayer from "mineflayer";
import chalk from "chalk";

// Konfigurasi bot
const botArgs = {
    host: 'play.dominationmc.my.id', // Ganti dengan host server Minecraft Anda
    port: 25565,
    version: '1.20.1',
};

class MCBot {
    constructor(name) {
        this.username = name;
        this.password = "ararra12345"; // Ganti dengan password Anda
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
            this.reconnect();
        });

        this.bot.on('error', (err) => {
            this.log(chalk.red(`Error: ${err.message}`));
        });

        this.bot.on('health', () => {
            this.checkHunger();
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
        this.sendGreeting();
    }

    async login() {
        this.log(chalk.green("Logging in the bot..."));
        this.bot.chat(`/login ${this.password}`);
        await this.delay(3000);
        this.sendGreeting();
    }

    async sendGreeting() {
        // Fungsi ini sekarang tidak melakukan apa-apa
        this.log(chalk.green("Greeting bypassed. No movement or actions performed."));
    }

    checkHunger() {
        if (this.bot.food < 20) {
            const foodItem = this.bot.inventory.items().find(i => i.name.includes('steak'));
            if (foodItem) {
                try {
                    this.bot.equip(foodItem, 'hand');
                    this.bot.activateItem();
                    this.log(chalk.green(`Eating ${foodItem.name} to regain hunger.`));
                } catch (err) {
                    this.log(chalk.red(`Failed to eat ${foodItem.name}: ${err.message}`));
                }
            } else {
                this.log(chalk.red("No steak found in inventory!"));
            }
        }
    }

    reconnect() {
        this.log(chalk.yellow("Reconnecting..."));
        setTimeout(() => {
            try {
                this.bot.quit();
            } catch (err) {
                this.log(chalk.red(`Error during quit: ${err.message}`));
            }
            this.initBot();
        }, 5000);
    }
}

// Membuat bot dengan nama acak
const botNames = ["Renyyyx", "Burhanny2"];
botNames.forEach(name => new MCBot(name));
