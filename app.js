
class App {
        state = {
          sheet_url: null,
          current_table: null,
          current_entry: null,
          database_meta:{},
          tables: {},
          locale: 'en',
          translations: null
        }

        text_size_string = [
          "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-7xl", "text-8xl", "text-9xl"]

        set_table(table_name) {
          this.state.current_table = table_name
        }
        
        set_entry(entry_id) {
          this.state.current_entry = entry_id
        }

        async update_locale(e) {
          this.state.locale = e.value
          this.state.translations = await this.fetch_translations(e.value)
          this.translate_page()
        }

        async fetch_translations(locale) {
          const response = await fetch(`lang/${locale}.json`)
          return await response.json()
        }

        async translate_page() {
          document.documentElement.lang = this.state.locale
          document.querySelectorAll('[localization-key]').forEach((element) => {
            let key = element.getAttribute('localization-key');
            let translation = this.state.translations[key]
            if (key.includes("placeholder")) {
              element.placeholder = translation
            } else {
              element.innerText = translation
            }
          })
        }

        home_view() {
          return (`
    <div class="px-4 sm:px-6 lg:px-8">
<div class="p-4 sm:flex sm:items-center">
        <div class="flex justify-between sm:flex-auto">
          <h1 class="text-5xl font-semibold text-gray-200" localization-key="title">Wiki App</h1>
          ${this.language_picker_component()}
        </div>
      </div>

     ${this.search_component()} 

     <div class="p-4 m-4 border border-gray-300 rounded-lg">
${this.state.sheet_url ? this.nav_component() : (``)}

       ${this.state.current_entry ?
          this.single_entry_component()
        : this.state.current_table ? 
          this.all_entries_in_table_component()
        : this.state.sheet_url ?
          this.all_tables_component()
        : 
          this.instructions_component()
        }
      </div>
          
    </div>
  `)
          }

        language_picker_component() {
          return (`
          <div>
            <label for="underline_select" class="sr-only">Underline select</label>
            <select id="underline_select" onchange="appComponent.update_locale(this)" class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                <option ${(this.state.locale == 'en') ? "selected" : ""} value="en">English</option>
                <option ${(this.state.locale == 'pt') ? "selected" : ""} value="pt">Portugu&ecirc;s</option>
            </select>
          </div>
`)}

        search_component() {
          return (`
      <div class="p-4 max-w-2xl">
        <form>   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" localization-key="search-sr-label">Load Data</label>
          <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="url" id="sheet-url" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" ${this.state.sheet_url ? (`value="`+this.state.sheet_url+`"`) : ""} placeholder="Enter a google sheets url..." required localization-key="search-placeholder">
              <button id="load-data" type="button" onclick="appComponent.loadData()" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"i localization-key="search-button">Load Data</button>
          </div>
        </form>
      </div>
      `)
        }

        nav_component() {
          return (`
          <nav class="p-2 w-full rounded-md">
            <ol class="list-reset flex">
              ${this.state.current_entry ? (`
                <li>
                  <a
                    onclick="appComponent.set_table(null);appComponent.set_entry(null);appComponent.render()"
                    class="text-blue-700 transition duration-150 ease-in-out hover:text-blue-800 focus:text-blue-800 active:text-blue-700" localization-key="nav-home"
                    >Home</a
                  >
                </li>
                <li>
                  <span class="mx-2 text-neutral-500 dark:text-neutral-400">/</span>
                </li>
                <li>
                  <a
                    onclick="appComponent.set_entry(null);appComponent.render()"
                    class="text-blue-700 transition duration-150 ease-in-out hover:text-blue-800 focus:text-blue-800 active:text-blue-700"
                    >${this.state.current_table}</a
                  >
                </li>
                <li>
                  <span class="mx-2 text-gray-200">/</span>
                </li>
                <li class="text-gray-200">${this.state.current_entry}</li>
              `) : (this.state.current_table ? (`
                <li>
                  <a
                    onclick="appComponent.set_table(null);appComponent.render()"
                    class="text-blue-700 transition duration-150 ease-in-out hover:text-blue-800 focus:text-blue-800 active:text-blue-700" localization-key="nav-home"
                    >Home</a
                  >
                </li>
                <li>
                  <span class="mx-2 text-neutral-500 dark:text-neutral-400">/</span>
                </li>
                <li class="text-gray-200">${this.state.current_table}</li>
              `) : (this.state.sheet_url) ? (`
                <li class="text-gray-200" localization-key="nav-home">Home</li>
              `) : (``))}
            </ol>
          </nav>
          `)
        }
        
