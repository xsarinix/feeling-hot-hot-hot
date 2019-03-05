#!/usr/bin/python
import MySQLdb
import os

import pandas as pd
import numpy as np

from flask import Flask, jsonify, render_template

app = Flask(__name__)

# mysql db connection
db = MySQLdb.connect(host="localhost",    
                     user="root",         
                     passwd="sam",  
                     db="World_Climate")        

# create cursor object
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM usa")
cur.execute("SELECT * FROM global_temp")

# print all the first cell of all the rows
data_usa = cur.fetchall()
data_global = cur.fetchall()

#     print(row[0])
#     print(row[1])

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/usa_data/<br/>"
        f"/global_data/<br/>"
    )


@app.route("/usa_data/")
def sample_usa_data():
    """Return the usa_data for a given sample."""

    # Create a dictionary entry for each row of usa_data information
    usa_list=[]
    for result in data_usa:
        sample_usa_data = {}
        sample_usa_data["YEAR"] = result[0]
        sample_usa_data["CITY"] = result[1]
        sample_usa_data["COUNTRY"] = result[2]
        sample_usa_data["Average_Temperature"] = result[3]
        sample_usa_data["LATITUDE"] = result[4]
        sample_usa_data["LONGITUDE"] = result[5]
        usa_list.append(sample_usa_data)

    print(usa_list)
    return jsonify(usa_list)

@app.route("/global_data/")
def sample_global_data():
    """Return the global_data for a given sample."""

    # Create a dictionary entry for each row of usa_data information
    global_list=[]
    for result in data_global:
        sample_data = {}
        sample_data["YEAR"] = result[0]
        sample_data["COUNTRY"] = result[1]
        sample_data["LATITUDE"] = result[2]
        sample_data["LONGITUDE"] = result[3]
        sample_data["Average_Temperature"] = result[4]
        global_list.append(sample_data)

    print(global_list)
    return jsonify(global_list)
if __name__ == "__main__":
    app.run()