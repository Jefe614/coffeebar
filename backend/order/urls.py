# order/urls.py
from django.urls import path
from .views import OrderAPIView, TrackOrderAPIView

urlpatterns = [
    path('orders/', OrderAPIView.as_view(), name='orders-create'),
    path('orders/track/', TrackOrderAPIView.as_view(), name='orders-track'),
    # path('orders/<str:order_number>/', OrderAPIView.as_view(), name='orders-update-delete'),

]