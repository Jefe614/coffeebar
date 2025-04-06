from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

from .utils import notify_staff_new_order
from .models import Order
from .serializers import OrderSerializer, OrderTrackingSerializer

class OrderAPIView(APIView):
    """
    API View to handle Order creation, update, deletion, and tracking.
    """

    def post(self, request):
        """Create a new order"""
        data = request.data.copy()
        
        
        if 'items' in data and isinstance(data['items'], list):
            for item in data['items']:
                if 'id' in item and 'item_id' not in item:
                    item['item_id'] = item['id']
        
        if 'total' in data and 'total_amount' not in data:
            data['total_amount'] = data['total']
            
        data['estimated_delivery'] = (timezone.now() + timedelta(minutes=30)).isoformat()

        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            order = serializer.save()
            
            self.send_order_confirmation_email(order)
            notify_staff_new_order(order)

            
            return Response({
                'success': True,
                'order_number': order.order_number,
                'message': 'Order placed successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def send_order_confirmation_email(self, order):
        """Send confirmation email with order details"""
        try:
            # Check if customer email exists
            if not order.customer_email:
                print(f"No email address for order {order.order_number}")
                return
                
            # Email subject
            subject = f'Coffee Bar - Your Order #{order.order_number} Confirmation'
            
            # Email content - you can use a template or create plain text
            context = {
                'order': order,
                'order_items': order.orderitem_set.all(),  # Assuming you have a related name for order items
                'total': order.total_amount,
                'estimated_delivery': order.estimated_delivery,
            }
            
            # Try to render HTML email from template
            try:
                html_message = render_to_string('orders/order_confirmation_email.html', context)
            except Exception as e:
                print(f"Error rendering email template: {e}")
                html_message = None
            
            # Plain text fallback message
            plain_message = f"""
            Thank you for your order from Coffee Bar!
            
            Order Number: {order.order_number}
            
            Order Details:
            --------------
            Total: ${order.total_amount}
            Estimated Delivery: {order.estimated_delivery.strftime('%I:%M %p') if hasattr(order.estimated_delivery, 'strftime') else order.estimated_delivery}
            
            Track your order status at: {settings.SITE_URL}/track-order?order_number={order.order_number}
            
            Thank you for choosing Coffee Bar!
            """
            
            # Send the email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.customer_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            print(f"Confirmation email sent for order {order.order_number}")
            
        except Exception as e:
            # Log the error but don't interrupt the order process
            print(f"Error sending order confirmation email: {e}")

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