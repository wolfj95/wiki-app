require("dotenv").config();
const supabaseClient = require("@supabase/supabase-js");

const express = require('express')
const app = express()
const port = 3000

const supabase = supabaseClient.createClient(
  process.env.SUPABASE_PROJECT_ID,
  process.env.SUPABASE_API_KEY
);


app.get('/', async (req, res) => {
  res.send("hello world!")
})

app.get('/table/:tableName', async(req, res) => {

  let { data: table, error } = await supabase
    .from(req.params.tableName)
    .select("name")

  if (error) {
    console.log("error getting table error:");
    console.log(error);
    return
  }
  console.log(table)

  res.send(table)
})

app.get('/table/:tableName/entry/:entryId', async(req, res) => {

  let { data: entry, error } = await supabase
    .from(req.params.tableName)
    .select()
    .eq("id", req.params.entryId)

  if (error) {
    console.log("error getting entry:");
    console.log(error);
    return
  }
  console.log(entry)

  res.send(entry)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


