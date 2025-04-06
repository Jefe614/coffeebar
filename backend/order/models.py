# orders/models.py

from django.db import models
import uuid
from django.contrib.auth.models import User

class Order(models.Model):
    ORDER_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    order_number = models.CharField(max_length=10, unique=True, editable=False)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField(null=True, blank=True)
    is_delivery = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='cash')
    special_instructions = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Order #{self.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate a unique order number
            self.order_number = f"ORD{uuid.uuid4().hex[:5].upper()}"
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item_id = models.IntegerField()
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} x {self.name}"
    
    @property
    def subtotal(self):
        return self.price * self.quantity
    

#admin models

class RestaurantStaff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_manager = models.BooleanField(default=False)
    can_manage_orders = models.BooleanField(default=True)
    notification_preferences = models.JSONField(default=dict)
    
    def __str__(self):
        return self.user.get_full_name() or self.user.username

class OrderNotification(models.Model):
    NOTIFICATION_TYPES = (
        ('new_order', 'New Order'),
        ('status_change', 'Status Change'),
        ('special_request', 'Special Request'),
        ('cancellation', 'Cancellation'),
    )
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    staff_member = models.ForeignKey(RestaurantStaff, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - Order #{self.order.order_number}"

class OrderFeedback(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='feedback')
    staff_member = models.ForeignKey(RestaurantStaff, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    preparation_time = models.PositiveIntegerField(help_text="Actual preparation time in minutes", null=True, blank=True)
    issues = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Feedback for Order #{self.order.order_number}"