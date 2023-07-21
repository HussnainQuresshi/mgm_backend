//node express demo.service.ts with following apis , row , update-row, delete-row, add-row
import { Request, Response } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { publishToRabbitMQ } from '../RabbitMQ/rabbitmq.js';

export const getJsonFile = async (_req: Request, res: Response) => {
  const data = await readFile('./src/db/db.json', 'utf-8');
  res.status(200).json(JSON.parse(data));
};

export const jsonFileAction = async (req: Request, res: Response) => {
  const { event, ...data } = req.body;
  let json = JSON.parse(await readFile('./src/db/db.json', 'utf-8'));

  switch (event) {
    case 'save':
      data.ParentID = null;
      data.hasChild = null;
      json.push(data);
      break;
    case 'edit':
      const index = json.findIndex((item: any) => item.RowID == data.RowID);
      json[index] = data;
      break;
    case 'delete':
      let ids_to_delete = [
        data.RowID,
        ...json.filter((item: any) => item.ParentID == data.RowID).map((item: any) => item.RowID),
      ];
      json = json.filter((item: any) => !ids_to_delete.includes(item.RowID) && !ids_to_delete.includes(item.ParentID));
      break;
  }
  await writeFile('./src/db/db.json', JSON.stringify(json));
  await publishToRabbitMQ({
    event,
    data,
  });
  res.status(200).json({ data });
};
