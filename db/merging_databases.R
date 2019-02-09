library(tibble)
library(tidyverse)
library(DBI)
library(RSQLite)
library(dplyr)
library(sqldf)

# Create the connection to the first SQLite Database
# Establish connection to the Vehicle database using RSQLite 
vehicle_conn <- dbConnect(RSQLite::SQLite(), dbname = "Vehicle_Database.sqlite")

# List the tables in Vehicle database "Vehicle" 
dbListTables(vehicle_conn)
dbReadTable(vehicle_conn, "Vehicle")

# Repeat the above process for the Livestock database
livestock_conn <- dbConnect(RSQLite::SQLite(), dbname = "livestock.sqlite")
dbListTables(livestock_conn)
dbReadTable(livestock_conn, "livestock")

# Fix the CO2 Emissions Database
# Connect to the SQLite Database using RSQLite 
CO2_conn <- dbConnect(RSQLite::SQLite(), dbname = "CO2_Emissions.sqlite") 
dbListTables(CO2_conn)
dbReadTable(CO2_conn, "CO2_Emissions")

# State Greenhouse Gases Emissions
emissions_conn <- dbConnect(RSQLite::SQLite(), dbname = "state_emission-fixed.sqlite") 
dbListTables(emissions_conn)
dbReadTable(emissions_conn, "state_emission")

# Get the database table as data.frames 
Vehicle_Table = dbGetQuery(vehicle_conn,'select * from Vehicle')
Livestock_Table = dbGetQuery(livestock_conn,'select * from livestock')
CO2_Table = dbGetQuery(CO2_conn,'select * from CO2_Emissions')
State_Emission_Table = dbGetQuery(emissions_conn,'select * from state_emission')

# Check to see that the four data frames loaded correctly
Vehicle_Table
Livestock_Table
CO2_Table
State_Emission_Table

# Use dplyr package to create a new SQLite Database in the working directory
my_database <- dbConnect(RSQLite::SQLite(), dbname = "combined_database.sqlite")
dbListTables(my_database)

# Remove old tables 
# dbRemoveTable(my_database, "Vehicle_Table")   
# dbRemoveTable(my_database, "Livestock_Table") 
# dbRemoveTable(my_database, "CO2_Table")   
# dbRemoveTable(my_database, "State_Emission_Table") 

# Use the copy_to function from dplyr to upload data 
copy_to(my_database, Vehicle_Table, temporary = FALSE, append=TRUE) 
copy_to(my_database, Livestock_Table, temporary = FALSE, append=TRUE) 
copy_to(my_database, CO2_Table, temporary = FALSE, append=TRUE) 
copy_to(my_database, State_Emission_Table, temporary = FALSE, append=TRUE) 

# Check to see the tables were added
dbListTables(my_database)

# Connect to the newly created database 
please_work <- dbConnect(RSQLite::SQLite(), dbname = "combined_database.sqlite")

# Check and see if there are any tables
dbListTables(please_work)

# Remove the extraneous tables 
dbRemoveTable(please_work, "sqlite_stat1")   
dbRemoveTable(please_work, "sqlite_stat4")   

# Check that only the four needed tables exist
dbListTables(please_work)

# Disconnect from all databases and celebrate because that took a lot of effort
dbDisconnect(vehicle_conn)
dbDisconnect(emissions_conn)
dbDisconnect(livestock_conn)
dbDisconnect(CO2_conn)
dbDisconnect(please_work)

# Test it one last time because you have to be certain it works 
combined_conn <- dbConnect(RSQLite::SQLite(), dbname = "combined_database.sqlite")
dbListTables(combined_conn)
dbDisconnect(combined_conn)