        instructions_component() {
          return (`
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-4xl font-semibold text-gray-200" localization-key="instructions-title" >Instructions:</h1>
          <p class="text-gray-200" localization-key="instructions-body">info here about how to strucutre google sheet and link to template</p>
          <h1 class="text-4xl font-semibold text-gray-200" localization-key="troubleshooting-title">Troubleshooting</h1>
          <p class="text-gray-200" localization-key="troubleshooting-body">Common problems and how to fix them</p>
          <h1 class="text-4xl font-semibold text-gray-200" localization-key="description-title">What is this?</h1>
          <p class="text-gray-200"i localization-key="description-body">Info about what this is an how to report problems</p>
      </div>
      `)}

        all_tables_component() {
          return (`
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-4xl font-semibold text-gray-200" localization-key="articles-page-title">All Categories of Articles</h1>
          <ul class="list-disc px-5">
            ${this.state.database_meta ? this.state.database_meta.index.map(function (sheet) {
              if (appComponent.state.database_meta.loc({rows: [`"${sheet}"`]}).title_field.values[0]) { 
                return (`
                  <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${sheet}');appComponent.render()">${sheet}</a></li>
                `)
              }
            }).join('')
            : 
              `<p class="text-red-200" localization-key="articles-page-error">Error getting category information...</p>`
            }
          </ul>
        </div>
      </div>
  `)
          }

        all_entries_in_table_component() {
          let currentTable = this.state.tables[this.state.current_table]
          let titleField = appComponent.state.database_meta.loc({rows: [`"${this.state.current_table}"`]}).title_field.values[0]
          return (`
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-4xl font-semibold text-gray-200">${this.state.current_table}</h1>
          <ul class="list-disc px-5">
            ${currentTable.table.index.length > 0 ? currentTable.table.index.map(function (index) {
              return (`
                <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_entry(${index});appComponent.render()">${currentTable.table.loc({rows: [index]})[titleField].values[0]}</a></li>
              `)}).join('')
            :
              `<p class="text-red-200" localization-key="entries-page-error">Error getting entries from this category...</p>`
            }
          </ul>
        </div>
      </div>
  `)
          }
        
        single_entry_component() {
          return (`
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            ${this.article_representation(this.state.current_table, this.state.current_entry, [this.state.current_table], 7, 2)}
        </div>
      </div>
  `)
          }

        one_to_one_representation(table_name, entry_id) {
          let html = `<h2 class="font-semibold text-gray-200 text-2xl">${table_name}:</h2>`
          html += `<div class="px-4">`
          let table = this.state.tables[table_name].table
          let titleField = this.state.database_meta.loc({rows: [`"${table_name}"`]}).title_field.values[0]
          if (titleField) {
            html += `<h2 class="font-semibold text-gray-200 text-xl"><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${table_name}');appComponent.set_entry(${entry_id});appComponent.render()">${table.at(entry_id, titleField)}</a></h2>`
          }
          let metadata_table = this.state.tables[table_name].metadata
          for (let i = 0; i < metadata_table.index.length; i++) {
            let field = metadata_table.iat(i, 1)
            let data_type = metadata_table.iat(i, 2)
            if (data_type != "unique_id" & field != titleField & data_type != "foreign_key") {
              let field_data = table.at(entry_id, field)
              html += `<p class="text-gray-200"><span class="font-semibold">${field}:</span> ${field_data}</p>`
            }
          } 
          html += `</div>`
          return(html)
        }

