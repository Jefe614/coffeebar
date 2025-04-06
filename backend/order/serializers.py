from rest_framework import serializers
from .models import Order, OrderFeedback, OrderItem, OrderNotification

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['item_id', 'name', 'price', 'quantity']
        
    def validate_item_id(self, value):
        if not value:
            raise serializers.ValidationError("This field is required.")
        return value

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'order_number', 'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'is_delivery', 'total_amount', 'payment_method',
            'special_instructions', 'items', 'status', 'estimated_delivery'
        ]
        read_only_fields = ['order_number', 'status', 'estimated_delivery']
    
    def validate(self, data):
        if 'total_amount' not in data:
            raise serializers.ValidationError({"total_amount": "This field is required."})
        
        if data['total_amount'] <= 0:
            raise serializers.ValidationError({"total_amount": "Total amount must be greater than zero."})
            
        # If delivery is selected, ensure address is provided
        if data.get('is_delivery', False) and not data.get('delivery_address'):
            raise serializers.ValidationError({"delivery_address": "Delivery address is required for delivery orders."})
            
        return data
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        return order
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update order items if provided
        if items_data is not None:
            # Remove existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                OrderItem.objects.create(order=instance, **item_data)
                
        return instance

class OrderTrackingSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'order_number', 'status', 'customer_name', 'total_amount',
            'created_at', 'estimated_delivery', 'items', 'is_delivery',
            'delivery_address'
        ]
        # read_only_fields = fields




class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    customer_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('order_number', 'created_at', 'updated_at')
    
    def get_customer_details(self, obj):
        return {
            'name': obj.customer_name,
            'email': obj.customer_email,
            'phone': obj.customer_phone
        }

class OrderNotificationSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    order_status = serializers.CharField(source='order.status', read_only=True)
    
    class Meta:
        model = OrderNotification
        fields = '__all__'

class OrderFeedbackSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff_member.user.get_full_name', read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = OrderFeedback
        fields = '__all__'