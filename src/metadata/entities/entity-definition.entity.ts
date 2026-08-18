import { FieldDefinition } from './field-definition.entity';

export class EntityDefinition {
  id: string;
  name: string;
  label: string;
  fields: FieldDefinition[];

  constructor(partial: Partial<EntityDefinition>) {
    Object.assign(this, partial);

    if (!this.fields) {
      this.fields = [];
    }
  }

  addField(field: FieldDefinition): void {
    const fieldExists = this.fields.find((f) => f.name === field.name);
    if (fieldExists) {
      throw new Error(`O campo com o nome '${field.name} já existe nesta entidade.`);
    }
    this.fields.push(field);
  }
}
