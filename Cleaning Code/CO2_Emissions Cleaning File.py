import os
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import sqlite3
import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, jsonify, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

# import & clean 1996 Emissions file
emissions96 = "data/egrid1996.csv"
emissions96 = pd.read_csv(emissions96)
emissions96 = emissions96.rename(columns={"PSTATABB\nState abbreviation": "State", "STCO2AN\nState 1996 annual CO2 emissions (tons)": "CO2_Emissions_1996"})
emissions96_final = emissions96[["State", "CO2_Emissions_1996"]]
# print(list(emissions96_final.columns.values))

# import & clean 2016 Emissions file
emissions16 = "data/egrid2016.csv"
emissions16 = pd.read_csv(emissions16)
emissions16 = emissions16.rename(columns={"State abbreviation": "State", "State annual CO2 emissions (tons)": "CO2_Emissions_2016"})
emissions16_final = emissions16[["State", "CO2_Emissions_2016"]]
# print(list(emissions16.columns.values))

# # merge the two datasets together
CO2_Emissions_df = pd.merge(emissions96_final, emissions16_final, on='State')
# print(list(CO2_Emissions.columns.values))

#convert merged table into an SQLite database
engine = create_engine("sqlite:///db/CO2_Emissions.sqlite")
CO2_Emissions_df.to_sql("CO2_Emissions", engine, if_exists="replace", index = True)
conn = sqlite3.connect("CO2_Emissions.db")

# CO2_Emissions = SQLAlchemy(app)
# conn.execute("SHOW TABLES;")

# #create flask homepage
# @app.route("/")
# def index():
#     """Return the homepage."""
#     return render_template("index.html")

# @app.route("/names")
# def names():
#     """Return a list of sample names."""

#     # Use Pandas to perform the sql query
#     results = db.session.query(CO2_Emissions).all()

#     # Return a list of the column names (sample names)
#     trace = [result[0] for result in results]

#     return jsonify(trace)

# @app.route("/livestock")
# def livestock_data():
#     """Return all livestock data"""
#     results = db.session.query(livestock.State, livestock.Commodity, livestock.DataItem, livestock.Value).\
#         order_by(livestock.State).all()

#     state = [result[0] for result in results]
#     commodity = [result[1] for result in results]
#     livestock_desc = [result[2] for result in results]
#     total = [result[3] for result in results]

#     trace = {
#         "state": state,
#         "commodity": commodity,
#         "livestock_desc": livestock_desc,
#         "Total": total
#     }

#     return jsonify(trace)

# @app.route("/animal_totals")
# def animal_totals():
#     """Return all livestock data"""

#     results = db.session.query(livestock.Commodity, func.sum(livestock.Value)).\
#         group_by(livestock.Commodity).all()

#     commodity = [result[0] for result in results]
#     total = [result[1] for result in results]


#     trace = {
#         "commodity": commodity,
#         "Total": total
#     }

#     return jsonify(trace)

# @app.route("/by_state/<commodity>")
# def state_totals(commodity):
#     """Return all livestock data"""

#     results = db.session.query(livestock.State, livestock.Value).\
#         filter(livestock.Commodity == func.upper(commodity)).all()

#     state = [result[0] for result in results]
#     total = [result[1] for result in results]


#     trace = {
#         "state": state,
#         "Inventory": total
#     }

#     return jsonify(trace)


# if __name__ == "__main__":
#     app.run()