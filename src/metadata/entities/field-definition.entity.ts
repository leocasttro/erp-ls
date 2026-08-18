import { FieldType } from './../enums/field-type.enum';

export class FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  isRequired: boolean;

  constructor(partial: Partial<FieldDefinition>) {
    Object.assign(this, partial);

    if (this.isRequired === undefined) {
      this.isRequired = false;
    }
  }
}
