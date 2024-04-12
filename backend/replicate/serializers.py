from rest_framework import serializers
from replicate.models import ReplicateData
from replicate.models import UserModel
from replicate.models import PredictionModel

class ReplicateSerializer(serializers.ModelSerializer): 
    class Meta:
        model = ReplicateData
        fields = ['image_url', 'name', 'owner', 'description', 'category', 'url', 'key', 'id', 'colorfrom', 'colorto', 'likes', 'github_url']
        ready_only_fields = ['id']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['walletAddress', 'balance', 'predict_time', 'profile_img']
        ready_only_fields = ['id','walletAddress']

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionModel
        fields = ['walletAddress', 'time', 'status', 'created', 'model']
        ready_only_fields = ['id', 'walletAddress', 'created']