        one_to_many_representation(table_name, parent_table_name, foreign_key_column_name, target_entry_id) {
          let html = `<h2 class="font-semibold text-gray-200 text-2xl">${table_name}:</h2>`
          html += `<ul class="list-disc px-5">`
          let table = this.state.tables[table_name].table
          let titleField = this.state.database_meta.loc({rows: [`"${table_name}"`]}).title_field.values[0]
          if (titleField) {
            let filteredDf = table.iloc({rows: table[foreign_key_column_name].eq(target_entry_id)})
            for (const index of filteredDf.index) {
              html += `
                <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${table_name}');appComponent.set_entry(${index});appComponent.render()">${table.at(index, titleField)}</a></li>
              `
            }
          } else {
            let metadata_table = this.state.tables[table_name].metadata
            let related_table_records = metadata_table.query(metadata_table["relationship_type"].eq("one").and(metadata_table["related_table"].ne(parent_table_name)))
            let child_table_name = related_table_records.iat(0, 3)
            let child_table = this.state.tables[child_table_name].table
            let child_table_foreign_key_column_name = child_table_name + "_id"
            let child_table_title_field = this.state.database_meta.loc({rows: [`"${child_table_name}"`]}).title_field.values[0]

            let filteredDf = table.loc( {rows: table[foreign_key_column_name].eq(target_entry_id)} )
            for (const index of filteredDf.index) {
              let child_table_related_record_id = table.at(index, child_table_foreign_key_column_name)
              let child_table_related_record_title = child_table.at(child_table_related_record_id, child_table_title_field)
              html += `
                <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${child_table_name}');appComponent.set_entry(${child_table_related_record_id});appComponent.render()">${child_table_related_record_title}</a></li>
              `
            }
          // pick foreign key that's not the parent table
          // use name/link from that table in list
          }  
          html += `</ul>`
          return(html)
        }

        article_representation(table_name, entry_id, tables_expanded_so_far, curr_header_level, depth) {
          let html = ``
          let table = this.state.tables[table_name].table
          let metadata_table = this.state.tables[table_name].metadata
          let titleField = appComponent.state.database_meta.loc({rows: [`"${this.state.current_table}"`]}).title_field.values[0]
          let title_field = this.state.database_meta.loc({rows: [`"${table_name}"`]}).title_field.values[0]
          if (table.at(entry_id, titleField)) {
            html += `<h2 class="font-semibold text-gray-200 text-4xl">${table.at(entry_id, titleField)}</h2>`
          }

          for (let i = 0; i < metadata_table.index.length; i++) {
            let field = metadata_table.iat(i, 1)
            let data_type = metadata_table.iat(i, 2)
            if (data_type != "unique_id" & field != title_field) {
              if (data_type == "foreign_key") {
                let related_table_name = metadata_table.iat(i, 3)
                let relationshipType = metadata_table.iat(i, 4)
                if (relationshipType == "one") {
                  let related_entry_id = table.at(entry_id, field)
                  html += this.one_to_one_representation(related_table_name, related_entry_id)
              } else {
                  let foreign_key_column_name = table_name + "_id"
                  html += this.one_to_many_representation(related_table_name, table_name, foreign_key_column_name, entry_id)
                }
              } else {
                // Regular data field
                let field_data = table.at(entry_id, field)
                html += `<h2 class="font-semibold text-gray-200 text-2xl">${field}</h2>
                  <p class="text-gray-200">${field_data}</p>`
              }
            }
          }

          return html
        }

