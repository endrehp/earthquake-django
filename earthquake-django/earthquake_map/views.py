from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from .forms import UploadFileForm
from django.conf.urls.static import static
from static.python_scripts.data_processing import data_processing
from .models import Earthquake_object
from django.core.files import File
from django.contrib.auth.models import User
from django.contrib import auth 

#from django.templatetags.static import static


import numpy as np
import pandas as pd    
import geojson

# Create your views here.
def admin_home(request):
    return render(request, 'earthquake_map/admin_home.html')

def public(request):
    earthquakes = Earthquake_object.objects
    return render(request, 'earthquake_map/public/index_public.html',{'earthquakes': earthquakes})

def analysis(request):
    earthquakes = Earthquake_object.objects
    return render(request, 'earthquake_map/analysis/index_analysis.html',{'earthquakes': earthquakes})



def data(request):
    earthquakes = Earthquake_object.objects
    if request.method == 'POST':
        if request.POST['title'] and request.FILES['excel_data']:
            
            
            title = request.POST['title']
            #excel_data = request.POST['excel_data']
            
            
            #earthquake.magnitude = request.POST['magnitude']
            public_url = 'media/public_' + title + '.geojson'
            private_url = 'media/private_' + title + '.geojson'
            #earthquake.geojson_public = request.FILES['excel_data']
            
            magnitude = request.POST['magnitude']
            epi_lon = request.POST['epi_lon']
            epi_lat = request.POST['epi_lat']
            
            earthquake = Earthquake_object(title=title, public_url=public_url, private_url=private_url, magnitude=magnitude, epi_lon=epi_lon, epi_lat=epi_lat)
            
            data_processing(request.FILES['excel_data'], title)
            
            earthquake.save() #inserts into database      
            earthquakes = Earthquake_object.objects
            return render(request, 'earthquake_map/data.html', {'message': 'the file is uploaded successfully', 'earthquakes': earthquakes})
        else:
            return render(request, 'earthquake_map/data.html', {'error': 'one of the required items are missing'})    
    else:
        if Earthquake_object.objects:
            
            return render(request, 'earthquake_map/data.html', {'earthquakes': earthquakes})
        else:
            return render(request, 'earthquake_map/data.html')

def editpublic(request):
    earthquakes = Earthquake_object.objects
    
    return render(request, 'earthquake_map/edit/index.html',{'earthquakes': earthquakes})


# Imaginary function to handle an uploaded file.
#from somewhere import handle_uploaded_file
#def 
'''
def handle_uploaded_file(f):
    with open('some/file/name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            #handle_uploaded_file(request.FILES['file'])
            return HttpResponseRedirect('/success/url/')
    else:
        form = UploadFileForm()
    return render(request, 'upload.html', {'form': form})

'''




def login(request):
    
    if request.user.is_authenticated:
        return redirect('home')
    
    else:

        if request.method == 'POST':
            user = auth.authenticate(username=request.POST['username'], password=request.POST['password'])

            if user is not None:
                auth.login(request, user)
                return redirect('admin_home')
            else:
                return render(request, 'earthquake_map/login/login.html', {'error': 'username or password is wrong'})
        else:
            return render(request, 'earthquake_map/login/login.html')

def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        return redirect('public')