const fs = require('fs');
const Ffmpeg = require('fluent-ffmpeg')

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

const pathInputs = 'C:/ff_mpeg/input'
const pathOutputs = 'C:/ff_mpeg/output'

const getInputFiles = () => {
  const paths = fs.readdirSync(pathInputs)
  let files = []

  for (const path of paths) {
    const data = path.split('.')
     
    files.push({
      name: data[0],
      type: data[1]
    })  
  }

  return files
}

const convert = async (file) => {

  let command = Ffmpeg(`${pathInputs}/${file.name}.${file.type}`)
    .videoCodec('hevc_nvenc')
    .on('progress', function(progress) {
      console.log(`Processing ${file.name}: ${progress.percent.toFixed(2)} % done`)
    })
    .on('error', function(err, stdout, stderr) {
      console.log(`Cannot process ${file.name}: ${err.message}`)
    })
    .on('end', function(stdout, stderr) {
      console.log(`Transcoding ${file.name} succeeded!`)
    })

    await command.save(`${pathOutputs}/${file.name}.mp4`)

}

const main = async () =>{
  const files = getInputFiles()
  for (const file of files) {
    await convert(file)
  }
}



main()