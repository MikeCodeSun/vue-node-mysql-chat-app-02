const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = async (buffer) => {
  const folder = path.join(__dirname, "..", "public/image");
  const fileName = `${uuidv4()}.png`;
  await sharp(buffer)
    .resize(300, 300, {
      withoutEnlargement: true,
      fit: sharp.fit.inside,
    })
    .toFile(`${folder}/${fileName}`);
  return fileName;
};
