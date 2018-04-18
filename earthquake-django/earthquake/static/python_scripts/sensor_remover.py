import numpy as np 
import pandas as pd 
import geojson 
from django.templatetags.static import static 

def remove_sensor(url, sn):
	print('starting remov func')
	
	with open (url, 'r') as data_file: 
		data = geojson.load(data_file)
	
	print(len(data['features']))
	
	data['features'] = [element for element in data['features'] if not int(element['properties']['Sn']) == int(sn)]
	print(len(data['features']))
	print(sn)
	print(int(data['features'][0]['properties']['Sn']))
	
	with open(url, 'w') as new_file: 
		geojson.dump(data, new_file)

def export_func(title):
	public_url = 'media/public_' + title + '.geojson'
	edit_url = 'media/edit_public_' + title + '.geojson'
	raw_url = 'media/raw_public_' + title + '.geojson'
	with open(public_url, 'r') as data_file:
		data = geojson.load(data_file)
	
	with open(raw_url, 'w') as raw_file:
		geojson.dump(data, raw_file)
	with open(edit_url, 'r') as edit_file: 
		edited_data = geojson.load(edit_file)
	with open(public_url, 'w') as public_file: 
		geojson.dump(edited_data, public_file)
	print("export success")