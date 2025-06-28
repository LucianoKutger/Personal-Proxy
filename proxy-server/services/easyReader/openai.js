const openai = require("openai");
require("dotenv").config();




//env vars
const OPENAI_API_KEY = process.env.OPENAI_API_KEY_EASYREADER;
const SYSTEM_INSTRUCTIONS = process.env.SYSTEM_INSTRUCTIONS_EASYREADER;
const SYSTEM_INSTRUCTIONS_PLAIN_GERMAN = process.env.SYSTEM_INSTRUCTIONS_PLAIN_GERMAN_EASYREADER;

const client = new openai.OpenAI({ apiKey: OPENAI_API_KEY });



async function translateParagraph(paragraph) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: SYSTEM_INSTRUCTIONS,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: paragraph,
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('Fehler: ', error)
    throw error
  }
}

async function translatePlainGerman(paragraph) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: SYSTEM_INSTRUCTIONS_PLAIN_GERMAN,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Übersetze diesen Text in einfache Sprache: \n" + paragraph + "\n Achte darauf mir ausschloeßlich den Übersetzen text zu geben ohne irgendwelche einleitungssätze außerderm formuliere deisen bitte als fließtext ohne absätze",
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('Fehler: ', error)
    throw error
  }
}

module.exports = { translateParagraph, translatePlainGerman };
