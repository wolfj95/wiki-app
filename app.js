
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
            ${this.state.database_meta ? Object.keys(this.state.database_meta).map(function (sheet) {
              if (appComponent.state.database_meta[sheet].title_field) { 
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
          return (`
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-4xl font-semibold text-gray-200">${this.state.current_table}</h1>
          <ul class="list-disc px-5">
            ${this.state.tables[this.state.current_table].table.length > 0 ? JSON.parse(this.state.tables[this.state.current_table].table).map(function (record) {
              return (`
                <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_entry('${record["unique_id"]}');appComponent.render()">${record[appComponent.state.database_meta[appComponent.state.current_table].title_field]}</a></li>
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
          let table = JSON.parse(this.state.tables[table_name]["table"])
          let entry = table.find(record => record.unique_id == entry_id)
          let title_field = this.state.database_meta[table_name].title_field
          if (title_field) {
            html += `<h2 class="font-semibold text-gray-200 text-xl"><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${table_name}');appComponent.set_entry('${entry["unique_id"]}');appComponent.render()">${entry[title_field]}</a></h2>`
          }
          let metadata_table = JSON.parse(this.state.tables[table_name].metadata)
          for (let i = 0; i < metadata_table.length; i++) {
            let row = metadata_table[i]
            let field = row['field']
            let data_type = row['data_type']
            if (data_type != "unique_id" & field != title_field & data_type != "foreign_key") {
              html += `<p class="text-gray-200"><span class="font-semibold">${field}:</span> ${entry[field]}</p>`
            }
          } 
          html += `</div>`
          return(html)
        }

        one_to_many_representation(table_name, parent_table_name, foreign_key_column_name, target_entry_id) {
          let html = `<h2 class="font-semibold text-gray-200 text-2xl">${table_name}:</h2>`
          html += `<ul class="list-disc px-5">`
          let table = JSON.parse(this.state.tables[table_name]["table"])
          let title_field = this.state.database_meta[table_name].title_field
          if (title_field) {
            for (let j = 0; j < table.length; j++) {
              if (table[j][foreign_key_column_name] == target_entry_id) {
                html += `
                  <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${table_name}');appComponent.set_entry('${table[j]["unique_id"]}');appComponent.render()">${table[j][title_field]}</a></li>
                `
              }
            }
          } else {
            let related_table_records = JSON.parse(this.state.tables[table_name].metadata).filter(record => record.relationship_type == "one" & record.related_table != parent_table_name)
            let child_table_name = related_table_records[0].related_table
            let child_table = JSON.parse(this.state.tables[child_table_name].table)
            let child_table_foreign_key_column_name = child_table_name + "_id"
            let child_table_title_field = this.state.database_meta[child_table_name].title_field
            for (let j = 0; j < table.length; j++) {
              if (table[j][foreign_key_column_name] == target_entry_id) {
                let child_table_related_record = child_table.find(record => record.unique_id == table[j][child_table_foreign_key_column_name])
                html += `
                  <li class="text-gray-200" ><a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onclick="appComponent.set_table('${child_table_name}');appComponent.set_entry('${child_table_related_record["unique_id"]}');appComponent.render()">${child_table_related_record[child_table_title_field]}</a></li>
                `
              }
            }
          // pick foreign key that's not the parent table
          // use name/link from that table in list
          }  
          html += `</ul>`
          return(html)
        }

        article_representation(table_name, entry_id, tables_expanded_so_far, curr_header_level, depth) {
          let html = ``
          let table = JSON.parse(this.state.tables[table_name].table)
          let metadata_table = JSON.parse(this.state.tables[table_name].metadata)
          let title_field = this.state.database_meta[table_name].title_field
          if (table.find(record => record.unique_id == entry_id)[title_field]) {
            html += `<h2 class="font-semibold text-gray-200 text-4xl">${table.find(record => record.unique_id == entry_id)[title_field]}</h2>`
          }

          for (let i = 0; i < metadata_table.length; i++) {
            let row = metadata_table[i]
            let field = row['field']
            let data_type = row['data_type']
            if (data_type != "unique_id" & field != title_field) {
              if (data_type == "foreign_key") {
                let related_table_name = row["related_table"]
                if (row["relationship_type"] == "one") {
                    html += this.one_to_one_representation(related_table_name, table.find(record => record.unique_id == entry_id)[field])
                } else {
                  let foreign_key_column_name = table_name + "_id"
                  html += this.one_to_many_representation(related_table_name, table_name, foreign_key_column_name, entry_id)
                }
              } else {
                // Regular data field
                html += `<h2 class="font-semibold text-gray-200 text-2xl">${field}</h2>
                  <p class="text-gray-200">${table.find(record => record.unique_id == entry_id)[field]}</p>`
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
          let pyodide = await loadPyodide();
          await pyodide.loadPackage("pandas");
          await pyodide.runPythonAsync(`
            import js
            import pandas as pd
            import urllib
            from pyodide.http import pyfetch

            def translate(data_type):
              data_type = data_type.encode('utf-8')
              print("Translating data_type: ", data_type)
              if data_type == "texto":
                return "text"
              elif data_type == u'n\xc3\xbamero':
                return "number"
              elif data_type == "date":
                return "date"
              elif data_type == "boleano":
                return "boolean"
              elif data_type == "chave_estrangeira":
                return "foreign_key"
              elif data_type == u'id_\xc3\xbanico':
                print("uid")
                return "unique_id"
              else:
                print("other")
                return data_type

            SHEET_ID = js.appComponent.state.sheetId
            print(SHEET_ID)


            #get sheet names

            #for dev
            #url = f'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=meta&headers=1'

            #for prod
            url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=meta&headers=1'

            response = await pyfetch(url)
            if response.status == 200:
                with open("metadata.csv", "wb") as f:
                    f.write(await response.bytes())

            # 2. load the csv file
            database_meta_df = pd.read_csv("metadata.csv")
            database_meta_df.rename(columns={"nome_da_planilha": "sheetname", "campo_de_título": "title_field"}, inplace=True)
            database_meta_df.set_index("sheetname", inplace=True)
            sheet_names = database_meta_df.index.tolist()

            # Get tables
            tables_dict = {}

            for SHEET_NAME in sheet_names:
                #for dev
                #url = f'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}&headers=2'

                #for prod
                url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}&headers=2'

                response = await pyfetch(url)
                if response.status == 200:
                    with open("table.csv", "wb") as f:
                        f.write(await response.bytes())
                df = pd.read_csv("table.csv")
                tables_dict[SHEET_NAME] = {"table": df} 

            # Get metadata for tables
            meta_data = []
            for table_name, table_dict in tables_dict.items():
                new_names = {}
                table = table_dict["table"]
                for column_name in table.columns:
                    data_type = column_name.split("[")[1].replace(']','').strip()
                    data_type = translate(data_type)
                    if data_type == 'unique_id':
                        new_column_name = 'unique_id'
                    else:
                        new_column_name = column_name.split("[")[0].strip()

                  # setup foreign key relationships
                    if data_type == "foreign_key":
                        related_table = new_column_name.split("_id")[0]
                        if related_table in tables_dict.keys():
                            # add relationship data for related table to current table
                            meta_data.append([related_table, table_name+'_id', "foreign_key", table_name, "many"])
                            # setup relationship data for current table to related table
                            relationship_type = "one"
                            meta_data.append([table_name, new_column_name, data_type, related_table, relationship_type])
                        else:
                            print(f"Error while setting up relationship: {table_name} table indicates a relationship with {related_table} table, but no such table exists. No relationships were created between these tables.")
                    else:
                        related_table = None
                        relationship_type = None
                        meta_data.append([table_name, new_column_name, data_type, related_table, relationship_type])
                    new_names[column_name] = new_column_name
                if 'unique_id' not in new_names.values():
                    print(f'Table definition error: No unique_id column was specificed for {table_name} table. Table not set up.')

                else:
                    table.rename(columns=new_names,inplace=True)
                    table.set_index("unique_id", inplace=True)
                    
            tables_meta_df = pd.DataFrame(meta_data, columns=['table_name','field','data_type','related_table','relationship_type'])

            tables_dict_json = {}
            for table_name in tables_meta_df["table_name"].unique():
                table_meta_df = tables_meta_df[tables_meta_df.table_name == table_name]
                tables_dict[table_name]["metadata"] = table_meta_df
                tables_dict_json[table_name] = {"metadata": table_meta_df.to_json(orient="records"), "table": tables_dict[table_name]["table"].reset_index().to_json(orient="records")}

            # convert DFs to JSON for use in app
            database_meta_json = database_meta_df.to_json(orient="index")
          `);

          this.state.tables =  pyodide.globals.get("tables_dict_json").toJs({ dict_converter: Object.fromEntries })

          this.state.database_meta = JSON.parse(pyodide.globals.get("database_meta_json"));

          this.render();
        }
      }

      var appComponent = new App();
      appComponent.render();
