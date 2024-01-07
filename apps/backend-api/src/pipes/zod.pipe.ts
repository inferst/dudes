import { Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: T): T {
    this.schema.parse(value);
    return value;
  }
}
