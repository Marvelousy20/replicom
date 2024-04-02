export type InputSchema = {
  [key: string]: {
    type?: string;
    title: string;
    default?: string | number | boolean;
    description?: string;
    format?: string;
    maximum?: number;
    minimum?: number;
    allOf?: Array<{ $ref: string }>;
    //    x-order?: number;
    "x-order": number;
  };
};
