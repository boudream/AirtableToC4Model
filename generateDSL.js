output.markdown('# Airtable to C4Model DSL!');
var outputStringHeader = "model{"
var outputStringFooter = "}"
var outputStringCore = "";

const d = new Date();
output.text("# DSL generated by a AirtableToC4ModelDSL script (v1.0) on" + d.toUTCString() 
+ "\n" + "# The output is trying to respect the Structurizr DSL format; allowing you to import your model the editor provided by structurizr.com"
+ "\n" + "# Airtable script developped by Matt Boudreau (boudream.com) (https://github.com/boudream) "
);

output.text("workspace \"My Workspace Title\" \"My Workspace Description\" { \n model { ");

// Load the Enterprise, Person, System, and Relationships

let enterprise_table = base.getTable("Enterprise");
let enterprise_table_query = await enterprise_table.selectRecordsAsync();


let system_table = base.getTable("System");
let external_system_view = system_table.getView("External");
let external_system_view_query = await external_system_view.selectRecordsAsync();

let internal_system_view = system_table.getView("Internal");
let internal_system_view_query = await internal_system_view.selectRecordsAsync();

let person_table = base.getTable("Person");
let external_person_view = person_table.getView("External");
let external_person_view_query = await external_person_view.selectRecordsAsync();
let internal_person_view = person_table.getView("Internal");
let internal_person_view_query = await internal_person_view.selectRecordsAsync();

let relation_table = base.getTable("Relationships");
let relation_query = await relation_table.selectRecordsAsync();

// Relationships
let relation_person_person_table = base.getTable("Person to Person");
let relation_person_person_query = await relation_person_person_table.selectRecordsAsync();

let relation_system_system_table = base.getTable("System to System");
let relation_system_system_query = await relation_system_system_table.selectRecordsAsync();

let relation_system_person_table = base.getTable("System to Person");
let relation_system_person_query = await relation_system_person_table.selectRecordsAsync();

let relation_person_system_table = base.getTable("Person to System");
let relation_person_system_query = await relation_person_system_table.selectRecordsAsync();


let styles_table = base.getTable("Styles");
let styles_table_query = await styles_table.selectRecordsAsync();

output.text("# List of External Persons");
external_person_view_query.records.forEach(record => 
    output.text(record.getCellValue("Variable") + " = person \"" + record.getCellValue("Name") + 
    "\" \"" + record.getCellValue("Description") + "\""  + " \"" + record.getCellValue("Style").name + "\""));

output.text("# List of External System");
external_system_view_query.records.forEach(record => 
    output.text(record.getCellValue("Variable") + " = softwaresystem \"" + record.getCellValue("Name") + 
    "\" \"" + record.getCellValue("Description") + "\""  
    + " \"" + record.getCellValue("Style").name + "\""));

// Separator
output.text("enterprise \"" + enterprise_table_query.records[0].getCellValue("Name") + "\" {");
 


output.text("# List of Internal Persons");
internal_person_view_query.records.forEach(record => 
    output.text(record.getCellValue("Variable") + " = person \"" + record.getCellValue("Name") + 
    "\" \"" + record.getCellValue("Description") + "\""  + " \"" + record.getCellValue("Style").name + "\""));
    
output.text("# List of Internal System");
internal_system_view_query.records.forEach(record => 
    output.text(record.getCellValue("Variable") + " = softwaresystem \"" + record.getCellValue("Name") + 
    "\" \"" + record.getCellValue("Description") + "\""  
    + " \"" + record.getCellValue("Style").name + "\""));

// Separator
output.text("}");

// This is all the relations we have 
// All the relationship type Person to Person
output.text("# Person to Person");

