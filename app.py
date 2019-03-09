import os
import MySQLdb
import csv
import json
import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template
import pymongo
from pymongo import MongoClient
from config import password

app = Flask(__name__)


#################################################
# Database Setup
#################################################
db = MySQLdb.connect(host="localhost",    
                     user="root",         
                     passwd=password,  
                     db="World_Climate")

# create cursor object
cur = db.cursor()

# Use all the SQL you like
# cur.execute("SELECT * FROM usa WHERE Year in (1930, 1970, 2010, 2018)")
cur.execute("SELECT * FROM usa")

# print all the first cell of all the rows
data_usa = cur.fetchall()

# def import_content(filepath):
#     mng_client = pymongo.MongoClient('localhost', 27017)
#     mng_db = mng_client['TEMP']

#     if filepath == 'resources/percent_change.csv':
#         collection = 'percent_change'
#         db_cm = mng_db[collection]

#     elif filepath == 'resources/TempByCountry03-13.csv':
#         collection = 'TempByCountry'
#         db_cm = mng_db[collection]
       
#     # elif filepath == 'resources/    .csv':
#     #     collection = ''
#     #     db_cm = mng_db[collection]
    
#     # elif filepath == 'resources/    .csv':
#     #     collection = ''
#     #     db_cm = mng_db[collection]
    
#     # elif filepath == 'resources/    .csv':
#     #     collection = ''
#     #     db_cm = mng_db[collection]
    
#     # elif filepath == 'resources/    .csv':
#     #     collection = ''
#     #     db_cm = mng_db[collection]

#     cdir = os.path.dirname(__file__)
#     file_res = os.path.join(cdir, filepath)

#     data = pd.read_csv(file_res, encoding = 'unicode_escape')
#     data_json = json.loads(data.to_json(orient='records'))
#     db_cm.remove()
#     db_cm.insert(data_json)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/test_data")
def names():
    climate_csv="resources/annual_USALandTempsByCity.csv"
    climate_df=pd.read_csv(climate_csv)
    climate_dict=climate_df.to_dict()
    return jsonify(climate_dict)

@app.route("/usa_data/")
def sample_usa_data():
    """Return the usa_data for a given sample."""

    # Create a dictionary entry for each row of usa_data information
    usa_list = {}
    city_dict = {}
    for result in data_usa:
        usa_list.setdefault("year", []).append(result[0])
        usa_list.setdefault("city", []).append(result[1])
        usa_list.setdefault("country", []).append(result[2])
        usa_list.setdefault("Average_Temperature", []).append(result[3])
        usa_list.setdefault("latitude", []).append(result[4])
        usa_list.setdefault("longitude", []).append(result[5])

    #print(usa_list)
    return jsonify(usa_list)


if __name__ == "__main__":
    # filepaths = ['resources/percent_change.csv', 'resources/TempByCountry03-13.csv']

    # for filepath in filepaths:
    #     import_content(filepath)
        
    app.run()