        render() {
          app.innerHTML = this.home_view()

          if (this.translations) {
            this.state.translations = this.fetch_translations(this.state.locale)
          }
          this.translate_page()

          // Add action to input field
          var input = document.getElementById("sheet-url");
          input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              document.getElementById("load-data").click();
            }
          });
        }

        async loadData() {
          console.log('load data clicked')
          this.state.sheet_url =  new URL(document.getElementById('sheet-url').value)
          this.state.sheetId = this.state.sheet_url.pathname.split("/")[3]

          let url = `https://docs.google.com/spreadsheets/d/${this.state.sheetId}/gviz/tq?tqx=out:csv&sheet=meta&headers=1`

          //get metadata from gdoc
          let databaseMetaDf = null
          try {
              databaseMetaDf = await dfd.readCSV(url)
          } catch(err) {
              console.log("Error: ", err)
          }
          //TODO: fix accent
          databaseMetaDf.rename({"nome_da_planilha": "sheetname", "campo_de_título": "title_field"}, { inplace: true })
          
          databaseMetaDf.setIndex({column:"sheetname", inplace:true})

          // get tables from gdoc sheets
          let sheetNames = databaseMetaDf.index
          let tables = {}
          for (let i = 0; i < sheetNames.length; i++) {
            let sheetName = sheetNames[i]
            url = `https://docs.google.com/spreadsheets/d/${this.state.sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&headers=2`
            let df = null
            try {
              df = await dfd.readCSV(url)
              tables[sheetName] = {"table": df}
            } catch (err) {
              console.log("error getting table: ", sheetName)
              console.log(err)
            }
          }

          //get metadata from tables
          let metaData = []
          for (const key in tables) {
            let newNames = {}
            let table = tables[key].table
            for (const columnName of table.columns) {
              let dataType = columnName.split("[")[1].replace(']','').trim()
              dataType = translate(dataType)
              let newColumnName = ''
              if (dataType == 'unique_id') {
                newColumnName = 'unique_id'
              } else {
                newColumnName = columnName.split('[')[0].trim()
              }

              //set up foreign key relationships
              if (dataType == 'foreign_key') {
                let relatedTable = newColumnName.split('_id')[0]
                if (relatedTable in tables) {
                  // add relationship data for related table to current table
                  metaData.push([relatedTable, key+'_id', "foreign_key", key, "many"])
                  // add relationship data for current table to related table
                  metaData.push([key, newColumnName, dataType, relatedTable, "one"])
                } else {
                  console.log(`Error while setting up relationship: ${key} table indicates a relationship with ${relatedTable} table, but no such table exists. No relationships were created between these tables.`)
                }
              } else {
                let relatedTable = null
                let relationshipType = null
                metaData.push([key, newColumnName, dataType, relatedTable, relationshipType])
              }
              newNames[columnName] = newColumnName
            }
            if (!'unique_id' in newNames) {
              console.log(`Table definition error: No unique_id column was specificed for ${key} table. Table not set up.`)
            } else {
              table.rename(newNames, {inplace:true})
              table.setIndex({column:'unique_id', inplace:true})
            }
          }
          let tablesMetaDf = new dfd.DataFrame(metaData, {columns:['table_name','field','data_type','related_table','relationship_type']})

          for (const tableName of tablesMetaDf["table_name"].unique().values) {
            let tableMetaDf = tablesMetaDf.query(tablesMetaDf['table_name'].eq(tableName)).resetIndex()
            tables[tableName]["metadata"] = tableMetaDf
          }


          console.log(databaseMetaDf)
          this.state.database_meta = databaseMetaDf
          console.log(tables)
          this.state.tables = tables
          let index = 1
          let currentTable = this.state.tables.people
          let titleField = "Name"
          this.render();
        }
      }

      function translate(dataType) {
        console.log("Translating data_type: ", dataType)
        if (dataType == "texto") {
          return "text"
        } else if (dataType == 'numero') {
          return "number"
        } else if (dataType == "date") {
          return "date"
        } else if (dataType == "boleano") {
          return "boolean"
        } else if (dataType == "chave_estrangeira") {
          return "foreign_key"
        } else if (dataType == 'id_unico') {
          return "unique_id"
        } else {
          return dataType
        }
      }

      var appComponent = new App();
      appComponent.render();
