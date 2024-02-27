import { randomUUID } from 'crypto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ImdbService } from "../generated/api/resources/imdb/service/ImdbService";
import { DoesNotExistError } from "../generated/api";
import { IGetCommandOutput, IScanCommandOutput } from "../types/ddb";
import { Movie, MoviePagination } from "../generated/serialization";

const TableName = process.env.TABLE_NAME;
const client = new DynamoDBClient();
const ddb = DynamoDBDocumentClient.from(client);

export const imdb = new ImdbService({
  list: async ({ query }, res) => {
    const { Items, LastEvaluatedKey } = (await ddb.send(new ScanCommand({
      TableName,
      Limit: 20,
      ExclusiveStartKey: JSON.parse(query?.nextToken),
    }))) as IScanCommandOutput<Movie.Raw>;

    const paginatedResponse: MoviePagination.Raw = {
      content: Items,
      meta: {
        nextToken: JSON.stringify(LastEvaluatedKey),
      }
    }

    return res.send(paginatedResponse);
  },
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