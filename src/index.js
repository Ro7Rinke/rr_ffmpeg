const fs = require('fs');
const Path = require('path')
const Ffmpeg = require('fluent-ffmpeg');
const { exit } = require('process');

// let command = ffmpeg('my-file.mp4')

// Ffmpeg.getAvailableFormats(function(err, formats) {
//   console.log('Available formats:');
//   console.dir(formats);
// });

// Ffmpeg.getAvailableCodecs(function(err, codecs) {
//   console.log('Available codecs:');
//   for (const key in codecs) {
//     if (Object.hasOwnProperty.call(codecs, key)) {
//       const element = codecs[key];
//       if(element.type == 'video'){
//         console.log(key, element)
//       }
//     }
//   }  
// })

// Ffmpeg.getAvailableEncoders(function(err, encoders) {
//   console.log('Available encoders:');
//   console.dir(encoders);
// });

// Ffmpeg.getAvailableFilters(function(err, filters) {
//   console.log("Available filters:");
//   console.dir(filters);
// });

// Those methods can also be called on commands
// new Ffmpeg({ source: '/path/to/file.avi' })
//   .getAvailableCodecs(...);

const args = process.argv.slice(2);

const pathInputs = args[0] ?? './input'
const pathOutputs = args[1] ?? './output'

const videoCodec = args[2] ?? 'hevc_nvenc' // 'h264_nvenc'

const asyncConvert = args[3] ?? false

const getInputFiles = () => {
    const paths = fs.readdirSync(pathInputs)
    let files = []

    for (const path of paths) {        
        const type = Path.extname(`${pathInputs}/${path}`)
        files.push({
            name: Path.basename(`${pathInputs}/${path}`, type),
            type
        })
    }

    return files
}

const convert = async (file) => {
    return new Promise((resolve, reject) => {
        let command = Ffmpeg(`${pathInputs}/${file.name}${file.type}`)
            .videoCodec(videoCodec)
            .on('progress', function (progress) {
                console.log(`Processing ${file.name}: ${progress.percent.toFixed(2)} % done`)
            })
            .on('error', function (err, stdout, stderr) {
                console.error(`Cannot process ${file.name}: ${err.message}`)
                reject(err)
            })
            .on('end', function (stdout, stderr) {
                console.log(`Transcoding ${file.name} succeeded!`)
                resolve()
            })
            .save(`${pathOutputs}/${file.name}.mp4`)
    })

}

const processFiles = async () => {
    return new Promise(async (resolve, reject) => {
        if(fs.existsSync(pathInputs)){
            if(!fs.statSync(pathInputs).isDirectory()){
                console.error(`The specified path "${pathInputs}" is not a directory!`)
                return
            }
        }else{
            console.error(`The specified path "${pathInputs}" does not exist!`)
            return
        }
    
        if(fs.existsSync(pathOutputs)){
            if(!fs.statSync(pathOutputs).isDirectory()){
                console.error(`The specified path "${pathOutputs}" is not a directory!`)
                return
            }
        }else{
            fs.mkdirSync(pathOutputs)
        }
    
        let promises = []

        const files = getInputFiles()
        for (const file of files) {
            asyncConvert ? promises.push(convert(file)) : await convert(file)
        }

        if(asyncConvert){
            Promise.all(promises)
                .then(data => {
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        }else{
            resolve()
        }
    })
}

const main = async () => {
    const startTime = new Date()
    
    await processFiles()
    
    const endTime = new Date

    console.log(`Time elapsed: ${endTime - startTime} ms`)
}

main()