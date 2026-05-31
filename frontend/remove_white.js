const Jimp = require('jimp');

Jimp.read('src/assets/genie.png')
  .then(image => {
    // Scan all pixels
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      // Get RGB values
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to pure white (background), make it entirely transparent
      if (red > 235 && green > 235 && blue > 235) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });
    
    // Save as new transparent image
    return image.writeAsync('src/assets/genie_transparent.png');
  })
  .then(() => {
    console.log('Successfully removed white background!');
  })
  .catch(err => {
    console.error('Error:', err);
  });
