# In this document, we are going to clean a csv file 

# List the required libraries 
library(tibble)
library(tidyverse)
library(DBI)
library(plyr)
library(RSQLite)
library(dplyr)
library(sqldf)
library(readr)
library(jsonlite)

# Read the CSV file into RStudio 
raw_vehicle_registration <- read.csv(file="state_motor_vehicles_registrations_2012.csv", header=TRUE, na.strings="—")
class(raw_vehicle_registration)

# Remove the extraneous columns using dplyr by keeping the columns we want
keep_columns <- select(raw_vehicle_registration, ï..STATE, TOTAL_AUTOMOBILES,
                      BUSES_TOTAL, TOTAL_TRUCKS, MOTORCYCLES_TOTAL, 
                      ALL_MOTOR_VEHICLES_TOTAL)

# Rename Columns using the dplyr library 
keep_columns <- rename(keep_columns, replace = c("ï..STATE" = "State", "TOTAL_AUTOMOBILES"="Automobiles",
                       "BUSES_TOTAL"="Buses", "TOTAL_TRUCKS"="Trucks",
                       "MOTORCYCLES_TOTAL"="Motorcycles", 
                        "ALL_MOTOR_VEHICLES_TOTAL"="Total_Vehicles"))
                       
# Delete the redundant "Total" row 52 
vehicle_data <- keep_columns[-c(52),] 

# Check current data frame
vehicle_data

# Write cleaned data to a new CSV file
write.csv(vehicle_data, file = "cleaned_vehicle_data.csv", row.names = FALSE)

# Write the cleaned data to a JSON file using JSONLITE
vehicle_json <- toJSON(vehicle_data, dataframe = c("rows"), 
       digits = NA, matrix = c("rowmajor"), pretty = TRUE)
cat(vehicle_json)

write(vehicle_json, "Vehicle_Data.json")

# Create the SQLite Database
# Establish connection to database using RSQLite 
db <- dbConnect(RSQLite::SQLite(), dbname = "Vehicle_Database.sqlite")

# Create the empty Vehicle table
dbSendQuery(conn = db,
            "CREATE TABLE Vehicle
            (State TEXT,
            Automobiles INTEGER,
            Buses INTEGER,
            Trucks INTEGER,
            Motorcycles INTEGER,
            Total_Vehicles INTEGER)")

# dbRemoveTable(db, "Vehicle")   # Remove the tables

# Read the cleaned CSV into R 
data <- read_csv("cleaned_vehicle_data.csv")  

# Import data frames into database
dbWriteTable(conn = db, name = "Vehicle", value = data, row.names = FALSE, append = TRUE)

dbListTables(db)                 # The table in the database
dbListFields(db, "Vehicle")       # The columns in the table
dbReadTable(db, "Vehicle")        # The data in the table

# Close the connection to the database 
dbDisconnect(db) 