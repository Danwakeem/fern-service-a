import { randomUUID } from 'crypto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { ImdbService } from "../generated/api/resources/imdb/service/ImdbService";
import { DoesNotExistError } from "../generated/api";
import { IGetCommandOutput } from "../types/ddb";
import { Movie } from "../generated/serialization";

const TableName = process.env.TABLE_NAME;
const client = new DynamoDBClient();
const ddb = DynamoDBDocumentClient.from(client);

export const imdb = new ImdbService({
  get: async ({ params: { id } }, res) => {
    const { Item } = (await ddb.send(new GetCommand({
      TableName,
      Key: { id },
    }))) as IGetCommandOutput<Movie.Raw>;

    if (!Item) {
      throw new DoesNotExistError('This movie does not exist');
    }

    return res.send(Item);
  },
  create: async (req, res) => {
    const incomingMovie = req.body;
    const Item = {
      id: randomUUID(),
      ...incomingMovie,
    };

    await ddb.send(new PutCommand({
      TableName,
      Item,
    }));
    
    res.send(Item);
  },
});