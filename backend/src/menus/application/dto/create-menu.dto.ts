export interface CreateMenuItemDto {
  label: string;
  icon?: string;
  order?: number;
  entityDefinitionId?: string;
  path?: string;
}

export interface CreateMenuGroupDto {
  name: string;
  order?: number;
  items?: CreateMenuItemDto[];
}

export interface CreateMenuDto {
  tenantId: string;
  name: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  groups?: CreateMenuGroupDto[];
}
