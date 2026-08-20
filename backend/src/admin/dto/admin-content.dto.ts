import { IsObject, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// These endpoints write directly into flexible, legacy Firestore documents
// (modules/topics/questions/simulations), so `data` intentionally stays a
// free-form object rather than a fully-typed shape. The validation here only
// guarantees the request actually has a well-formed body to write — it does
// not replace the whitelist/forbidNonWhitelisted checks NestJS applies to
// typed DTOs, since class-validator does not recurse into untyped properties.
export class UpsertModuleDto {
  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class UpsertTopicDto {
  @IsOptional()
  @IsString()
  topicId?: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class UpsertQuestionDto {
  @IsOptional()
  @IsString()
  questionId?: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class CreateSimulationDto {
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}
