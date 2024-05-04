from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from replicate.models import ReplicateData
from replicate.serializers import ReplicateSerializer
from replicate.models import UserModel
from replicate.serializers import UserSerializer
from replicate.models import PredictionModel
from replicate.serializers import PredictionSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response

class ReplicateViewSet(viewsets.ModelViewSet):
    queryset = ReplicateData.objects.all().order_by('-likes')
    serializer_class = ReplicateSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
   
    def get_queryset(self):
        walletAddress = self.request.query_params.get('walletAddress', None)
        print(walletAddress)
        if walletAddress:
            return self.queryset.filter(walletAddress=walletAddress)
        return self.queryset

    def create(self, request, *args, **kwargs):
        walletAddress = request.data.get('walletAddress')
        if UserModel.objects.filter(walletAddress=walletAddress).exists():
            return Response({'error': 'Wallet address already registered'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PredictionViewSet(viewsets.ModelViewSet):
    queryset = PredictionModel.objects.all().order_by('-created')
    serializer_class = PredictionSerializer

    def get_queryset(self):
        walletAddress = self.request.query_params.get('walletAddress', None)
        if walletAddress:
            return self.queryset.filter(walletAddress=walletAddress)
        return self.queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prediction_model = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)