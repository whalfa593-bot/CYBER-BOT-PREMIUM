const OWNER = "255613424187@s.whatsapp.net";
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const BOT_NAME = "CYBER AI Premier";
const PREFIX = "!";
const OWNER = "255613424187@s.whatsapp.net"; // Weka namba yako

const commands = {
    "menu": async (sock, msg) => {
        let txt = `╔════════════════════╗\n`;
        txt += `║ *${BOT_NAME}* 🤖 ║\n`;
        txt += `╚════════════════════╝\n\n`;
        txt += `*!menu* - Ona menu hii\n`;
        txt += `*!ping* - Bot iko hai?\n`;
        txt += `*!ai [swali]* - Uliza CYBER AI\n`;
        txt += `*!github [repo] [file]* - Vuta code\n`;
        txt += `*!owner* - Namba ya mkuu\n\n`;
        txt += `_Powered by CYBER_`;
        await sock.sendMessage(msg.key.remoteJid, { text: txt });
    },

    "ping": async (sock, msg) => {
        const start = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong!" });
        const end = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: `⚡ Speed: ${end-start}ms\n✅ Bot iko ONLINE` });
    },

    "ai": async (sock, msg, args) => {
        if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mfano:!ai Tanzania iko wapi" });
        let q = args.join(' ');
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "⏳", key: msg.key } });
        try {
            let res = await axios.get(`https://api.nexray.web.id/ai/claude?text=${encodeURIComponent(q)}`);
            let ans = res.data.result || res.data;
            // SIRI KUBWA: Badilisha jina liwe Nexus
            ans = ans.replace(/Claude|Anthropic|AI assistant/gi, 'CYBER AI Premier');
            ans = ans.replace(/I am |I'm /i, "Mimi ni CYBER TECH AI Premier, ");
            await sock.sendMessage(msg.key.remoteJid, { text: `🤖 *Nexus AI:*\n\n${ans}` });
            await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: "❌ Nexus AI amezidiwa. Jaribu tena" });
        }
    },

    "github": async (sock, msg, args) => {
        if (args.length < 2) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mfano:!github adiwajshing/Baileys example.js" });
        let [repo,...fileParts] = args;
        let file = fileParts.join('/');
        try {
            let url = `https://raw.githubusercontent.com/${repo}/main/${file}`;
            let code = await axios.get(url);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `📁 *GitHub Import*\nRepo: ${repo}\nFile: ${file}\n\n\`\`\`javascript\n${code.data.substring(0,3000)}\n\`\`\`\n\n_By CYBER_`
            });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: "❌ File haijapatikana. Hakikisha repo ni public" });
        }
    },

    "owner": async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `👑 *Owner:* wa.me/${OWNER.split('@')[0]}\n💬 Nicheki kwa bot za kibiashara`
        });
    }
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true, browser: [BOT_NAME, "Chrome", "3.0"] });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'close') {
            if (u.lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut) startBot();
        } else if (u.connection === 'open') {
            console.log('✅ Cyber BOT PREMIER IMEWAKA');
            sock.sendMessage(OWNER, { text: `*${BOT_NAME}* imewaka sasa 🔥` });
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!text.startsWith(PREFIX)) return;
        const args = text.slice(PREFIX.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();
        if (commands[cmd]) await commands[cmd](sock, msg, args);
    });
}
startBot();
                                   
