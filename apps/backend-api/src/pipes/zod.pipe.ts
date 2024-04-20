import { Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

// TODO: parse action data with type guard
@Injectable()
export class ZodPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: T): T {
    this.schema.parse(value);
    return value;
  }
}
