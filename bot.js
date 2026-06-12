const mineflayer = require('mineflayer')
const readline = require('readline') 

const config = {
  host: "zenith.seedloaf.gg", // Jangan lupa ganti dengan Domain/IP server kamu
  username: "rajamc",
  version : "1.21.11",
  auth: "offline" 
}

let bot
let antiAfk

// Setup pembaca input dari terminal Termux
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Fungsi untuk menangkap apa yang kamu ketik di terminal
rl.on('line', (input) => {
  if (bot && bot.username) {
    bot.chat(input) 
  } else {
    console.log("Bot belum terhubung ke server!")
  }
})

function createBot() {
  console.log("Mencoba connect...")

  bot = mineflayer.createBot(config)

  bot.once('spawn', () => {
    console.log("Bot berhasil masuk! Sekarang kamu bisa ketik chat/command di sini.")

    if (antiAfk) clearInterval(antiAfk)

    // Anti AFK: lompat setiap 30 detik
    antiAfk = setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => {
        bot.setControlState('jump', false)
      }, 500)
    }, 30000)
  })

  bot.on('message', (message) => {
    console.log(message.toAnsi()) 
  })

  // FITUR BARU: Menampilkan alasan terputus (DC)
  bot.on('end', (reason) => {
    console.log(`\n[!] Bot terputus (DC) dari server!`)
    console.log(`[!] Alasan sistem: ${reason}`)
    console.log(`[*] Mencoba reconnect dalam 5 detik...\n`)
    
    if (antiAfk) clearInterval(antiAfk)
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log("[!] Error Jaringan:", err.message)
  })

  // FITUR BARU: Menampilkan pesan kick dari server
  bot.on('kicked', (reason) => {
    console.log(`\n[!] Bot di-kick oleh server/admin!`)
    console.log(`[!] Pesan kick: ${reason}\n`)
  })
}

createBot()
