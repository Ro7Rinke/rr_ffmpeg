const fs = require('fs');

// let Ffmpeg = require('fluent-ffmpeg')
// let command = ffmpeg('my-file.mp4')



// Ffmpeg.getAvailableFormats(function(err, formats) {
//   console.log('Available formats:');
//   console.dir(formats);
// });

// Ffmpeg.getAvailableCodecs(function(err, codecs) {
//   console.log('Available codecs:');
//   console.dir(codecs);
// });

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

const pathInputs = './src'
const pathOutputs = ''

const getInputFiles = () => {
  return fs.readdirSync(pathInputs)
}

const main = async () =>{
  const files = getInputFiles()
  for (const file of files) {
    
  }
}



main()