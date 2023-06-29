require("dotenv").config();
const supabaseClient = require("@supabase/supabase-js");

const express = require('express')
const app = express()
const port = 3000

app.set('views', './views')
app.set('view engine', 'pug')

const options = {
  db: {
    schema: 'public'
  }
}

const supabase = supabaseClient.createClient(
  process.env.SUPABASE_PROJECT_ID,
  process.env.SUPABASE_API_KEY,
  options
);


app.get('/', async (req, res) => {
  
  let { data: tables, error } = await supabase
  .rpc('get_public_tables')

  if (error) {
    console.log("error getting all tables:");
    console.log(error);
    return
  }
  console.log(tables)
  res.render('index', { tables: tables })
})

app.get('/table/:tableName', async(req, res) => {

  let { data: table, error } = await supabase
    .from(req.params.tableName)
    .select()

  if (error) {
    console.log("error getting table error:");
    console.log(error);
    return
  }
  console.log(table)
  res.render('table', {table_name: req.params.tableName, table_data: table})
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

  res.render('entry', {entry: entry[0]})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


