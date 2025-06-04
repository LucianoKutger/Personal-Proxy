const openai = require("openai");
require("dotenv").config();




//env vars
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SYSTEM_INSTRUCTIONS = process.env.SYSTEM_INSTRUCTIONS;
const DIN24495 = process.env.DIN24495
const DIN8581 = process.env.DIN8581

const client = new openai.OpenAI({ apiKey: OPENAI_API_KEY });



async function translateParagraph(paragraph) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: SYSTEM_INSTRUCTIONS,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: DIN24495
            },
            {
              type: "input_file",
              file_id: DIN8581
            },
            {
              type: "input_text",
              text: paragraph
            },
          ],
        },
      ],
    });

    return response.output_text

  } catch (error) {
    console.error('Fehler: ', error)
    throw error
  }
}

module.exports = { translateParagraph };
