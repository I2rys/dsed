(async()=>{
    "use strict";

    // Dependencies
    const fileDownloader = require("nodejs-file-downloader")
    const axios = require("axios")
    const fs = require("fs")
    
    // Variables
    const args = process.argv.slice(2)
    
    // Main
    if(!args.length) return console.log("node index.js <token> <guildId> <outputDirectory>")
    if(!args[1]) return console.log("Invalid guildId.")
    if(!args[2]) return console.log("Invalid outputDirectory.")
    if(!fs.existsSync(args[2])) return console.log("Invalid outputDirectory.")
    
    const guildEmojis = await axios({
        method: "GET",
        url: `https://discord.com/api/v6/guilds/${args[1]}/emojis`,
        headers: {
            authorization: args[0]
        }
    }).catch(()=>{
        console.log("Invalid guildID/discord_token.")
        process.exit()
    })
    
    const guild = await axios({
        method: "GET",
        url: `https://discord.com/api/v6/guilds/${args[1]}`,
        headers: {
            authorization: args[0]
        }
    })
    
    const emojis = guildEmojis.data
    
    if(emojis.length){
        console.log(`${emojis.length} emojis found in ${guild.data.name}.`)
        console.log(`Downloading has started.`)
    
        var emojiIndex = 0
        
        async function download(){
            if(emojiIndex === emojis.length) return console.log("Downloading is finished.")
    
            const downloadFile = new fileDownloader({
                url: `https://cdn.discordapp.com/emojis/${emojis[emojiIndex].id}.${ emojis[emojiIndex].animated ? "gif" : "png" }`,
                directory: args[2],
                fileName: `${emojis[emojiIndex].name}.${ emojis[emojiIndex].animated ? "gif" : "png" }`
            })
    
            try{
                await downloadFile.download()
    
                console.log(`Status: Success | Emoji link: https://cdn.discordapp.com/emojis/${emojis[emojiIndex].id}.${ emojis[emojiIndex].animated ? "gif" : "png" }`)
            }catch{
                console.log(`Status: Failed | Emoji link: https://cdn.discordapp.com/emojis/${emojis[emojiIndex].id}.${ emojis[emojiIndex].animated ? "gif" : "png" }`)
            }
    
            emojiIndex++
            download()
        }

        download()
    }else{
        console.log(`No emojis found in ${guild.data.name}.`)
    }
})()