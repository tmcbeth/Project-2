import os

import pandas as pd
import numpy as np
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, ForeignKey, Numeric, DateTime, func

from flask import Flask, jsonify, render_template, request, redirect, url_for, json
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/combined_database.sqlite"
db = SQLAlchemy(app)


# livestock table 

class Livestock_Table(db.Model):
    __tablename__ = 'Livestock_Table'

    Program = db.Column(db.String, primary_key=True)
    Year = db.Column(db.Integer)
    Period = db.Column(db.String)
    WeekEnding = db.Column(db.String)
    GeoLevel = db.Column(db.String)
    State = db.Column(db.String)
    StateANSI = db.Column(db.Integer)
    AgDistrict = db.Column(db.String)
    AgDistrictCode = db.Column(db.String)
    Country = db.Column(db.String)
    CountryANSI = db.Column(db.String)
    ZipCode = db.Column(db.String)
    Region = db.Column(db.String)
    Watershed_code = db.Column(db.String)
    Commodity = db.Column(db.String)
    DataItem = db.Column(db.String)
    Domain = db.Column(db.String)
    Value = db.Column(db.Integer)
    CV = db.Column(db.Integer)

    def __repr__(self):
        return '<Livestock_Table %r>' % (self.name)

# CO2 table 

class CO2_Table(db.Model):
    __tablename__ = 'CO2_Table'

    index = db.Column(db.Integer, primary_key=True)
    State = db.Column(db.String)
    CO2_Emissions_1996 = db.Column(db.Integer)
    CO2_Emissions_2016 = db.Column(db.Integer)

    def __repr__(self):
        return '<CO2 %r>' % (self.name)

# State Emission table 

class State_Emission_Table(db.Model):
    __tablename__ = 'State_Emission_Table'

    State = db.Column(db.String, primary_key=True)
    Tons_of_Greenhouse_Gas_Emissions = db.Column(db.Integer)
    Methane_Emissions = db.Column(db.Integer)
    CO2_Emissions = db.Column(db.Integer)
    State_Biomass_Generation = db.Column(db.Integer)

    def __repr__(self):
        return '<State_Emission_Table %r>' % (self.name)

# vehicle table 

class Vehicle_Table(db.Model):
    __tablename__ = 'Vehicle_Table'

    State = db.Column(db.String, primary_key=True)
    Automobiles = db.Column(db.Integer)
    Buses = db.Column(db.Integer)
    Trucks = db.Column(db.Integer)
    Motorcycles = db.Column(db.Integer)
    Total_Vehicles = db.Column(db.Integer)

    def __repr__(self):
        return '<Vehicle_Table %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()



# reflect an existing database into a new model
# Base = automap_base()


# reflect the tables
# Base.prepare(db.engine, reflect=True)

# Save references to each table
# Commodity_Metadata = Base.classes.commodity_metadata
# State = Base.classes.State


#Trying to populate tables in sqlite
# rds_connection_string = "sqlite:///db/livestock.sqlite"
# engine = create_engine(f'mysql://{rds_connection_string}')

# df = pd.read_csv("db/Livestock_US.csv")
# df.to_sql("livestock_by_state", con=engine, if_exists='append', index=False)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    results = db.session.query(Livestock_Table.Commodity).group_by(Livestock_Table.Commodity).all()

    # Return a list of the column names (sample names)

    trace = [result[0] for result in results]

    return jsonify(trace)

@app.route("/livestock")
def livestock_data():
    """Return all livestock data"""
    results = db.session.query(Livestock_Table.State, Livestock_Table.Commodity, Livestock_Table.DataItem, Livestock_Table.Value).\
        order_by(Livestock_Table.State).all()

    state = [result[0] for result in results]
    commodity = [result[1] for result in results]
    livestock_desc = [result[2] for result in results]
    total = [result[3] for result in results]

    trace = {
        "state": state,
        "commodity": commodity,
        "livestock_desc": livestock_desc,
        "Total": total
    }

    return jsonify(trace)

@app.route("/animal_totals")
def animal_totals():

    """ Total of all Animals in all States"""

    results = db.session.query(Livestock_Table.Commodity, func.sum(Livestock_Table.Value)).\
        group_by(Livestock_Table.Commodity).all()

    commodity = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "commodity": commodity,
        "Total": total
    }

    return jsonify(trace)

@app.route("/by_state/<commodity>")
def state_totals(commodity):
  
    """ Select livestock inventory by state """

    results = db.session.query(Livestock_Table.State, Livestock_Table.Value).\
        filter(Livestock_Table.Commodity == func.upper(commodity)).all()

    state = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "state": state,
        "Inventory": total
    }

    return jsonify(trace)


@app.route("/by_state_map/<commodity>")
def state_totals_map(commodity):
 
    """ Supports Data structure for Map """

    results = db.session.query(Livestock_Table.State, Livestock_Table.Value).\
        filter(Livestock_Table.Commodity == func.upper(commodity)).all()

    state = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "type": "feature",
        "properties": {
            "name": state,
            "total": total
        }
    }

    return jsonify(trace)


@app.route("/co2")
def co2():

    """Return all CO2 data"""

    results = db.session.query(CO2_Table.State, CO2_Table.CO2_Emissions_1996, CO2_Table.CO2_Emissions_2016).all()

    state = [result[0] for result in results]
    CO2_1996 = [result[1] for result in results]
    CO2_2016 = [result[2]for result in results]


    trace = {
        "state": state,
        "CO2_1996": CO2_1996,
        "CO2_2016": CO2_2016
        }

    return jsonify(trace)


@app.route("/state_emission")
def state_emission():

    """Return all state emission data"""

    results = db.session.query(State_Emission_Table.State, State_Emission_Table.Tons_of_Greenhouse_Gas_Emissions, State_Emission_Table.Methane_Emissions, State_Emission_Table.CO2_Emissions, State_Emission_Table.State_Biomass_Generation).all()

    state = [result[0] for result in results]
    Tons_of_Greenhouse_Gas_Emissions = [result[1] for result in results]
    Methane_Emissions = [result[2] for result in results]
    CO2_Emissions = [result[3] for result in results]
    State_Biomass_Generation = [result[4] for result in results]

    trace = {
        "state": state,
        "Tons_of_Greenhouse_Gas_Emissions": Tons_of_Greenhouse_Gas_Emissions,
        "Methane_Emissions": Methane_Emissions,
        "CO2_Emissions": CO2_Emissions,
        "State_Biomass_Generation": State_Biomass_Generation
        }

    return jsonify(trace)

@app.route("/vehicle")
def vehicle():

    """Return all vehicle data"""

    results = db.session.query(Vehicle_Table.State,Vehicle_Table.Automobiles,Vehicle_Table.Buses,Vehicle_Table.Trucks,Vehicle_Table.Motorcycles,Vehicle_Table.Total_Vehicles).all()

    state = [result[0] for result in results]
    Automobiles = [result[1] for result in results]
    Buses = [result[2] for result in results]
    Trucks = [result[3] for result in results]
    Motorcycles = [result[4] for result in results]
    Total_Vehicles = [result[4] for result in results]
    
    trace = {
        "state": state,
        "Automobiles": Automobiles,
        "Buses": Buses,
        "Trucks": Trucks,
        "Motorcycles": Motorcycles,
        "Total_Vehicles": Total_Vehicles
        }

    return jsonify(trace)

@app.route("/usStates")
def usStates():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "usStates.json")
    data = json.load(open(json_url))
    return jsonify(data)
    # return render_template('showjson.jade', data=data)

if __name__ == "__main__":
    app.run()