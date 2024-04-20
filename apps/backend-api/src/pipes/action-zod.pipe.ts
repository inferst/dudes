import { Injectable, PipeTransform } from '@nestjs/common';
import { getActionableEntityFormSchema } from '@lib/types';
import { ZodObject, ZodRawShape } from 'zod';
import { ActionRepository } from '../admin/repositories/action.repository';

// TODO: Remove or implement validation

// It's an attempt to validate actionable entities
// Looks like we have to create specific pipes for each dto
@Injectable()
export class ActionZodPipe<T> implements PipeTransform {
  constructor(
    private readonly zodObject: ZodObject<ZodRawShape>,
    private readonly actionRepository: ActionRepository
  ) {}

  async transform(value: T): Promise<T> {
    let schema = this.zodObject;

    if (value) {
      const dto = value as Record<string, unknown>;

      if (typeof dto['actionId'] == 'number') {
        const action = (await this.actionRepository.getActions()).find(
          (action) => action.id == dto['actionId']
        );

        if (action) {
          schema = getActionableEntityFormSchema(action, this.zodObject);
        }
      }
    }

    schema.parse(value);
    return value;
  }
}
