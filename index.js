//Dependencies
const File_Downloader = require("nodejs-file-downloader")
const Axios = require("axios")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <discord_token> <guild_id> <directory_output>")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid guild_id.")
    process.exit()
}

if(isNaN(Self_Args[1])){
    console.log("guild_id is not a number.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid directory_output.")
    process.exit()
}

if(!Fs.existsSync(Self_Args[2])){
    console.log("Invalid directory_output.")
    process.exit()
}

void async function Main(){
    const guild_emojis = await Axios({
        method: "GET",
        url: `https://discord.com/api/v6/guilds/${Self_Args[1]}/emojis`,
        headers: {
            authorization: Self_Args[0]
        }
    }).catch(()=>{
        console.log("Invalid guild_id/discord_token.")
        process.exit()
    })
    
    const guild = await Axios({
        method: "GET",
        url: `https://discord.com/api/v6/guilds/${Self_Args[1]}`,
        headers: {
            authorization: Self_Args[0]
        }
    })

    const emojis = guild_emojis.data

    if(!emojis.length){
        console.log(`No emojis found in ${guild.data.name}.`)
        process.exit()
    }else{
        console.log(`${emojis.length} emojis found in ${guild.data.name}.`)
        console.log(`Downloading has started.`)

        var emoji_index = 0
        
        download()
        async function download(){
            if(emoji_index === emojis.length){
                console.log("Downloading is finished.")
                process.exit()
            }

            const download_file = new File_Downloader({
                url: `https://cdn.discordapp.com/emojis/${emojis[emoji_index].id}.${ emojis[emoji_index].animated ? "gif" : "png" }`,
                directory: Self_Args[2],
                fileName: `${emojis[emoji_index].name}.${ emojis[emoji_index].animated ? "gif" : "png" }`
            })

            try{
                await download_file.download()

                console.log(`Status: Success | Emoji link: https://cdn.discordapp.com/emojis/${emojis[emoji_index].id}.${ emojis[emoji_index].animated ? "gif" : "png" }`)
            }catch{
                console.log(`Status: Failed | Emoji link: https://cdn.discordapp.com/emojis/${emojis[emoji_index].id}.${ emojis[emoji_index].animated ? "gif" : "png" }`)
            }

            emoji_index++
            download()
        }
    }
}()
