/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

type FeeBreakdown = {
  registrationFee: number;
  taxAmount: number;
  processingFee: number;
  totalDue: number;
};

type InitialPaymentRequest = {
  amount: number;
  category: "Youth" | "Adult";
  isCredit?: boolean;
  transactionType?: "sale" | "authorization";
  cardholderName: string;
  billToAddressLine1: string;
  billToAddressCity: string;
  billToAddressState: string;
  billToAddressPostalCode: string;
  billToAddressCountry: string;
};

type InitialPaymentResponse = {
  success: boolean;
  message: string;
  data: {
    formAction: string;
    fields: Record<string, string>;
    referenceNumber?: string;
    transactionUuid?: string;
    feeBreakdown?: FeeBreakdown;
  };
};

export const boaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initialPayment: builder.mutation<
      InitialPaymentResponse,
      InitialPaymentRequest
    >({
      query: (data) => ({
        url: `/payments/boa/initiate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useInitialPaymentMutation } = boaApi;
