import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, ForeignKey, Numeric, DateTime, func

from flask import Flask, jsonify, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/livestock.sqlite"
db = SQLAlchemy(app)

class livestock(db.Model):
    __tablename__ = 'livestock'

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
        return '<livestock %r>' % (self.name)

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
    results = db.session.query(livestock.Commodity).group_by(livestock.Commodity).all()

    # Return a list of the column names (sample names)

    trace = [result[0] for result in results]

    return jsonify(trace)

@app.route("/livestock")
def livestock_data():
    """Return all livestock data"""
    results = db.session.query(livestock.State, livestock.Commodity, livestock.DataItem, livestock.Value).\
        order_by(livestock.State).all()

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
    """Return all livestock data"""

    results = db.session.query(livestock.Commodity, func.sum(livestock.Value)).\
        group_by(livestock.Commodity).all()

    commodity = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "commodity": commodity,
        "Total": total
    }

    return jsonify(trace)

@app.route("/by_state/<commodity>")
def state_totals(commodity):
    """Return all livestock data"""

    results = db.session.query(livestock.State, livestock.Value).\
        filter(livestock.Commodity == func.upper(commodity)).all()

    state = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "state": state,
        "Inventory": total
    }

    return jsonify(trace)


@app.route("/by_state_map/<commodity>")
def state_totals_map(commodity):
    """Return all livestock data"""

    results = db.session.query(livestock.State, livestock.Value).\
        filter(livestock.Commodity == func.upper(commodity)).all()

    state = [result[0] for result in results]
    total = [result[1] for result in results]


    trace = {
        "type": "feature",
        "properties": {
            "name": [result[0] for result in results],
            "total": [result[1] for result in results]
        }
    }

    return jsonify(results)


if __name__ == "__main__":
    app.run()