relation_person_person_query.records.forEach(record =>
  {
        if(record.getCellValue("Technology") != null)
        {
              output.text(record.getCellValue("Person_From_Variable") 
              + " -> " + record.getCellValue("Person_To_Variable") + " \"" + record.getCellValue("Description") + "\"" + " \"" + record.getCellValue(
              "Technology") + "\"")
        }
        else {
              output.text(record.getCellValue("Person_From_Variable") 
                + " -> " + record.getCellValue("Person_To_Variable") + " \"" + record.getCellValue("Description") + "\"")                           
        }
      }
  );



// All the relationship type System to System
output.text("# System to System");
relation_system_system_query.records.forEach(record => 
    {
      if(record.getCellValue("Technology") != null)
      {
            output.text(record.getCellValue("System_From_Variable") 
            + " -> " + record.getCellValue("System_To_Variable") + " \"" + record.getCellValue("Description") + "\"" + " \"" + record.getCellValue(
            "Technology") + "\"")
      }
      else {
            output.text(record.getCellValue("System_From_Variable") 
              + " -> " + record.getCellValue("System_To_Variable") + " \"" + record.getCellValue("Description") + "\"")                           
      }
    }
);




// All the relationship type System to Person
output.text("# System to Person");
relation_system_person_query.records.forEach(record => 
    {
      if(record.getCellValue("Technology") != null)
      {
            output.text(record.getCellValue("System_From_Variable") 
            + " -> " + record.getCellValue("Person_To_Variable") + " \"" + record.getCellValue("Description") + "\"" + " \"" + record.getCellValue(
            "Technology") + "\"")
      }
      else {
            output.text(record.getCellValue("System_From_Variable") 
              + " -> " + record.getCellValue("Person_To_Variable") + " \"" + record.getCellValue("Description") + "\"")                           
      }
    }
);


// All the relationship type System to System
output.text("# Person to System");
relation_person_system_query.records.forEach(record =>
    {
      if(record.getCellValue("Technology") != null)
      {
            output.text(record.getCellValue("Person_From_Variable") 
            + " -> " + record.getCellValue("System_To_Variable") + " \"" + record.getCellValue("Description") + "\"" + " \"" + record.getCellValue(
            "Technology") + "\"")
      }
      else {
            output.text(record.getCellValue("Person_From_Variable") 
              + " -> " + record.getCellValue("System_To_Variable") + " \"" + record.getCellValue("Description") + "\"")                           
      }
    }
);

output.text("   }");

// Now the Views 
output.text("views {");

  
// Default Views 
// For each System.
output.text("# List of Internal System Landscape Diagrams");
output.text("systemLandscape \"AllSystems\" { \n include * \n autolayout lr \n }"); 

output.text("# List of Internal System Context Diagrams");
internal_system_view_query.records.forEach(record => 
  output.text("systemContext \""+ record.getCellValue("Variable") + "\" { \n include * \n autolayout lr \n }")); 

// Specific Views can be loaded from 

// Load the ModelViews Table and their views
let modelviews_table = base.getTable("ModelViews");
let systemlandscape_view = modelviews_table.getView("Landscape");
let query_systemlandscape_view = await systemlandscape_view.selectRecordsAsync();

// All the additional systemlanscape views
output.text("# System Landscape Views");
for (const record of query_systemlandscape_view.records) {
  output.text("systemLandscape \"" +  record.getCellValue("Name") +  "\" { \n");
  var allNamesStr = record.getCellValue("Variable (from Person)");
  const myPersonArray = allNamesStr.toString().split(",");
  for(const person of myPersonArray)
  {
      output.text("include " +  person);
  }

  var allSystemNameStr = record.getCellValue("Variable (from System)");
  const mySystemArray = allSystemNameStr.toString().split(",");
  for(const system of mySystemArray)
  {
      output.text("include " +  system);
  }

  output.text("\n autolayout lr \n }");
}


// Inside the Views, we have the Style
// Paste all the configurations here
output.text("styles {"); 
styles_table_query.records.forEach(record => 
  output.text(record.getCellValue("Details"))); 
output.text("}"); 

// The end of the views
output.text("}");
