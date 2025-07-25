

const express = require("express");
const router = express.Router();
const { translateParagraph, translatePlainGerman } = require("../services/easyReader/openai")
const { checkForTranslationinSupabase, postTranslation } = require("../services/easyReader/supabase")
const { appendValues } = require("../services/DatasetSearch/googleSheets")


router.use(express.json());

router.post("/aiTranslation", async (req, res) => {
  const { paragraph } = req.body;

  if (!paragraph) {
    return res.status(400).json({
      error: "prompt is required"
    });
  }

  try {
    const result = await translateParagraph(paragraph);

    res.status(200).json({ response: result, status: 'success' });

  } catch (error) {

    res.status(500).json({
      error: error.message ||
        'Internal Server Error'
    });

  }
});

router.post("/supabasePost", async (req, res) => {

  const { hash, mode, translation } = req.body;

  if (!hash) {

    return res.status(400).json({
      error: 'hash is missing'
    })
  }

  if (!mode) {

    return res.status(400).json({
      error: 'mode is missing'
    })
  }

  if (!translation) {

    return res.status(400).json({
      error: 'translation is missing'
    })
  }

  try {

    const result = await postTranslation(hash, mode, translation)
    res.status(200).json({ response: result, status: 'success' })

  } catch (error) {

    res.status(500).json({
      error: error.message ||
        'Internal Server Error'
    })

  }

})

router.post("/supabaseGet", async (req, res) => {
  const { hash, mode } = req.body

  if (!hash) {
    return res.status(400).json({
      error: 'hash is missing'
    })
  }

  if (!mode) {
    return res.status(400).json({
      error: 'mode is missing'
    })
  }

  try {
    const result = await checkForTranslationinSupabase(hash, mode)

    return res.status(200).json({
      translation: result, status: 'success',
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message ||
        'Internal Server Error'
    })
  }
})


router.get("/cronPing", (req, res) => {
  return res.status(200).send("Ok");
})



router.post("/googleSheet", async (req, res) => {
  console.log(req.body)
  const { text, url } = req.body;
  let response

  if (!text || !url) {
    return res.status(400).json({ error: 'Fehlende oder ungültige Daten.' });
  }

  try {

    response = await translatePlainGerman(text)

  } catch (e) {
    console.error(e)
  }



  try {
    const result = await appendValues([[text, response, url]]);
    res.json({ message: 'Werte erfolgreich hinzugefügt.', result });
  } catch (err) {
    console.error('Fehler beim Anhängen:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }

});

module.exports = router;
