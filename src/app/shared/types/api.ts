
export type BaseApiResponse<T> = {
  data?: T;
  error?: string;
};


  export const requestInitialState = {
    type: undefined,
    startDate: "",
    endDate: "",
    description: ""
  }


