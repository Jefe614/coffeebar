from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, OrderTrackingSerializer

class OrderAPIView(APIView):
    """
    API View to handle Order creation, update, deletion, and tracking.
    """

    def post(self, request):
        """Create a new order"""
        # Process the incoming data to match serializer expectations
        data = request.data.copy()
        
        # Handle the frontend data structure
        # Extract items from the frontend format
        if 'items' in data and isinstance(data['items'], list):
            # Format items to match serializer expectations
            # Make sure each item has required fields
            for item in data['items']:
                if 'id' in item and 'item_id' not in item:
                    item['item_id'] = item['id']
        
        # Make sure total_amount is properly set
        if 'total' in data and 'total_amount' not in data:
            data['total_amount'] = data['total']
            
        # Set estimated delivery time
        data['estimated_delivery'] = (timezone.now() + timedelta(minutes=30)).isoformat()

        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            order = serializer.save()
            return Response({
                'success': True,
                'order_number': order.order_number,
                'message': 'Order placed successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, order_number):
        """Update an existing order"""
        order = get_object_or_404(Order, order_number=order_number)

        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Order updated successfully'
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, order_number):
        """Delete an order"""
        order = get_object_or_404(Order, order_number=order_number)
        order.delete()
        return Response({
            'success': True,
            'message': 'Order deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class TrackOrderAPIView(APIView):
    """
    API View to track an order by order number.
    """

    def get(self, request):
        print("TrackOrderAPIView: Received GET request")

        """Retrieve an order's tracking details"""
        order_number = request.query_params.get('order_number', None)

        if not order_number:
            return Response({
                'success': False,
                'error': 'Order number is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=order_number)
            serializer = OrderTrackingSerializer(order)
            return Response({
                'success': True,
                'order': serializer.data
            }, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Order not found'
            }, status=status.HTTP_404_NOT_FOUND)