from django.db import models

# Create your models here.
from django.db import models

from django.utils import timezone
# Create your models here.

class ReplicateData(models.Model):
    image_url = models.CharField(max_length=500,null=True,blank=True)
    name = models.CharField(max_length=200 ,null=True,blank=True)
    owner = models.CharField(max_length=100,null=True,blank=True)
    description = models.CharField(max_length=1000,null=True,blank=True)
    category = models.CharField(max_length=30,null=True,blank=True)
    url = models.CharField(max_length=400,null=True,blank=True)
    key = models.IntegerField(null=False,default=1)
    colorfrom = models.CharField(max_length=100,null=True,blank=True)
    colorto = models.CharField(max_length=100,null=True,blank=True)
    likes = models.CharField(max_length=100,null=True,blank=True)
    github_url = models.CharField(max_length=300,null=True,blank=True)

class UserModel(models.Model):
    walletAddress = models.CharField( max_length=300, null=False, unique=True)
    balance = models.DecimalField(max_digits=20, decimal_places=8, null=True , blank=True,  default=0.0)
    predict_time = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    profile_img = models.CharField(max_length=400, null=True, blank=True) 

class PredictionModel(models.Model):
    walletAddress = models.CharField( max_length=300, null=False)
    time = models.CharField(max_length=300, null=False)
    status = models.CharField(max_length=300, null=False )
    created = models.DateTimeField(default=timezone.now)
    model = models.CharField(max_length=300, null=False)
   