from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from apps.payments.alatpay import AlatPay

from .models import Invoice
from .serializers import InvoiceSerializer


@extend_schema(tags=["Invoices"])
class InvoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)



    def perform_create(self, serializer):

        invoice = serializer.save(user=self.request.user)

        payment = AlatPay.generate_payment_link(invoice)

        invoice.payment_link = payment["data"]["paymentUrl"]

        invoice.payment_reference = payment["data"]["paymentReference"]

        invoice.status = Invoice.Status.SENT

        invoice.save()


@extend_schema(tags=["Invoices"])
class InvoiceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)
