import baseApi from "@/redux/api/baseApi";

export interface AdminHomeData {
  data: {
    totalAmount: number;
    totalTeam: number;
    totalPendingWavier: number;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    //register
    register: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    //social login
    socialAuth: builder.mutation({
      query: (data) => ({
        url: "/auth/social-login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    // Forgot Password
    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    //getMe
    getMe: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    //verify token
    verifyOtp: builder.mutation({
      query: (data: { email: string; otp: number }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    //resend otp
    resendOtp: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    //resetPassword
    resetPassword: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    //update user
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // update profile (multipart form-data: data + image)
    updateProfile: builder.mutation<
      { success: boolean; message: string },
      { fullName: string; phoneNumber: string; image?: File }
    >({
      query: ({ fullName, phoneNumber, image }) => {
        const form = new FormData();
        form.append("data", JSON.stringify({ fullName, phoneNumber }));
        if (image) {
          form.append("image", image);
        }
        return {
          url: "/users/profile",
          method: "PUT",
          body: form,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    //change password
    changePassword: builder.mutation({
      query: (data: { oldPassword: string; newPassword: string }) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    // Get admin home page data
    getAdminHomeData: builder.query<AdminHomeData, void>({
      query: () => ({
        url: "/users/admin/home-page",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useSocialAuthMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useResetPasswordMutation,
  useGetAdminHomeDataQuery,
} = authApi;
