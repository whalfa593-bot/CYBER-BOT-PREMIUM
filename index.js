const OWNER = "255613424187@s.whatsapp.net";
const BOT_NAME = "CYBER AI Premier";
const PREFIX = "!";
const OWNER = "255613424187@s.whatsapp.net";

const commands = {
"menu": async (sock, msg) => {
let txt = "🤖 *${CYBER-BOT-PREMIUM}*\n\n";
txt += "!menu - Ona menu\n";
txt += "!ping - Angalia kama bot iko online\n";
txt += "!owner - Namba ya owner\n";

await sock.sendMessage(msg.key.remoteJid, { text: txt });

},

"ping": async (sock, msg) => {
await sock.sendMessage(msg.key.remoteJid, {
text: "🏓 Pong!\n✅ Bot iko ONLINE"
});
},

"owner": async (sock, msg) => {
await sock.sendMessage(msg.key.remoteJid, {
text: "👑 Owner: wa.me/${OWNER.split('@')[0]}"
});
}
};
