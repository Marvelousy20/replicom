from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from replicate.models import ReplicateData
from replicate.serializers import ReplicateSerializer
from replicate.models import UserModel
from replicate.serializers import UserSerializer
from replicate.models import PredictionModel
from replicate.serializers import PredictionSerializer

class ReplicateViewSet(viewsets.ModelViewSet):
    queryset = ReplicateData.objects.all().order_by('key')
    serializer_class = ReplicateSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class PredictionViewSet(viewsets.ModelViewSet):
    queryset = PredictionModel.objects.all().order_by('-created')
    serializer_class = PredictionSerializer
    permission_classes = [AllowAny]