export class ResourceModel {
  id: number;
  family: number;
  name: string;
  description: string;

  constructor(id: number, family: number, name: string, description: string) {
    this.id = id;
    this.family = family;
    this.name = name;
    this.description = description;
  }
}
