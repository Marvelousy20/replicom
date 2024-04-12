export type InputSchema = {
  [key: string]: {
    type?: string;
    title: string;
    default?: string | number | boolean;
    description?: string;
    format?: string;
    maximum?: number;
    minimum?: number;
    allOf: Array<{ $ref: string }>;
    "x-order": number;
  };
};

export interface MainSchema {
  Input: {
    type: string;
    title: string;
    required: string[];
    properties: InputSchema;
  };
  width: {
    enum: number[];
    type: string;
    title: string;
    description: string;
  };
  height: {
    enum: number[];
    type: string;
    title: string;
    description: string;
  };
  [key: string]: any;
}
