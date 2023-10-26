import { ApiManager } from "./ApiManager";

export const createLoan = async (token, data) => {
  try {
    const result = ApiManager(`/loan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const findLoanById = async (token,id) => {
  try {
    const result = ApiManager(`loan/${id}`, {
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
export const findLoanBillById = async (token,id) => {
  try {
    const result = ApiManager(`loan/bill/${id}`, {
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
export const findLoanProdukType= async (token) => {
  try {
    const result = ApiManager(`/loan/product-type`, {
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

export const createLoanTopup = async (token,data) => {
  try {
    const result = ApiManager(`/loan/topup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
export const createPayment = async (token,data) => {
  try {
    const result = ApiManager(`/loan/repay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const createLoanRestructure = async (token,id,data) => {
  try {
    const result = ApiManager(``,{
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,   
    });

    return result;
    console.log(result)
  } catch (error) {
    console.log(error);
  }
};

export const findAllLoan = async (token) => {
  try {
    const result = ApiManager(`/loan`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};





