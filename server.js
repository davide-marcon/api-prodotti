const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connessione sicura tramite variabile d'ambiente
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("Database connesso con successo"))
  .catch(err => console.error("Errore connessione:", err));

// Schema del Prodotto
const Prodotto = mongoose.model('Prodotto', {
  nome: String,
  prezzo: Number
});

// ROTTE API
app.get('/', (req, res) => res.send("API Prodotti Online"));

// 1. GET - Lista prodotti
app.get('/prodotti', async (req, res) => {
  const lista = await Prodotto.find();
  res.json(lista);
});

// 2. POST - Aggiungi prodotto
app.post('/prodotti', async (req, res) => {
  const nuovo = new Prodotto(req.body);
  await nuovo.save();
  res.status(201).json(nuovo);
});

// 3. DELETE - Elimina prodotto tramite ID
app.delete('/prodotti/:id', async (req, res) => {
  try {
    const rimosso = await Prodotto.findByIdAndDelete(req.params.id);
    if (!rimosso) return res.status(404).send("Prodotto non trovato");
    res.json({ messaggio: "Prodotto eliminato", prodotto: rimosso });
  } catch (err) {
    res.status(400).send("ID non valido");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
