import { IsString, IsInt, Min, Max } from 'class-validator';

export class GenerateQuizDto {
  @IsString()
  topicId: string;

  @IsInt()
  @Min(5)
  @Max(10)
  questionCount: number = 5;
}

export class SubmitQuizDto {
  @IsString()
  attemptId: string;

  answers: Array<{
    questionId: string;
    selectedOption: string;
  }>;
}
