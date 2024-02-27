import { GetCommandOutput, PutCommandOutput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T[];
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Attributes"> & {
  Attributes?: T;
};