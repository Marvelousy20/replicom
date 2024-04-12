from rest_framework import routers
from replicate.viewsets import ReplicateViewSet
from replicate.viewsets import UserViewSet
from replicate.viewsets import PredictionViewSet

router = routers.SimpleRouter()

router.register('replicate', ReplicateViewSet, basename='replicate')
router.register('registeruser', UserViewSet, basename='registeruser')
router.register('prediction', PredictionViewSet, basename='prediction')

urlpatterns = router.urls