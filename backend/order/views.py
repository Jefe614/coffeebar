# orders/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.utils import timezone
from .models import Order
from .serializers import OrderSerializer, OrderTrackingSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_number'
    
    def create(self, request, *args, **kwargs):
        # Add estimated delivery time - example: 30 mins from now
        data = request.data.copy()
        estimated_delivery = timezone.now() + timedelta(minutes=30)
        data['estimated_delivery'] = estimated_delivery.isoformat()
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def track(self, request):
        """Track an order by order number"""
        order_number = request.query_params.get('order_number', None)
        
        if not order_number:
            return Response({"error": "Order number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(order_number=order_number)
            serializer = OrderTrackingSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)