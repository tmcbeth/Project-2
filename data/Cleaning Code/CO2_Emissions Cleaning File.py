import os
import pandas as pd
import numpy as np

import csv
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, ForeignKey, Numeric, DateTime, func


# import & clean 1996 Emissions file
emissions96 = "data/egrid1996.csv"
emissions96 = pd.read_csv(emissions96)
emissions96 = emissions96.rename(columns={
    "STHTIAN\nState 1996 annual heat input (MMBtu)": "Ann_Heat_Input_1996",
    "STCO2AN\nState 1996 annual CO2 emissions (tons)": "CO2_Emissions_1996",
    "STCO2RTA\nState average 1996 annual CO2 output emission rate (lbs/MWh)": "Ann_CO2_Rate_1996"})
emissions96_final = emissions96[["State", "Ann_Heat_Input_1996", "Ann_CO2_Rate_1996", "CO2_Emissions_1996"]]
# print(list(emissions96_final.columns.values))

# import & clean 2016 Emissions file
emissions16 = "data/egrid2016.csv"
emissions16 = pd.read_csv(emissions16)
emissions16 = emissions16.rename(columns={
    "State total annual heat input (MMBtu)": "Ann_Heat_Input_2016",
    "State annual CO2 emissions (tons)": "CO2_Emissions_2016",
    "State annual CO2 total output emission rate (lb/MWh)": "Ann_CO2_Rate_2016"})
emissions16_final = emissions16[["State", "Ann_Heat_Input_2016", "Ann_CO2_Rate_2016", "CO2_Emissions_2016"]]
# print(list(emissions16.columns.values))

# merge the two datasets together
CO2_Emissions_df = pd.merge(emissions96_final, emissions16_final, on='State')
CO2_Emissions_df.CO2_Emissions_2016 = CO2_Emissions_df.CO2_Emissions_2016.astype(int)
CO2_Emissions_df.Ann_CO2_Rate_2016 = CO2_Emissions_df.Ann_CO2_Rate_2016.astype(float)
CO2_Emissions_df.Ann_Heat_Input_2016 = CO2_Emissions_df.Ann_Heat_Input_2016.astype(float)
CO2_Emissions_df.set_index("State", inplace=True)

# add a difference column
difference = CO2_Emissions_df["CO2_Emissions_2016"]-CO2_Emissions_df["CO2_Emissions_1996"]
CO2_Emissions_df["CO2_Difference"] = difference

#calculate and print summary stats of 1996 and 2016 data
print(CO2_Emissions_df["CO2_Emissions_1996"].mean())
print(CO2_Emissions_df["CO2_Emissions_2016"].mean())
print(CO2_Emissions_df["Ann_CO2_Rate_1996"].mean())
print(CO2_Emissions_df["Ann_CO2_Rate_2016"].mean())
print(CO2_Emissions_df["Ann_Heat_Input_1996"].mean())
print(CO2_Emissions_df["Ann_Heat_Input_2016"].mean())

#reorder columns & convert merged table to csv
CO2_Emissions_df = CO2_Emissions_df[["Ann_Heat_Input_1996", "Ann_Heat_Input_2016", "Ann_CO2_Rate_1996", "Ann_CO2_Rate_2016", "CO2_Emissions_1996","CO2_Emissions_2016", "CO2_Difference"]]
CO2_Emissions_df.to_csv("data/Final_CO2_Emissions.csv")

#convert merged table into an SQLite database
engine = create_engine("sqlite:///db/CO2_Emissions.sqlite")
CO2_Emissions_df.to_sql("CO2_Emissions", engine, if_exists="replace", index = True)

#jsonify data
csvfile = open("data/Final_CO2_Emissions.csv", 'r')
jsonfile = open("CO2_Emissions.json", 'w')

fieldnames = ("State","Ann_Heat_Input_1996", "Ann_Heat_Input_2016", "Ann_CO2_Rate_1996", "Ann_CO2_Rate_2016", "CO2_Emissions_1996","CO2_Emissions_2016", "CO2_Difference")
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')