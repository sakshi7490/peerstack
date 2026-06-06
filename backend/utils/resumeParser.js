const pdfParse = require("pdf-parse");

const extractResumeText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

module.exports = extractResumeText;