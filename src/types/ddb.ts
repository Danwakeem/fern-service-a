import { GetCommandOutput, PutCommandOutput } from "@aws-sdk/lib-dynamodb";

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Attributes"> & {
  Attributes?: T;
};