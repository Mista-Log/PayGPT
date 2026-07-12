from django.db import transaction

from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.invoice.models import Invoice
from .models import Payment


@extend_schema(
    tags=["Payments"],
    summary="ALATPay Webhook",
    description="""
Webhook endpoint that receives payment notifications from ALATPay.

When a payment is successfully completed, ALATPay sends a POST request
to this endpoint. The system then:

- Finds the corresponding invoice
- Creates a payment record (if it doesn't already exist)
- Updates the invoice status to **Paid**
""",
    responses={
        200: OpenApiResponse(
            description="Payment processed successfully."
        ),
        400: OpenApiResponse(
            description="Missing payment reference."
        ),
        404: OpenApiResponse(
            description="Invoice not found."
        ),
    },
    examples=[
        OpenApiExample(
            "Successful Webhook",
            value={
                "paymentLinkReference": "payAbPTX6l4TUbn",
                "amount": 250000,
                "status": "completed",
            },
            request_only=True,
        )
    ],
)
class AlatPayWebhookView(APIView):

    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):

        data = request.data

        reference = data.get("paymentLinkReference")

        if not reference:
            return Response(
                {"error": "Missing payment reference"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            invoice = Invoice.objects.get(
                payment_reference=reference
            )
        except Invoice.DoesNotExist:
            return Response(
                {"error": "Invoice not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        Payment.objects.get_or_create(
            reference=reference,
            defaults={
                "invoice": invoice,
                "amount": data["amount"],
                "status": Payment.Status.COMPLETED,
            },
        )

        payment_status = data.get("status")

        if payment_status != "completed":
            return Response(
                {"message": "Payment not completed."},
                status=status.HTTP_200_OK,
            )

        invoice.status = Invoice.Status.PAID
        invoice.save(update_fields=["status"])

        return Response(
            {"message": "Payment processed successfully"},
            status=status.HTTP_200_OK,
        )