const openai = require("openai");
require("dotenv").config();




//env vars
const OPENAI_API_KEY = process.env.OPENAI_KEY_PROJECT;
//const OPENAI_API_KEY_DEV = process.env.OPENAI_API_KEY_EASYREADER;
const SYSTEM_INSTRUCTIONS = process.env.SYSTEM_INSTRUCTIONS_EASYREADER;
const SYSTEM_INSTRUCTIONS_PLAIN_GERMAN = process.env.SYSTEM_INSTRUCTIONS_PLAIN_GERMAN_EASYREADER;

const client = new openai.OpenAI({ apiKey: OPENAI_API_KEY });



async function translateParagraph(paragraph) {
  try {
    const response = await client.chat.completions.create({
      model: "ft:gpt-4.1-2025-04-14:ki-projekt:einfache-sprache-uebersetzer-final-traingsdata:C45BdAhu",
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
              text: "Übersetze folgenden HTML tag in einfache Sprache nach der DIN 8581-1 und DIN ISO 24495-1, achte darauf das du mir ausschließlich den Tag gibst mit Überstezten Inhalt. Behalte die Sprache also wenn der übergebene inhalt des HTML Tags Deutsch ist dann übersrtze auf deutsch wenn er auf Englisch ist dann auf Englisch etc., behalte alle Inline tags bei, keine Kommentare, keine zusatz bemerkungen, einfach den überstezten HTML tag in den Chat hier der zu übersetzende Tag: " + paragraph,
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
