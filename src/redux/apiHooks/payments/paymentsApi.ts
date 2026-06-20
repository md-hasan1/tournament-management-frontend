import baseApi from "@/redux/api/baseApi";

export interface PaymentItem {
  id: string;
  createdAt: string;
  description: string;
  status: string; // e.g., "PAID"
  amount: number; // in dollars
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number };
  data: PaymentItem[];
}

export interface PaymentsListParams {
  page?: number;
  limit?: number;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsResponse, PaymentsListParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        qp.append("page", String(page));
        qp.append("limit", String(limit));
        const qs = qp.toString();
        return {
          url: `/payments${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApi;
