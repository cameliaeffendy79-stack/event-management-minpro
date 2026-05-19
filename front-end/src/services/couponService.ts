import api from "../lib/api";

/////////////////////////////////////////////////////
// RETURN / ASSIGN COUPON
/////////////////////////////////////////////////////

export async function returnCoupon(
  coupon: string
) {
  try {
    const response = await api.patch(
      "/users/coupon",
      {
        coupon,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update coupon:",
      error
    );

    throw error;
  }
}