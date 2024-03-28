export type InputSchema = {
  [key: string]: {
    type: string;
    title: string;
    default?: string | number;
    description?: string;
    format?: string;
    maximum?: number;
    minimum?: number;
  };
};
