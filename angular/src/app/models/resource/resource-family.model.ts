import {ResourceModel} from './resource-model.model'

export class ResourceFamily {
  id: number;
  name: string;
  description: string;
  models: ResourceModel[];

  constructor(id: number, name: string, description: string, models: ResourceModel[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.models = models;
  }
}
