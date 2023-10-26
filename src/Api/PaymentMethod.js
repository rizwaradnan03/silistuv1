import { ApiManager } from "./ApiManager";

export const FindPaymentMethod = async (token) => {
    try {
      const result = ApiManager(`/payment-method`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };